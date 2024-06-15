module Api::V3::Accounts::Concerns::Segmentation::GenerateDescription
  extend ActiveSupport::Concern

  def case_sensitive(data)
    condi = data['case_sensitive']
    return if condi.nil? || [IN_THE_FOLLOWING, NOT_IN_THE_FOLLOWING].include?(data['operator'])

    if condi
      ' (case sensitive)'
    else
      ' (case insensitive)'
    end
  end

  def executed_or_not(condi)
    if condi
      'Has executed'
    else
      'Has not executed'
    end
  end

  def generate_sentence_query(data, i, con_ope)
    disp_name = data['displayed_name']&.titleize || (data['name'] == 'campaign_id' ? data['name']&.camelize : data['name']&.titleize)
    value = " #{data['value']} times " if data['executed']
    case data['filter_type']
    when USER_BEHAVIOR
      "#{if i != ZERO
           inner_filter_operator(con_ope, i,
                                 '')
         end}#{executed_or_not(data['executed'])} #{disp_name} #{data['operator']&.titleize&.downcase}" + value.to_s + affinity_sentence(data['primary_time_range']).to_s
    when USER_AFFINITY
      "#{inner_filter_operator(con_ope, i, '') if i != ZERO}#{executed_or_not(data['executed'])} #{disp_name}" + most_least_sentence(data)
    when 'user_behavior_attributes'
      "#{inner_filter_operator(con_ope, i,
                               'user_behavior_attributes')}#{disp_name} #{sentence_operator(data['operator'], data['value'],
                                                                                            data['value1'])}#{case_sensitive(data)}"
    else
      "#{if i != ZERO
           inner_filter_operator(con_ope, i,
                                 'user_property')
         end}#{disp_name} #{data['range']&.humanize&.downcase} #{sentence_operator(data['operator'], data['value'],
                                              data['value1'])}#{case_sensitive(data)} #{data['compare_operator']&.humanize&.downcase}"
    end
  end

  def user_behavior_attributes_query(attribute_query)
    attribute_sql = ''
    attribute_description = ''
    return { attribute_sql: attribute_sql, attribute_description: attribute_description } if attribute_query.dig('attributes', 'filters').blank?

    attribute_query.dig('attributes', 'filters').each_with_index do |attribute_data, index|
      attribute_sql += "#{inner_filter_operator(attribute_query.dig('attributes', 'filter_operator'), index,
                                                attribute_data['filter_type'])}#{chose_query(attribute_data)}"
      attribute_description += generate_sentence_query(attribute_data, index, '')
    end
    { attribute_sql: attribute_sql, attribute_description: " with attributes#{attribute_description}" }
  end

  def user_affinity_attributes(attribute_query)
    attribute_sql = ''
    attribute_description = ''
    return { attribute_sql: attribute_sql, attribute_description: attribute_description } if attribute_query.dig('user_affinity_attributes',
                                                                                                                 'filters').blank?

    attribute_query.dig('user_affinity_attributes', 'filters').each_with_index do |attribute_data, index|
      attribute_sql += "#{inner_filter_operator(attribute_query.dig('user_affinity_attributes', 'filter_operator'), index,
                                                attribute_data['filter_type'])}#{chose_query(attribute_data)}"
      attribute_description += generate_sentence_query(attribute_data, index, attribute_query.dig('user_affinity_attributes', 'filter_operator'))
    end
    attribute_description += " #{affinity_sentence(attribute_query['primary_time_range'])}"
    { attribute_sql: attribute_sql, attribute_description: " #{chose_operator_type(attribute_query['operator_type'], attribute_query['value'])} #{attribute_description}" }
  end

  def affinity_sentence(time_period)
    return if time_period.blank?

    case time_period['type']
    when IN_THE_LAST
      IN_THE_LAST.humanize.downcase + " #{time_period['value']} #{day(time_period['period_unit'])}"
    when IN_BETWEEN
      IN_BETWEEN.humanize.downcase + " #{time_period['value']} and #{time_period['value1']}#{date_sentence(time_period)}"
    when BEFORE
      " before #{time_period['value']} #{time_period['period_unit']&.humanize&.downcase}"
    when AFTER
      " after #{time_period['value']}"
    when ON
      " on #{time_period['value']}#{date_sentence(time_period)}"
    when TODAY
      " #{TODAY}"
    when YESTERDAY
      " #{YESTERDAY}"
    when THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH
      "in #{time_period['type'].humanize.downcase}"
    end
  end

  def date_sentence(time_period)
    return if time_period['period_unit'] == DATE

    " #{day(time_period['period_unit'])} ago"
  end

  def most_least_sentence(data)
    top_bottom = data['operator_type'] == MOST_NO_OF_TIMES ? 'top' : 'bottom'
    if [MOST_NO_OF_TIMES, LEAST_NO_OF_TIMES].include?(data['operator_type'])
      " #{data['operator_type'].humanize.downcase} and filter #{top_bottom} #{data['value']}% of the users #{affinity_sentence(data['primary_time_range'])} "
    else
      ''
    end
  end
end
