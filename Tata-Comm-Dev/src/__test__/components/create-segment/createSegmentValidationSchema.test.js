import { createSegmentvalidationSchema } from 'components/create-segment/createSegmentValidationSchema.js'; // Update with your actual file path

describe('createSegmentvalidationSchema', () => {
  const mockObject = {
    audience_type: 'allUsers',
    exclude_users: false,
    included_filters: {
      filter_operator: 'and',
      filters: [
        {
          filter_operator: 'or',
          filter_type: 'nested_filters',
          filters: [
            {
              filter_type: 'all_users',
              name: 'All Users',
              id: 'digo_all_users',
            },
          ],
        },
      ],
    },
    excluded_filters: {
      filter_operator: 'and',
      filters: [
        {
          filter_operator: 'or',
          filter_type: 'nested_filters',
          filters: [
            {
              filter_type: 'filterByUsers',
            },
          ],
        },
      ],
    },
  };
  test('select Audience all users', async () => {
    await expect(
      createSegmentvalidationSchema.isValid(mockObject)
    ).resolves.toBe(true);
  });

  test('select all users Audience', async () => {
    (mockObject.audience_type = 'filterByUsers'),
      (mockObject.included_filters.filters[0].filters = [
        {
          filter_type: 'user_property',
          data_type: 'datetime',
          category: 'Lifecycle',
          name: 'first_seen',
          value: '2023-12-04',
          operator: 'is_between',
          compare_operator: 'date',
          range: 'date',
          value1: '2023-12-28',
          case_sensitive: '',
          displayed_name: 'First Seen',
        },
      ]),
      await expect(
        createSegmentvalidationSchema.isValid(mockObject)
      ).resolves.toBe(true);
  });

  test('select Audience filterBy Users_property', async () => {
    (mockObject.audience_type = 'filterByUsers'),
      (mockObject.included_filters.filters[0].filters = [
        {
          filter_type: 'user_property',
          name: 'no_of_conversions',
          operator: 'is_equal_to',
          compare_operator: '',
          range: '',
          value: '2',
          value1: '',
          case_sensitive: '',
          data_type: 'double',
          category: 'Lifecycle',
          displayed_name: 'No. of Conversions',
        },
      ]);

    await expect(
      createSegmentvalidationSchema.isValid(mockObject)
    ).resolves.toBe(true);
  });

  test('select Audience filterBy Users_affinity with user_affinity_attributes and user_attributes with invalid value', async () => {
    (mockObject.audience_type = 'filterByUsers'),
      (mockObject.included_filters.filters[0].filters = [
        {
          filter_type: 'user_affinity',
          executed: true,
          name: 'APP_OPENED',
          value: '',
          operator_type: 'predominantly',
          attributes: {
            filter_operator: 'and',
            filters: [
              {
                name: 'utm_source',
                filter_type: 'user_affinity_attributes',
                operator: 'in_the_following',
                compare_operator: '',
                range: '',
                value: ['hello'],
                value1: '',
                case_sensitive: '',
                data_type: 'string',
                category: 'Event Attributes',
              },
              {
                filter_type: 'user_affinity_attributes',
                data_type: 'datetime',
                category: 'Lifecycle',
                name: 'first_seen',
                value: '2023-12-04',
                operator: 'is_between',
                compare_operator: 'date',
                range: 'date',
                value1: '2023-12-28',
                case_sensitive: '',
                displayed_name: 'First Seen',
              },
            ],
          },
          user_affinity_attributes: {
            filter_operator: 'and',
            filters: [
              {
                name: 'device_model',
                filter_type: 'user_affinity_attributes',
                operator: 'in_the_following',
                compare_operator: '',
                range: '',
                value: ['test'],
                value1: '',
                case_sensitive: '',
                data_type: 'string',
                category: 'Event Attributes',
              },
            ],
          },
          primary_time_range: {
            period_unit: 'days',
            type: 'in_the_last',
            value: -1,
            value1: '',
          },
          category: 'Lifecycle',
        },
      ]);

    await expect(
      createSegmentvalidationSchema.isValid(mockObject)
    ).resolves.toBe(false);
  });
  test('select Audience filterBy Users_affinity with date datatype', async () => {
    (mockObject.audience_type = 'filterByUsers'),
      (mockObject.included_filters.filters[0].filters = [
        {
          filter_type: 'user_affinity',
          executed: true,
          name: 'APP_OPENED',
          value: '',
          operator_type: 'predominantly',
          attributes: {
            filter_operator: 'and',
            filters: [
              {
                filter_type: 'user_attributes',
                data_type: 'datetime',
                category: 'Lifecycle',
                name: 'first_seen',
                value: '',
                operator: 'is_today',
                compare_operator: '',
                range: 'date',
                value1: '',
                case_sensitive: '',
                displayed_name: 'First Seen',
              },
            ],
          },
          user_affinity_attributes: {
            filter_operator: 'and',
            filters: [
              {
                name: 'device_model',
                filter_type: 'user_affinity_attributes',
                operator: 'in_the_following',
                compare_operator: '',
                range: '',
                value: 'S',
                value1: '',
                case_sensitive: false,
                data_type: 'string',
                category: 'Event Attributes',
              },
            ],
          },
          primary_time_range: {
            period_unit: 'days',
            type: 'in_the_last',
            value: 10,
            value1: '',
          },
          category: 'Lifecycle',
        },
      ]);

    await expect(
      createSegmentvalidationSchema.isValid(mockObject)
    ).resolves.toBe(false);
  });
  test('select Audience filterBy user_behavior with invalid values', async () => {
    (mockObject.audience_type = 'filterByUsers'),
      (mockObject.included_filters.filters[0].filters = [
        {
          filter_type: 'user_behavior',
          executed: 'true',
          name: 'APP_OPENED',
          operator: 'exactly',
          attributes: {
            filter_operator: 'and',
            filters: [],
          },
          primary_time_range: {
            period_unit: 'days_ago',
            type: 'in_between',
            value: -3,
            value1: -2,
          },
          value: '-12',
          category: 'Lifecycle',
        },
      ]);

    await expect(
      createSegmentvalidationSchema.isValid(mockObject)
    ).resolves.toBe(false);
  });
  test('select Audience filterBy user_property with date dataType for operator in_the_following', async () => {
    (mockObject.audience_type = 'filterByUsers'),
      (mockObject.included_filters.filters[0].filters = [
        {
          filter_type: 'user_property',
          data_type: 'datetime',
          category: 'Lifecycle',
          name: 'first_seen',
          value: ['12am-1am', '1am-2am'],
          operator: 'in_the_following',
          compare_operator: '',
          range: 'daily_where_the_hour',
          value1: '',
          case_sensitive: '',
          displayed_name: 'First Seen',
        },
      ]);

    await expect(
      createSegmentvalidationSchema.isValid(mockObject)
    ).resolves.toBe(true);
  });
  test('select Audience filterBy user_property with is_between operator', async () => {
    (mockObject.audience_type = 'filterByUsers'),
      (mockObject.included_filters.filters[0].filters = [
        {
          filter_type: 'user_property',
          data_type: 'datetime',
          category: 'Lifecycle',
          name: 'first_seen',
          value: '1am-2am',
          operator: 'is_between',
          compare_operator: '',
          range: 'daily_where_the_hour',
          value1: '3am-4am',
          case_sensitive: '',
          displayed_name: 'First Seen',
        },
      ]);

    await expect(
      createSegmentvalidationSchema.isValid(mockObject)
    ).resolves.toBe(true);
  });
  test('select Audience filterBy Users_affinity with most_no_of_times opertor_type and negative value', async () => {
    (mockObject.audience_type = 'filterByUsers'),
      (mockObject.included_filters.filters[0].filters = [
        {
          filter_type: 'user_affinity',
          executed: true,
          name: 'App/Site Opened',
          value: -1,
          operator_type: 'most_no_of_times',
          attributes: {
            filter_operator: 'and',
            filters: [],
          },
          user_affinity_attributes: {
            filter_operator: 'and',
            filters: [],
          },
          primary_time_range: {
            period_unit: 'date',
            type: 'today',
            value: '',
            value1: '',
          },
          category: 'Tracked User Events',
        },
      ]);

    await expect(
      createSegmentvalidationSchema.isValid(mockObject)
    ).resolves.toBe(false);
  });
  test('select Audience filterBy Users_affinity with most_no_of_times opertor_type and greater than 100 value', async () => {
    (mockObject.audience_type = 'filterByUsers'),
      (mockObject.included_filters.filters[0].filters = [
        {
          filter_type: 'user_affinity',
          executed: true,
          name: 'App/Site Opened',
          value: 102,
          operator_type: 'most_no_of_times',
          attributes: {
            filter_operator: 'and',
            filters: [],
          },
          user_affinity_attributes: {
            filter_operator: 'and',
            filters: [],
          },
          primary_time_range: {
            period_unit: 'date',
            type: 'today',
            value: '',
            value1: '',
          },
          category: 'Tracked User Events',
        },
      ]);

    await expect(
      createSegmentvalidationSchema.isValid(mockObject)
    ).resolves.toBe(false);
  });
  test('select Audience filterBy Users_affinity with invalid value', async () => {
    (mockObject.audience_type = 'filterByUsers'),
      (mockObject.included_filters.filters[0].filters = [
        {
          filter_type: 'user_affinity',
          executed: true,
          name: 'App/Site Opened',
          value: 0,
          operator_type: 'most_no_of_times',
          attributes: {
            filter_operator: 'and',
            filters: [],
          },
          user_affinity_attributes: {
            filter_operator: 'and',
            filters: [],
          },
          primary_time_range: {
            period_unit: 'date',
            type: 'today',
            value: '',
            value1: '',
          },
          category: 'Tracked User Events',
        },
      ]);

    await expect(
      createSegmentvalidationSchema.isValid(mockObject)
    ).resolves.toBe(false);
  });
  test('select Audience filterBy Users_affinity with correct value', async () => {
    (mockObject.audience_type = 'filterByUsers'),
      (mockObject.included_filters.filters[0].filters = [
        {
          filter_type: 'user_affinity',
          executed: true,
          name: 'App/Site Opened',
          value: 70,
          operator_type: 'most_no_of_times',
          attributes: {
            filter_operator: 'and',
            filters: [],
          },
          user_affinity_attributes: {
            filter_operator: 'and',
            filters: [],
          },
          primary_time_range: {
            period_unit: 'date',
            type: 'today',
            value: '',
            value1: '',
          },
          category: 'Tracked User Events',
        },
      ]);

    await expect(
      createSegmentvalidationSchema.isValid(mockObject)
    ).resolves.toBe(true);
  });
});
