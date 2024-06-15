module Api::V3::Accounts::Concerns::SegmentFilterQuery
  extend ActiveSupport::Concern
  include Api::V3::Accounts::Concerns::Segmentation::ConditionalOperator
  include Api::V3::Accounts::Concerns::Segmentation::GenerateDescription
  include Api::V3::Accounts::Concerns::Segmentation::RangeOperator

  def generate_raw_sql
    raw_sql = INITIAL_RAW_SQL + ACCOUNT_ID_EQUAL_TO + Current.account.id.to_s + " #{AND} ("
    query_sentence = ''
    inc_outer_filter = params['included_filters']['filter_operator']
    inc_filters = begin
      params['included_filters']['filters']
    rescue StandardError
      {}
    end
    exc_outer_filter = begin
      params['excluded_filters']['filter_operator']
    rescue StandardError
      nil
    end
    exc_filters = begin
      params['excluded_filters']['filters']
    rescue StandardError
      {}
    end

    inc_result = looping_filters(inc_filters, raw_sql, query_sentence, inc_outer_filter) if inc_filters.present?
    if exc_filters.present?
      exc_result = looping_filters(exc_filters, raw_sql, query_sentence, exc_outer_filter)
      exclud_users_sql = EXCLUDED_RAW_SQL + "(#{exc_result[:raw_sql]})"
      exclud_query_sentence = EXCLUDED_QUERY_SENTENCE + exc_result[:query_sentence]
      final_sql = exclude_least_most(inc_result[:raw_sql], exclud_users_sql)
      final_query_sentence = inc_result[:query_sentence] + exclud_query_sentence
      raw_sql = @is_all_users ? "#{final_sql})" : final_sql
      { raw_sql: raw_sql, query_sentence: final_query_sentence }
    else
      inc_result
    end
  end

  def join_table(filter_type)
    case filter_type
    when USER_PROPERTY
      CONTACTS
    when USER_BEHAVIOR
      COMMON_EVENTS
    when USER_AFFINITY
      COMMON_EVENTS
    when USER_BEHAVIOR_ATTRIBUTES
      CONTACT_COMMON_EVENTS
    when USER_AFFINITY_ATTRIBUTES
      CONTACT_COMMON_EVENTS
    end
  end

  def chose_query(query)
    if %w[user_behavior user_affinity].include?(query['filter_type'])
      middle_query(query)
    elsif query['category'] == CUSTOM_ATTRIBUTES.titleize
      join_custom_attributes(query)
    elsif [USER_BEHAVIOR_ATTRIBUTES, USER_AFFINITY_ATTRIBUTES].include?(query['filter_type'])
      parse(query).to_s
    else
      "contacts.id in (#{INITIAL_RAW_SQL + ACCOUNT_ID_EQUAL_TO + Current.account.id.to_s} #{AND} #{parse(query)})"
    end
  end

  def parse(filter)
    case filter['data_type']
    when 'date'
      "date(#{join_table(filter['filter_type'])}.#{filter['name']}) #{conditional_operator(filter)}"
    when 'datetime'
      range_filter(filter)
    else
      case_sensitive?(filter) ? "lower(#{join_table(filter['filter_type'])}.#{filter['name']}) #{conditional_operator(filter)}" : "#{join_table(filter['filter_type'])}.#{filter['name']} #{conditional_operator(filter)}"
    end
  end

  def middle_query(filter)
    where_query = "where #{join_table(filter['filter_type'])}.name = '#{filter['name']}'#{user_behavior_attributes_query(filter)[:attribute_sql]}#{user_affinity_attributes(filter)[:attribute_sql]}"
    primary_time_range_query = set_in_the_last_query(filter['primary_time_range']).to_s

    case filter['operator_type']
    when FOR_A_MINIMUM_OF
      for_a_minimum(filter['executed'], where_query, filter['value'], primary_time_range_query)
    when MOST_NO_OF_TIMES
      most_no_of_times(filter['executed'], where_query, filter['value'], primary_time_range_query)
    when LEAST_NO_OF_TIMES
      least_no_of_times(filter['executed'], where_query, filter['value'], primary_time_range_query)
    else
      not_executed(filter['executed']).to_s + CONTACTS_ID_IN + JOIN_ASSOCIATES + where_query + primary_time_range_query + (if filter['value'].present?
      GROUP_BY_AND_HAVING_COUNT + conditional_operator(filter).to_s
    end).to_s + ')'
  end
