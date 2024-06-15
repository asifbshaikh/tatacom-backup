module Api::V3::Accounts::Concerns::Segmentation::ConditionalOperator
  extend ActiveSupport::Concern

  def conditional_operator(filter)
    operator = filter['operator']
    value = filter['value']
    value1 = filter['value1']
    case_sensitive = filter['case_sensitive']
    data_type = filter['data_type']

    case operator
    when IS then "= #{lower_case(case_sensitive, value, data_type)}"
    when ON then "= '#{value}'"
    when BEFORE then "< '#{value}'"
    when AFTER then "> '#{value}'"
    when GREATER_THAN then "> '#{value}'"
    when IN_THE_NEXT then "BETWEEN DATE(NOW()) AND DATE(NOW() + INTERVAL '#{value} DAY')"
    when IN_THE_LAST then "BETWEEN (DATE(NOW() - INTERVAL '#{value} DAY')) AND DATE(NOW())"
    when IS_TODAY then '= DATE(NOW())'
    when EXISTS then 'IS NOT NULL'
    when DOES_NOT_EXIST then 'IS NULL'
    when IS_BETWEEN then "between '#{value}' and '#{value1}'"
    when BETWEEN then "between '#{value}' and '#{value1}'"
    when IS_NOT then "!= '#{value}'"
    when CONTAINS then "#{like_or_ilike(case_sensitive)} '%#{value}%'"
    when DOES_NOT_CONTAIN then "NOT #{like_or_ilike(case_sensitive)} '%#{value}%'"
    when STARTS_WITH then "#{like_or_ilike(case_sensitive)} '#{value}%'"
    when DOES_NOT_START_WITH then "NOT #{like_or_ilike(case_sensitive)} '#{value}%'"
    when ENDS_WITH then "#{like_or_ilike(case_sensitive)} '%#{value}'"
    when DOES_NOT_END_WITH then "NOT #{like_or_ilike(case_sensitive)} '%#{value}'"
    when IN_THE_FOLLOWING then "IN ('#{value.map(&:to_s).join("','")}')"
    when NOT_IN_THE_FOLLOWING then "NOT IN ('#{value.map(&:to_s).join("','")}')"
    when IS_EQUAL_TO then "= #{number_data_type(data_type, value)}"
    when IS_NOT_EQUAL_TO then "!= #{number_data_type(data_type, value)}"
    when IS_NOT_BETWEEN then "not between #{number_data_type(data_type, value)} and #{number_data_type(data_type, value1)}"
    when IS_LESS_THAN then "< #{number_data_type(data_type, value)}"
    when IS_GREATER_THAN then "> #{number_data_type(data_type, value)}"
    when EXACTLY then "= #{value}"
    when AT_LEAST then ">= #{value}"
    when AT_MOST then "<= #{value}"
    end
  end

  def sentence_operator(operator, value = nil, value1 = nil)
    case operator
    when IS then "is #{value}"
    when ON then "is on #{value}"
    when BEFORE then "is before #{value}"
    when AFTER then "is after #{value}"
    when GREATER_THAN then "is greater than #{value}"
    when IN_THE_NEXT then "is in the next #{value}"
    when IN_THE_LAST then "is in the last #{value}"
    when IS_TODAY then 'is today.'
    when EXISTS then 'is exists'
    when DOES_NOT_EXIST then 'does not exists'
    when IS_BETWEEN then "is between #{value} AND #{value1}"
    when BETWEEN then "is between #{value} AND #{value1}"
    when IS_NOT then "is not #{value}"
    when CONTAINS then "contains #{value}"
    when DOES_NOT_CONTAIN then "does not contain #{value}"
    when STARTS_WITH then "start with #{value}"
    when DOES_NOT_START_WITH then "does not start with #{value}"
    when ENDS_WITH then "ends with #{value}"
    when DOES_NOT_END_WITH then "does not end with #{value}"
    when IN_THE_FOLLOWING then "in #{value}"
    when NOT_IN_THE_FOLLOWING then "not in #{value}"
    when IS_EQUAL_TO then "is equal to #{value}"
    when IS_NOT_EQUAL_TO then "is not equal to #{value}"
    when IS_NOT_BETWEEN then "is not between #{value} and #{value1}"
    when IS_LESS_THAN then "is less than #{value}"
    when IS_GREATER_THAN then "is greater than #{value}"
    when IS_THIS_MONTH then "is this month"
    end
  end

  def chose_operator_type(op_type, value)
    case op_type
    when PREDOMINANTLY
      'predominantly with '
    when FOR_A_MINIMUM_OF
      "for a minimum of #{value}% of the times with "
    when MOST_NO_OF_TIMES
      'most no. of times'
    when LEAST_NO_OF_TIMES
      'least no. of times'
    else
      ''
    end
  end

  def set_in_the_last_query(time_period)
    return if time_period.blank?

    is_between = (time_period['period_unit'] == DAYS_AGO) && (time_period['type'] == IN_BETWEEN)

    period_unit = time_period['period_unit']

    value = is_between ? time_period['value1'] : time_period['value']
    value1 = is_between ? time_period['value'] : time_period['value1']

    case time_period['type']
    when IN_THE_LAST
      " and DATE(#{CONTACT_COMMON_EVENTS_CREATED_AT}) >= #{days_vs_date(period_unit, value)}"
    when IN_BETWEEN
      " and DATE(#{CONTACT_COMMON_EVENTS_CREATED_AT}) between #{days_vs_date(period_unit, value)} AND #{days_vs_date(period_unit, value1)}"
    when BEFORE
      " and DATE(#{CONTACT_COMMON_EVENTS_CREATED_AT}) < #{days_vs_date(period_unit, value)}"
    when AFTER
      " and DATE(#{CONTACT_COMMON_EVENTS_CREATED_AT}) > #{days_vs_date(period_unit, value)}"
    when ON
      " and DATE(#{CONTACT_COMMON_EVENTS_CREATED_AT}) = #{days_vs_date(period_unit, value)}"
    when TODAY
      " and DATE(#{CONTACT_COMMON_EVENTS_CREATED_AT})  = #{current_date_time(time_period['period_unit'])}"
    when YESTERDAY
      " and DATE(#{CONTACT_COMMON_EVENTS_CREATED_AT}) = DATE(CURRENT_DATE - INTERVAL '1 day')"
    when THIS_WEEK
      " and EXTRACT(WEEK FROM #{CONTACT_COMMON_EVENTS_CREATED_AT}) = EXTRACT(WEEK FROM #{current_date_time(time_period['period_unit'])})"
    when LAST_WEEK
      " and DATE(#{CONTACT_COMMON_EVENTS_CREATED_AT}) >= #{current_date_time(time_period['period_unit'])} - #{INTERVAL} '1 week'"
    when THIS_MONTH
      " and EXTRACT(MONTH FROM #{CONTACT_COMMON_EVENTS_CREATED_AT}) = EXTRACT(MONTH FROM #{current_date_time(time_period['period_unit'])})"
    when LAST_MONTH
      " and DATE(#{CONTACT_COMMON_EVENTS_CREATED_AT}) >= #{current_date_time(time_period['period_unit'])} - #{INTERVAL} '1 month'"
    end
  end

  def like_or_ilike(case_sensitive)
    case_sensitive ? 'LIKE' : 'ILIKE'
  end

  def str?(data_type)
    data_type == 'string'
  end

  def lower_case(case_sensitive, value, data_type)
    !case_sensitive && str?(data_type) ? "lower('#{value}')" : "'#{value}'"
  end

  def current_date_time(time_period)
    time_period == 'hours' ? 'NOW()' : CURRENT_DATE
  end

  def days_vs_date(period_unit, value)
    if period_unit == DATE
      "'#{value}'::timestamp"
    elsif period_unit == WEEKS
      "#{current_date_time(period_unit)} - #{INTERVAL} '#{value.to_i * DAYS_IN_WEEK}' day"
    else
      "#{current_date_time(period_unit)} - #{INTERVAL} '#{value}' #{day(period_unit)&.singularize}"
    end
  end

  def day(value)
    value == DAYS_AGO ? DAYS : value
  end

  def not_executed(condi)
    if condi
      'contacts.id'
    else
      'contacts.id not'
    end
  end

  def number_data_type(data_type, value)
    data_type == NUMBER ? "'#{value}'" : value
  end
end
