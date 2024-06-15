## Adding deep compact method to Hash class
class Hash
  def deep_compact
    compact.transform_values do |value|
      next value unless value.is_a? Hash
      value.deep_compact
    end.reject { |_k, v| v.blank? }
  end
end