end

def for_a_minimum(executed, where_query, value, primary_time_range_query)
  "#{not_executed(executed).to_s} in (WITH SUMMARY AS (SELECT CONTACT_COMMON_EVENTS.CONTACT_ID, COUNT(*) AS EVENT_COUNT, SUM(COUNT(*)) OVER () AS TOTAL_EVENTS, SUM(COUNT(*)) OVER (ORDER BY COUNT(*) DESC) AS RUNNING_TOTAL FROM CONTACT_COMMON_EVENTS #{JOIN_ASSOCIATES} #{where_query} #{ primary_time_range_query } GROUP BY CONTACT_COMMON_EVENTS.CONTACT_ID ) SELECT CONTACT_ID FROM SUMMARY WHERE RUNNING_TOTAL <= #{value_avg(value)} * TOTAL_EVENTS)"
end

def most_no_of_times(executed, where_query, value, primary_time_range_query)
  "#{not_executed(executed).to_s + SQL_VIEW_ID_IN + JOIN_ASSOCIATES + where_query} #{AND} #{CONTACTS}.#{ACCOUNT_ID_EQUAL_TO + Current.account.id.to_s}" + primary_time_range_query.to_s + GROUP_BY_CONTACT_ID + " ORDER BY EVENT_COUNT DESC)#{VIEW_QUERY} LIMIT #{limit_records(value)})"
end

def least_no_of_times(executed, where_query, value, primary_time_range_query)
  "#{not_executed(executed).to_s + SQL_VIEW_ID_IN + JOIN_ASSOCIATES + where_query} #{AND} #{CONTACTS}.#{ACCOUNT_ID_EQUAL_TO + Current.account.id.to_s}" + primary_time_range_query.to_s + GROUP_BY_CONTACT_ID + " ORDER BY EVENT_COUNT ASC)#{VIEW_QUERY} LIMIT #{limit_records(value)})"
