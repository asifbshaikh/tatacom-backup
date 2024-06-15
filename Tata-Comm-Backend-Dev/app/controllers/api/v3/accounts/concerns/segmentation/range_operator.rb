module Api::V3::Accounts::Concerns::Segmentation::RangeOperator
  include Api::V3::Accounts::Concerns::Segmentation::TimeDateMonth

  def range_filter(filter)
    case filter['range']
    when DAILY_WHERE_THE_HOUR
      build_daily_hour_query(filter)
    when WEEKLY_WHERE_THE_DAY
      build_query(filter, 'ISODOW')
    when MONTHLY_WHERE_THE_DAY
      build_query(filter, 'DAY')
    when YEARLY_WHERE_THE_MONTH
      build_query(filter, 'MONTH')
    when YEARLY_WHERE_THE_DATE
      build_query(filter, 'DAY')
    else
      "date(#{join_table(filter['filter_type'])}.#{filter['name']}) #{conditional_operator(filter)}"
    end
  end

  def build_daily_hour_query(data)
    case data['operator']
    when IS
      "DATE_PART('hour', #{data['name']}) = #{parse_value(data['value'], times)}"
    when IS_BETWEEN
      "DATE_PART('hour', #{data['name']}) between #{parse_value(data['value'], times)} and #{parse_value(data['value1'], times)}"
    when IN_THE_FOLLOWING
      "DATE_PART('hour', #{data['name']}) in (#{parse_value(data['value'], times)})"
    end
  end

  def build_query(data, sql_func)
    case data['operator']
    when IS
      extract_condition(data, sql_func)
    when IS_BETWEEN
      extract_between_condition(data, sql_func)
    when IN_THE_NEXT
      if data['range'] == YEARLY_WHERE_THE_MONTH
        "EXTRACT(#{sql_func} FROM #{data['name']}) = EXTRACT(#{sql_func} FROM CURRENT_DATE + INTERVAL '#{data['value']}' #{sql_func})"
      else
        "EXTRACT(#{sql_func} FROM #{data['name']}) = EXTRACT(#{sql_func} FROM CURRENT_DATE + INTERVAL '#{data['value']}' day) and #{data['name']} between CURRENT_DATE and CURRENT_DATE + INTERVAL '#{data['value']}' day"
      end
    when IN_THE_LAST
      if data['range'] == YEARLY_WHERE_THE_MONTH
        "EXTRACT(#{sql_func} FROM #{data['name']}) = EXTRACT(#{sql_func} FROM CURRENT_DATE - INTERVAL '#{data['value']}' #{sql_func})"
      else
        "EXTRACT(#{sql_func} FROM #{data['name']}) = EXTRACT(#{sql_func} FROM CURRENT_DATE - INTERVAL '#{data['value']}' day) and #{data['name']} between CURRENT_DATE - INTERVAL '#{data['value']}' day and CURRENT_DATE"
      end
    when IS_TODAY
      "EXTRACT(#{sql_func} FROM #{data['name']}) = EXTRACT(#{sql_func} FROM CURRENT_DATE)"
    when IS_THIS_MONTH
      "EXTRACT(#{sql_func} FROM #{data['name']}) = EXTRACT(#{sql_func} FROM CURRENT_DATE)"
    when IN_THE_FOLLOWING
      if data['range'] == YEARLY_WHERE_THE_MONTH
        "EXTRACT(#{sql_func} FROM #{data['name']}) in (#{parse_value(data['value'], months)})"
      else
        "EXTRACT(#{sql_func} FROM #{data['name']}) in (#{parse_value(data['value'], weekdays)})"
      end
    end
  end

  def parse_value(val, array_value)
    if val.is_a?(Array)
      array_value.flat_map { |obj| val.map(&:to_sym).map { |value| obj[value] if obj.key?(value) } }.compact.join(',')
    else
      array_value.find { |obj| obj.key?(val&.to_sym) }&.dig(val&.to_sym)
    end
  end

  def extract_condition(filter, sql_func)
    case filter['compare_operator']
    when DAY
      "EXTRACT(#{sql_func} FROM #{filter['name']}) = #{parse_value(filter['value'], weekdays)}"
    when DAYS_AGO
      "contacts.#{filter['name']} = CURRENT_DATE - INTERVAL '#{filter['value']}' DAY"
    when DAYS_FROM_NOW
      "contacts.#{filter['name']} = CURRENT_DATE + INTERVAL '#{filter['value']}' DAY"
    when DATE_MONTH
      "EXTRACT(MONTH FROM #{filter['name']}) = EXTRACT(MONTH FROM '#{filter['value']}'::timestamp) AND EXTRACT(DAY FROM #{filter['name']}) = EXTRACT(DAY FROM '#{filter['value']}'::timestamp)"
    when MONTH
      "EXTRACT(#{sql_func} FROM #{filter['name']}) = #{parse_value(filter['value'], months)}"
    when MONTH_AGO
      "EXTRACT(MONTH FROM #{filter['name']}) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '#{filter['value']} months') AND EXTRACT(YEAR FROM #{filter['name']}) = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '#{filter['value']} months')"
    when MONTH_FROM_NOW
      "EXTRACT(MONTH FROM #{filter['name']}) = EXTRACT(MONTH FROM CURRENT_DATE + INTERVAL '#{filter['value']} months') AND EXTRACT(YEAR FROM #{filter['name']}) = EXTRACT(YEAR FROM CURRENT_DATE + INTERVAL '#{filter['value']} months')"
    end
  end

  def extract_between_condition(filter, sql_func)
    case filter['compare_operator']
    when DAY
      "EXTRACT(#{sql_func} FROM #{filter['name']}) between #{parse_value(filter['value'], weekdays)} and #{parse_value(filter['value1'], weekdays)}"
    when DAYS_AGO
      "contacts.#{filter['name']} between (CURRENT_DATE - INTERVAL '#{filter['value1']}' DAY) and (CURRENT_DATE - INTERVAL '#{filter['value']}' DAY)"
    when DAYS_FROM_NOW
      "contacts.#{filter['name']} between (CURRENT_DATE + INTERVAL '#{filter['value']}' DAY) and (CURRENT_DATE + INTERVAL '#{filter['value1']}' DAY)"
    when DATE_MONTH
      "EXTRACT(MONTH FROM #{filter['name']}) between EXTRACT(MONTH FROM '#{filter['value']}'::timestamp) AND EXTRACT(MONTH FROM '#{filter['value1']}'::timestamp) AND EXTRACT(DAY FROM #{filter['name']}) between EXTRACT(DAY FROM '#{filter['value']}'::timestamp) AND EXTRACT(DAY FROM '#{filter['value1']}'::timestamp)"
    when MONTH
      "EXTRACT(#{sql_func} FROM #{filter['name']}) between #{parse_value(filter['value'], months)} and #{parse_value(filter['value1'], months)}"
    when MONTH_AGO
      "EXTRACT(MONTH FROM #{filter['name']}) between EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '#{filter['value1']} months') AND EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '#{filter['value']} months') AND EXTRACT(YEAR FROM #{filter['name']}) between EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '#{filter['value1']} months') AND EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '#{filter['value']} months')"
    when MONTH_FROM_NOW
      "EXTRACT(MONTH FROM #{filter['name']}) between EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '#{filter['value']} months') AND EXTRACT(MONTH FROM CURRENT_DATE + INTERVAL '#{filter['value1']} months') AND EXTRACT(YEAR FROM #{filter['name']}) between EXTRACT(YEAR FROM CURRENT_DATE + INTERVAL '#{filter['value']} months') AND EXTRACT(YEAR FROM CURRENT_DATE + INTERVAL '#{filter['value1']} months')"
    end
  end

  def exclude_least_most(included_query, excluded_query)
    return (included_query + excluded_query) unless included_query.include?(ORDER_BY)
    first_query, second_query = included_query.split(ORDER_BY)
    first_query.to_s + excluded_query.to_s + " #{ORDER_BY} " + second_query.to_s
  end
end
