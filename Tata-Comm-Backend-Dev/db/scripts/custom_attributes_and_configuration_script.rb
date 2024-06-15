# Script for generating records for Custom Attributes

custom_attribute_name_array = ['ad_impression_count_by_mediation_3', 'ad_impression_count_by_mediation_7', 'ad_impression_count_D3',
                               'ad_impression_count_D7', 'ad_type', 'ad_value_3', 'ad_value_7', 'ad_value_D3', 'ad_value_D7', 'Average Order Value', 'avg_playtime_when_fail_3', 'avg_playtime_when_fail_7', 'avg_playtime_when_fail_D3', 'avg_playtime_when_fail_D7', 'Best Time to Send - Email', 'Best Time To Send - Push', 'Best Time to Send - SMS', 'BFSI-Checking Account', 'BFSI-Savings Account', 'Birthday', 'BN_impression_count_3', 'BN_impression_count_7', 'campaign_id', 'car', 'cdp_login_timestamp', 'Clips_Subfeed', 'country_code', 'daily_distinct_song_count_D3', 'daily_distinct_song_count_D7', 'daily_distinct_song_name_count_3', 'daily_distinct_song_name_count_7', 'Days_Since_Install', 'dependents', 'device_category', 'difficulty_level', 'EDT-Course Expiration Date', 'Electricity Board', 'Electricity Next Bill Due Date', 'Eligible SKUs', 'ENT - Movie Favorite Genre', 'ENT - Music Favorite Artist', 'ENT - Music Favorite Genre', 'ENT - Subscription Plan', 'ENT - Subscription Renew Date', 'Extras %', 'Extras Dessert %', 'Extras Side %', 'Favorite category', 'Favourite Crust', 'Favourite Extras Type', 'Favourite Pizza Size', 'Followed Streamers', 'Game-Character Name', 'Game-Diamonds', 'Game-Eligible for Upgrade', 'Game-Language', 'Game-Level', 'Game-Mode', 'Game-Recharge Balance', 'genre', 'grade', 'Group', 'HUL Test Flag-', 'iInvest-', 'iLindung-', 'install_date_pseudo_id-', 'Is Streamer', 'IS_impression_count_3-', 'IS_impression_count_7', 'Langauge-', 'Language', 'Last Known City', 'Last Location', 'Last Order Placed', 'Last Purchase value', 'Latitude', 'Longitude-', 'LOY-Loyalty Member', 'LOY-Loyalty Points Expiring in 30 Days-', 'LOY-Loyalty Tier', 'max_song_score_3', 'max_song_score_7', 'max_song_score_D3', 'max_song_score_D7', 'me_result_count_3', 'me_result_count_7', 'me_result_count_D3', 'me_result_count_D7', 'me_start_count_3', 'me_start_count_7', 'me_start_count_D3', 'me_start_count_D7', 'moe_ds_6391bd18bd943413962a0b7a_probability_category', 'Monthly Contribution', 'Nationality', 'No Of aggregator transactions', 'No Of aggregator transactions - June', 'No Of app transactions', 'No Of app transactions - June', 'No Of offline transactions', 'No Of offline transactions - June', 'No Of transactions', 'No Of transactions - June', 'No Of transactions - May', 'Nomination', 'Offer %', 'Offer % June', 'Offer % May', 'os_version', 'Personalized Link', 'Postpaid Next Bill Due Date', 'Postpaid Operator', 'Preferred Mode', 'Preferred Store City', 'Preferred Store ID', 'Preferred Store Name', 'Propensity-Churn', 'Propensity-Dormant', 'Reachability App', 'recommended_category', 'Retailer Category', 'Retailer Credit Eligible', 'Retailer Credit Line', 'Retailer Store Type', 'Retirement Services', 'Revenue', 'RFM Segment - June', 'RFM Segment - May', 'RFM Segment Jan', 'rooter_diamond', 'rooter_gold', 'RTL-App Usage', 'RTL-Bag-Items', 'RTL-Bag-Value', 'RTL-Favourite Category', 'RTL-Last Purchase Brand', 'RTL-Last Purchase Category', 'RTL-Last Purchase Date', 'RTL-Last Purchase Product', 'RTL-Loyalty Member', 'RTL-Loyalty Points', 'RTL-Loyalty Points Expiring in 30 Days', 'RTL-Loyalty Tier', 'RTL-LTV', 'RTL-NBA', 'RTL-Offer', 'RTL-Purchase Bucket', 'RTL-Purchase Frequency', 'RTL-Traveller Type', 'RW_impression_count_3', 'RW_impression_count_7', 'Scratchcard', 'Shariah', 'song_click_count_3', 'song_click_count_7', 'song_end_count_3', 'song_end_count_7', 'song_end_count_D3', 'song_end_count_D7', 'song_fail_count_3', 'song_fail_count_7', 'song_fail_count_D3', 'song_fail_count_D7', 'song_playtime_3', 'song_playtime_7', 'song_playtime_D3', 'song_playtime_D7', 'song_play_frequency', 'song_play_recency', 'song_result_count_3', 'song_result_count_7', 'song_result_count_D3', 'song_result_count_D7', 'song_revive_count_3', 'song_revive_count_7', 'song_revive_count_D3', 'song_revive_count_D7', 'song_start_count_3', 'song_start_count_7', 'song_start_count_D3', 'song_start_count_D7', 'song_unlock_count_3', 'song_unlock_count_7', 'song_unlock_count_D3', 'song_unlock_count_D7', 'Streamer Type', 'Subscription-Email', 'Subscription-Push', 'Subscription-SMS', 'sum_retention_3', 'sum_retention_7-', 'SW-Last Order Date', 'SW-Last Order Items', 'SW-Last Order Type', 'SW-Last Order Value', 'SW-Last Restaurant', 'SW-Loyalty Opt-in', 'SW-Loyalty Points Balance', 'SW-Loyalty Points Redeemed', 'SW-Points For free Food', 'time_in_app_3', 'time_in_app_7', 'time_in_app_D3', 'time_in_app_D7', 'TRVL - Air Travel Type', 'TRVL - Home Airport Code', 'updb_appear_date', 'updb_appear_timestamp', 'UPI', 'UPI Segment', 'URL', 'User ID', 'User Name', 'User Pref Type', 'user_pseudo_id', 'Veg Non Veg Preference']