end

  def limit_records(value)
    "(select round(count(distinct(contact_id)) * #{value_avg(value)}) from users_event_count)"
  end

  def join_custom_attributes(filter)
    "contacts.id in (select #{CUSTOM_ATTRIBUTES}.contact_id from #{CUSTOM_ATTRIBUTES} where #{ACCOUNT_ID_EQUAL_TO + Current.account.id.to_s} and #{CUSTOM_ATTRIBUTES}.name = '#{filter['name']}' and #{CUSTOM_ATTRIBUTES}.value #{conditional_operator(filter)})"
  end

  def inner_filter_operator(operator, indexx, filter_type)
    return " #{operator.upcase} " if indexx != ZERO

    " #{operator.upcase} " if %w[user_behavior_attributes user_affinity_attributes].include?(filter_type) && indexx.zero?
  end

  def select_statement_present?(str)
    str.include?(INITIAL_RAW_SQL)
  end

  def account_id_present?(str)
    (INITIAL_RAW_SQL + ACCOUNT_ID_EQUAL_TO + Current.account.id.to_s) == str
  end

  def looping_filters(filters, raw_sql, query_sentence, outer_filter_op)
    filters.each_with_index do |filter, outer_index|
      filter['filters'].each_with_index do |internal_filter, inner_index|
        if internal_filter['filter_type'] == DOWNCASE_ALL_USERS
          @is_all_users = true
          raw_sql = raw_sql.split(' and').first
          query_sentence += ALL_USERS
        elsif internal_filter['filter_type'] == CUSTOM_SEGMENTS
          segment = Current.account.segments.find(internal_filter['segment_id'])
          if segment.file_segment?
            raw_sql = if account_id_present?(raw_sql)
                        INITIAL_RAW_SQL + SOURCE_ID_EQUAL_TO + "ARRAY[#{segment.id}]"
                      else
                        raw_sql += "#{inner_filter_operator(filter['filter_operator'], inner_index,
                                                            '')}contacts.#{SOURCE_ID_EQUAL_TO}ARRAY[#{segment.id}]"
                      end
          else
            segment_filter = segment&.segment_filter
            raw_sql += (if inner_index != ZERO
                          inner_filter_operator(filter['filter_operator'], inner_index,
                                                '')
                        end).to_s + "contacts.id in (#{segment_filter.segment_user_ids.pluck(:user_ids).join(',')})"
          end
          query_sentence += "#{if inner_index != ZERO
                                 inner_filter_operator(filter['filter_operator'], inner_index,
                                                       '')
                               end}#{USERS_IN_CUSTOM_SEGMENTS} #{segment&.name}"
        else
          raw_sql += "#{inner_filter_operator(filter['filter_operator'], inner_index, internal_filter['filter_type'])}#{chose_query(internal_filter)}"
          query_sentence += generate_sentence_query(internal_filter, inner_index, filter['filter_operator'])
          query_sentence += (user_behavior_attributes_query(internal_filter)[:attribute_description]).to_s
          query_sentence += (user_affinity_attributes(internal_filter)[:attribute_description]).to_s
        end
      end
      unless outer_index == filters.rindex(filters.last)
        raw_sql += " #{outer_filter_op&.to_s&.upcase} "
        query_sentence += " #{outer_filter_op&.to_s&.upcase} "
      end
    end
    raw_sql = @is_all_users ? raw_sql : "#{raw_sql})"
    { count_raw_sql: INITIAL_COUNT_SQL + raw_sql.delete_prefix(INITIAL_RAW_SQL).to_s, raw_sql: raw_sql, query_sentence: query_sentence }
  end

  def campaign_flow?
    params[:segment_filter_id].present? || (params[:segment_id] && params[:segment_name]).present?
  end

  def segment_filter_exclude_users
    raw_sql = ''
    query_sentence = ''
    if params[:excluded_filters].present?
      exc_result = looping_filters(params['excluded_filters']['filters'], raw_sql, query_sentence, params['excluded_filters']['filter_operator'])
      build_segment_filter(exc_result)
    else
      find_segment_filter || Current.account.segments.find_by(id: params[:segment_id])&.segment_filter
    end
  end

  def build_segment_filter(exc_result)
    exclude_sql = EXCLUDED_RAW_SQL + "(#{INITIAL_RAW_SQL}#{ACCOUNT_ID_EQUAL_TO}#{Current.account.id} and #{exc_result[:raw_sql]}"
    segment = Current.account.segments.find(params[:segment_id])
    if segment.file_segment?
      sql_query = INITIAL_RAW_SQL + SOURCE_ID_EQUAL_TO + "ARRAY[#{segment.id}]" + exclude_sql
      description = segment.description + EXCLUDED_QUERY_SENTENCE + exc_result[:query_sentence]
      filter_hash = { 'excluded_filters' => params['excluded_filters'].as_json }
    else
      old_sf = segment&.segment_filter || find_segment_filter
      sql_query = old_sf.sql_query + exclude_sql
      description = old_sf.description + EXCLUDED_QUERY_SENTENCE + exc_result[:query_sentence]
      filter_hash = old_sf.filter_hash.merge!('excluded_filters' => params['excluded_filters'].as_json)
    end
    data = {raw_sql: sql_query}

    count_raw_sql = INITIAL_COUNT_SQL + sql_query.delete_prefix(INITIAL_RAW_SQL).to_s
    users_count = begin
                    Segment.get_contacts_count(count_raw_sql).first['count']
                  rescue StandardError => e
                    Rails.logger.error(e.message)
                    ZERO
                  end
    new_sf = Current.account.segment_filters.create(users_count: users_count, description: description, filter_hash: filter_hash, audience_type: old_sf&.audience_type, exclude_users: true, last_refreshed_at: DateTime.now)
    Segmentation::SegmentFilterWorker.perform_async(new_sf.id, data, Current.account.id, params.as_json)
    new_sf
  end

  def case_sensitive?(filter)
    (!(filter['case_sensitive']) && str?(filter['data_type'])) && [IN_THE_FOLLOWING, NOT_IN_THE_FOLLOWING].exclude?(filter['operator'])
  end

  def value_avg(value)
    value.to_f / 100.0
  rescue StandardError => e
    Rails.logger.error(e.message)
    ZERO
  end

  def find_segment_filter
    Current.account.segment_filters.find_by(id: params[:segment_filter_id])
  end
end
