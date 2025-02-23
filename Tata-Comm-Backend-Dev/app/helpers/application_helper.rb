module ApplicationHelper
  def available_locales_with_name
    LANGUAGES_CONFIG.map { |_key, val| val.slice(:name, :iso_639_1_code) }
  end

  def transalate(complete_path)
    I18n.t(complete_path)
  end
end
