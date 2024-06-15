class SegmentParam
  def self.direct_from_filter
    {
      "segment": {
      "name": "suraj test",
      "segment_type": "Filter"
      },
      "created_from": "direct_from_filter",
      "included_filters": {
        "filter_operator": "and",
        "filters": [
          {
            "filter_operator": "or",
            "filter_type": "nested_filters",
            "filters": [
              {
                "filter_type": "all_users"
              }
            ]
          }
        ]
      },
      "exexcluded_filters": {
        "filter_operator": "and",
        "filters": [
          {
            "filter_operator": "or",
            "filter_type": "nested_filters",
            "filters": [
              {
                "filter_type": "filterByUsers"
              }
            ]
          }
        ]
      }
    }.with_indifferent_access
  end

  def self.user_count_by_filter
    {
      "included_filters": {
        "filters": [
          {
            "filter_operator": "or",
            "filter_type": "nested_filters",
            "filters": [
              {
                "filter_type": "all_users",
                "name": "All Users",
                "id": "digo_all_users"
              }
            ]
          }
        ]
      }
    }.with_indifferent_access
  end

  def self.export_user_params
    {
      "file_name": "jhvjhvuj",
      "file_headers": {
          "contact_columns": ["name", "email", "phone_number"],
          "custom_columns": ["ad_impression_count_by_mediation_3"]
      }
    }.with_indifferent_access
  end

  def self.direct_from_query(account_id, segment_filter_id)
    {
     "segment": {
         "name": "DirecrFromQuery",
         "segment_type": "Filter",
         "source_type": "Segmentation",
         "segment_filter_id": segment_filter_id,
         "account_id": account_id
     },
     "created_from": "direct_from_query"
    }.with_indifferent_access
  end

  def self.update_params
    {
      "segment": {
          "name": "Exclude User validation 1170",
          "segment_type": "Filter",
          "segment_filter_id": nil
      },
      "created_from": "direct_from_filter",
      "included_filters": {
          "filters": [
              {
                  "filters": [
                      {
                          "name": "first_seen",
                          "range": "date",
                          "category": "Lifecycle",
                          "operator": "exists",
                          "data_type": "datetime",
                          "filter_type": "user_property",
                          "displayed_name": "First Seen"
                      }
                  ],
                  "filter_type": "nested_filters",
                  "filter_operator": "or"
              }
          ]
      },
      "audience_type": "filterByUsers",
      "exclude_users": false
    }
  end
end