custom_attribute_display_array = ['ad impression count by mediation 3', 'ad impression count by mediation 7', 'ad impression count D3',
                                  'ad impression count D7', 'ad type', 'ad value 3', 'ad value 7', 'ad value D3', 'ad value D7', 'Average Order Value', 'avg playtime when fail 3', 'avg playtime when fail 7', 'avg playtime when fail D3', 'avg playtime when fail D7', 'Best Time to Send - Email', 'Best Time To Send - Push', 'Best Time to Send - SMS', 'BFSI-Checking Account', 'BFSI-Savings Account', 'Birthday', 'BN impression count 3', 'BN impression count 7', 'campaign id', 'car', 'cdp login timestamp', 'Clips Subfeed', 'country code', 'daily distinct song count D3', 'daily distinct song count D7', 'daily distinct song name count 3', 'daily distinct song name count 7', 'Days Since Install', 'dependents', 'device category', 'difficulty level', 'EDT-Course Expiration Date', 'Electricity Board', 'Electricity Next Bill Due Date', 'Eligible SKUs', 'ENT - Movie Favorite Genre', 'ENT - Music Favorite Artist', 'ENT - Music Favorite Genre', 'ENT - Subscription Plan', 'ENT - Subscription Renew Date', 'Extras %', 'Extras Dessert %', 'Extras Side %', 'Favorite category', 'Favourite Crust', 'Favourite Extras Type', 'Favourite Pizza Size', 'Followed Streamers', 'Game-Character Name', 'Game-Diamonds', 'Game-Eligible for Upgrade', 'Game-Language', 'Game-Level', 'Game-Mode', 'Game-Recharge Balance', 'genre', 'grade', 'Group', 'HUL Test Flag-', 'iInvest-', 'iLindung-', 'install date pseudo id-', 'Is Streamer', 'IS impression count 3-', 'IS impression count 7', 'Langauge-', 'Language', 'Last Known City', 'Last Location', 'Last Order Placed', 'Last Purchase value', 'Latitude', 'Longitude-', 'LOY-Loyalty Member', 'LOY-Loyalty Points Expiring in 30 Days-', 'LOY-Loyalty Tier', 'max song score 3', 'max song score 7', 'max song score D3', 'max song score D7', 'me result count 3', 'me result count 7', 'me result count D3', 'me result count D7', 'me start count 3', 'me start count 7', 'me start count D3', 'me start count D7', 'moe ds 6391bd18bd943413962a0b7a probability category', 'Monthly Contribution', 'Nationality', 'No Of aggregator transactions', 'No Of aggregator transactions - June', 'No Of app transactions', 'No Of app transactions - June', 'No Of offline transactions', 'No Of offline transactions - June', 'No Of transactions', 'No Of transactions - June', 'No Of transactions - May', 'Nomination', 'Offer %', 'Offer % June', 'Offer % May', 'os version', 'Personalized Link', 'Postpaid Next Bill Due Date', 'Postpaid Operator', 'Preferred Mode', 'Preferred Store City', 'Preferred Store ID', 'Preferred Store Name', 'Propensity-Churn', 'Propensity-Dormant', 'Reachability App', 'recommended category', 'Retailer Category', 'Retailer Credit Eligible', 'Retailer Credit Line', 'Retailer Store Type', 'Retirement Services', 'Revenue', 'RFM Segment - June', 'RFM Segment - May', 'RFM Segment Jan', 'rooter diamond', 'rooter gold', 'RTL-App Usage', 'RTL-Bag-Items', 'RTL-Bag-Value', 'RTL-Favourite Category', 'RTL-Last Purchase Brand', 'RTL-Last Purchase Category', 'RTL-Last Purchase Date', 'RTL-Last Purchase Product', 'RTL-Loyalty Member', 'RTL-Loyalty Points', 'RTL-Loyalty Points Expiring in 30 Days', 'RTL-Loyalty Tier', 'RTL-LTV', 'RTL-NBA', 'RTL-Offer', 'RTL-Purchase Bucket', 'RTL-Purchase Frequency', 'RTL-Traveller Type', 'RW impression count 3', 'RW impression count 7', 'Scratchcard', 'Shariah', 'song click count 3', 'song click count 7', 'song end count 3', 'song end count 7', 'song end count D3', 'song end count D7', 'song fail count 3', 'song fail count 7', 'song fail count D3', 'song fail count D7', 'song playtime 3', 'song playtime 7', 'song playtime D3', 'song playtime D7', 'song play frequency', 'song play recency', 'song result count 3', 'song result count 7', 'song result count D3', 'song result count D7', 'song revive count 3', 'song revive count 7', 'song revive count D3', 'song revive count D7', 'song start count 3', 'song start count 7', 'song start count D3', 'song start count D7', 'song unlock count 3', 'song unlock count 7', 'song unlock count D3', 'song unlock count D7', 'Streamer Type', 'Subscription-Email', 'Subscription-Push', 'Subscription-SMS', 'sum retention 3', 'sum retention 7-', 'SW-Last Order Date', 'SW-Last Order Items', 'SW-Last Order Type', 'SW-Last Order Value', 'SW-Last Restaurant', 'SW-Loyalty Opt-in', 'SW-Loyalty Points Balance', 'SW-Loyalty Points Redeemed', 'SW-Points For free Food', 'time in app 3', 'time in app 7', 'time in app D3', 'time in app D7', 'TRVL - Air Travel Type', 'TRVL - Home Airport Code', 'updb appear date', 'updb appear timestamp', 'UPI', 'UPI Segment', 'URL', 'User ID', 'User Name', 'User Pref Type', 'user pseudo id', 'Veg Non Veg Preference']

Contact.pluck(:id, :account_id).each do |contact_id_array|
  [(0..50), (51..100), (101..150), (151..215)].sample.each do |i|
    CustomAttribute.create!(name: custom_attribute_name_array[i].downcase.parameterize.underscore, displayed_name: custom_attribute_display_array[i], value: rand(1..400),
                            source: ['sdk, internal'].sample, contact_id: contact_id_array[0], account_id: contact_id_array[1])
  end
end

Account.all.each do |account|
  [(0..50), (51..100), (101..150), (151..215)].sample.each do |i|
    CustomAttributeDefinition.create!(attribute_key: custom_attribute_name_array[i].downcase.parameterize.underscore,
                                      attribute_display_name: custom_attribute_display_array[i].humanize,
                                      attribute_description: custom_attribute_display_array[i].humanize,
                                      attribute_display_type: TEXT,
                                      attribute_model: CONTACT_ATTRIBUTE,
                                      account_id: account.id)
  rescue StandardError => e
    Rails.logger.error(e.message)
  end
end

Rails.logger.debug 'Script ran successfuly'