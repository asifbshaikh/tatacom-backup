JOIN_ASSOCIATES = ' inner join contacts on contacts.id = contact_common_events.contact_id inner join common_events ' \
                  'on common_events.id = contact_common_events.common_event_id '.freeze
CONTACTS_ID_IN = ' in (select contact_common_events.contact_id from contact_common_events'.freeze
GROUP_BY_AND_HAVING_COUNT = " group by contact_common_events.contact_id having COUNT(contact_common_events.id) ".freeze
CONTACT_COMMON_EVENTS_CREATED_AT = "contact_common_events.created_at".freeze
ACCOUNT_ID_EQUAL_TO = 'account_id = '.freeze
SOURCE_ID_EQUAL_TO = 'source_id @> '.freeze
INITIAL_RAW_SQL = 'select contacts.id from contacts where '.freeze
INITIAL_COUNT_SQL = 'select COUNT(contacts.id) from contacts where '.freeze
EXCLUDED_RAW_SQL = ' and contacts.id NOT IN '.freeze
EXCLUDED_QUERY_SENTENCE = ' and exclude users in '.freeze
SQL_VIEW_ID_IN = ' in (with users_event_count as (select contact_common_events.contact_id, count(contact_common_events.common_event_id) as event_count from contact_common_events'.freeze
GROUP_BY_CONTACT_ID = ' group by contact_common_events.contact_id'.freeze
VIEW_QUERY = ' select contact_id from users_event_count '.freeze
