import TargetAudienceEnums from 'enums/campaigns/targetAudienceEnums';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import moment from 'moment';
import * as Yup from 'yup';

const negativeNumberValidation = (value, schema, _self) => {
  if (value) {
    if (typeof Number(value) === 'number' && value < 0) {
      return _self.createError({
        message: `${schema.path} ${createSegementEnums.LABEL.NO_NEGATIVE_VALUES}`,
        path: schema.path,
      });
    } else if (
      Number(value) > 100 &&
      (schema.parent.operator_type === 'most_no_of_times' ||
        schema.parent.operator_type === 'least_no_of_times')
    ) {
      return _self.createError({
        message: `${schema.path} ${createSegementEnums.LABEL.PERCENT_VALIDATION}`,
        path: schema.path,
      });
    } else {
      return true;
    }
  } else {
    return _self.createError({
      message: `${schema.path}`,
      path: schema.path,
    });
  }
};

export const FilterAttributesTypeValidation = {
  name: Yup.string().required(),
  filter_type: Yup.string(),
  data_type: Yup.string().required(),
  category: Yup.string(),
  operator: Yup.string().required(),
  value: Yup.mixed().when('operator', {
    is: (operatorValue) =>
      (operatorValue !== 'exists' &&
        operatorValue !== 'is_today' &&
        operatorValue !== 'does_not_exist') ||
      operatorValue === 'in_the_following' ||
      operatorValue === 'not_in_the_following',
    then: Yup.mixed().test({
      name: 'value-scheme',
      test: function (value) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return false;
        }
        return true;
      },
    }),
    otherwise: Yup.mixed().notRequired(),
  }),
  value1: Yup.mixed().when('operator', {
    is: (operatorValue) =>
      operatorValue === 'is_between' || operatorValue === 'is_not_between',
    then: Yup.mixed().test({
      name: 'isValue1GreaterAttribute',
      test: function (value, schema) {
        if (value) {
          if (
            (schema.parent.value &&
              schema.parent.compare_operator === 'date') ||
            schema.parent.compare_operator === 'date_month'
          ) {
            if (moment(value).isAfter(schema.parent.value)) {
              return true;
            } else {
              return this.createError({
                message: `${schema.path} ${createSegementEnums.LABEL.DATE_SHOULD_BE_GREATER}`,
                path: schema.path,
              });
            }
          } else {
            return true;
          }
        } else {
          return this.createError({
            message: `${schema.path}`,
            path: schema.path,
          });
        }
      },
    }),
    otherwise: Yup.mixed().notRequired(),
  }),
  range: Yup.string().when('data_type', {
    is: (dataTypeValue) =>
      dataTypeValue === 'datetime' || dataTypeValue === 'date',
    then: Yup.string().required(),
    otherwise: Yup.string().notRequired(),
  }),
  compare_operator: Yup.string().when(['data_type', 'range', 'operator'], {
    is: (dataTypeValue, rangeValue, operatorValue) =>
      (dataTypeValue === 'datetime' || dataTypeValue === 'date') &&
      rangeValue !== 'daily_where_the_hour' &&
      operatorValue !== 'exists' &&
      operatorValue !== 'is_today' &&
      operatorValue !== 'does_not_exist' &&
      operatorValue !== 'is_this_month' &&
      operatorValue !== 'in_the_last' &&
      operatorValue !== 'in_the_following' &&
      operatorValue !== 'in_the_next',
    then: Yup.string().required(),
    otherwise: Yup.string().notRequired(),
  }),
};

export const filterUsersSchema = {
  filters: Yup.array().of(
    Yup.object().shape({
      filter_operator: Yup.string().required(),
      filter_type: Yup.string(),
      filters: Yup.array().of(
        Yup.object().shape({
          filter_type: Yup.string().required(),
          name: Yup.string().required(),
          id: Yup.string().when('filter_type', {
            is: 'all_users',
            then: Yup.string().required(),
            otherwise: Yup.string().notRequired(),
          }),
          segment_id: Yup.number().when('filter_type', {
            is: 'custom_segments',
            then: Yup.number().required(),
            otherwise: Yup.number().notRequired(),
          }),
          executed: Yup.boolean().when('filter_type', {
            is: (value) =>
              value === 'user_behavior' || value === 'user_affinity',
            then: Yup.boolean().required(),
            otherwise: Yup.boolean().notRequired(),
          }),
          data_type: Yup.string().when('filter_type', {
            is: 'user_property',
            then: Yup.string().required(),
            otherwise: Yup.string().notRequired(),
          }),
          category: Yup.string().when('filter_type', {
            is: 'user_property',
            then: Yup.string().required(),
            otherwise: Yup.string().notRequired(),
          }),
          operator: Yup.string().when(['filter_type', 'executed'], {
            is: (value, executedValue) => {
              return (
                (value === 'user_behavior' && executedValue) ||
                value === 'user_property'
              );
            },
            then: Yup.string().required(),
            otherwise: Yup.string().notRequired(),
          }),
          operator_type: Yup.string().when('filter_type', {
            is: 'user_affinity',
            then: Yup.string().required(),
            otherwise: Yup.string().notRequired(),
          }),
          value: Yup.mixed().when(
            ['filter_type', 'executed', 'operator_type'],
            {
              is: (filterValue, executedValue, operatorTypeValue) => {
                return (
                  (filterValue === 'user_behavior' && executedValue) ||
                  filterValue === 'user_property' ||
                  (filterValue === 'user_affinity' &&
                    operatorTypeValue === 'most_no_of_times') ||
                  operatorTypeValue === 'least_no_of_times' ||
                  operatorTypeValue === 'for_a_minimum_of'
                );
              },
              then: Yup.mixed().test({
                name: 'value-scheme',
                test: function (value, schema) {
                  const arr = [
                    'exists',
                    'is_today',
                    'does_not_exist',
                    'is_this_month',
                  ];
                  const { operator } = schema.parent;
                  if (schema.parent.filter_type === 'user_affinity') {
                    if (value) {
                      if (value < 0) {
                        return this.createError({
                          message: `${schema.path} ${createSegementEnums.LABEL.NO_NEGATIVE_VALUES}`,
                          path: schema.path,
                        });
                      } else if (value > 100) {
                        return this.createError({
                          message: `${schema.path} ${createSegementEnums.LABEL.PERCENT_VALIDATION}`,
                          path: schema.path,
                        });
                      } else {
                        return true;
                      }
                    } else {
                      return this.createError({
                        message: `${schema.path}`,
                        path: schema.path,
                      });
                    }
                  } else {
                    if (arr.includes(operator)) {
                      return true;
                    } else {
                      if (
                        !value ||
                        (Array.isArray(value) && value.length === 0)
                      ) {
                        return false;
                      } else {
                        if (value < 0) {
                          return this.createError({
                            message: `${schema.path} ${createSegementEnums.LABEL.NO_NEGATIVE_VALUES}`,
                            path: schema.path,
                          });
                        }
                        return true;
                      }
                    }
                  }
                },
              }),
              otherwise: Yup.mixed().notRequired(),
            }
          ),
          value1: Yup.mixed().when(['filter_type', 'operator'], {
            is: (filterValue, operatorValue) => {
              return (
                (filterValue === 'user_property' &&
                  operatorValue === 'is_between') ||
                operatorValue === 'is_not_between'
              );
            },
            then: Yup.mixed().test({
              name: 'isValue1Greater',
              test: function (value, schema) {
                if (value) {
                  if (
                    (schema.parent.value &&
                      schema.parent.compare_operator === 'date') ||
                    schema.parent.compare_operator === 'date_month'
                  ) {
                    if (moment(value).isAfter(schema.parent.value)) {
                      return true;
                    } else {
                      return this.createError({
                        message: `${schema.path} ${createSegementEnums.LABEL.DATE_SHOULD_BE_GREATER}`,
                        path: schema.path,
                      });
                    }
                  } else if (typeof Number(value) == 'number') {
                    return negativeNumberValidation(value, schema, this);
                  } else {
                    return true;
                  }
                } else {
                  return this.createError({
                    message: `${schema.path}`,
                    path: schema.path,
                  });
                }
              },
            }),
            otherwise: Yup.mixed().notRequired(),
          }),
          range: Yup.string().when('data_type', {
            is: (dataTypeValue) =>
              dataTypeValue === 'datetime' || dataTypeValue === 'date',
            then: Yup.string().required(),
            otherwise: Yup.string().notRequired(),
          }),
          compare_operator: Yup.string().when(
            ['data_type', 'range', 'operator'],
            {
              is: (dataTypeValue, rangeValue, operatorValue) =>
                (dataTypeValue === 'datetime' || dataTypeValue === 'date') &&
                rangeValue !== 'daily_where_the_hour' &&
                operatorValue !== 'exists' &&
                operatorValue !== 'is_today' &&
                operatorValue !== 'does_not_exist' &&
                operatorValue !== 'is_this_month' &&
                operatorValue !== 'in_the_last' &&
                operatorValue !== 'in_the_following' &&
                operatorValue !== 'in_the_next',
              then: Yup.string().required(),
              otherwise: Yup.string().notRequired(),
            }
          ),
          primary_time_range: Yup.object().when('filter_type', {
            is: (filterTypeValue) =>
              filterTypeValue === 'user_affinity' ||
              filterTypeValue === 'user_behavior',
            then: Yup.object().shape({
              type: Yup.string().required(),
              value: Yup.mixed().when('type', {
                is: (typeFieldValue) =>
                  typeFieldValue === 'on' ||
                  typeFieldValue === 'before' ||
                  typeFieldValue === 'in_between' ||
                  typeFieldValue === 'in_the_last' ||
                  typeFieldValue === 'after',
                then: Yup.mixed().test({
                  name: 'valueGreaterThan',
                  test: function (value, schema) {
                    if (value) {
                      if (value > schema.parent.value1) {
                        return this.createError({
                          message: `${schema.path} ${createSegementEnums.LABEL.DAYS_SHOULD_BE_LESS_THAN}`,
                          path: schema.path,
                        });
                      } else if (value < 0) {
                        return this.createError({
                          message: `${schema.path} ${createSegementEnums.LABEL.NO_NEGATIVE_VALUES}`,
                          path: schema.path,
                        });
                      } else {
                        return true;
                      }
                    } else {
                      return this.createError({
                        message: `${schema.path}`,
                        path: schema.path,
                      });
                    }
                  },
                }),
                otherwise: Yup.mixed().notRequired(),
              }),
              value1: Yup.mixed().when('type', {
                is: 'in_between',
                then: Yup.mixed().test({
                  name: 'dateGreaterThan',
                  test: function (value, schema) {
                    if (value) {
                      if (
                        schema.parent.value &&
                        schema.parent.period_unit === 'date'
                      ) {
                        if (moment(value).isAfter(schema.parent.value)) {
                          return true;
                        } else {
                          return this.createError({
                            message: `${schema.path} ${createSegementEnums.LABEL.DATE_SHOULD_BE_GREATER}`,
                            path: schema.path,
                          });
                        }
                      } else if (value < 0) {
                        return this.createError({
                          message: `${schema.path} ${createSegementEnums.LABEL.NO_NEGATIVE_VALUES}`,
                          path: schema.path,
                        });
                      } else {
                        return true;
                      }
                    } else {
                      return this.createError({
                        message: `${schema.path}`,
                        path: schema.path,
                      });
                    }
                  },
                }),
                otherwise: Yup.mixed().notRequired(),
              }),
              period_unit: Yup.string().when('type', {
                is: (typeFieldValue) => {
                  return (
                    typeFieldValue === 'on' ||
                    typeFieldValue === 'before' ||
                    typeFieldValue === 'in_between' ||
                    typeFieldValue === 'in_the_last'
                  );
                },
                then: Yup.string().test({
                  name: 'periodUnitField',
                  test: function (value, schema) {
                    if (
                      schema.parent.type === 'in_the_last' &&
                      schema.from?.[1]?.value?.filter_type === 'user_affinity'
                    ) {
                      return true;
                    } else {
                      if (value) {
                        return true;
                      } else {
                        return this.createError({
                          message: `${schema.path}`,
                          path: schema.path,
                        });
                      }
                    }
                  },
                }),
                otherwise: Yup.string().notRequired(),
              }),
            }),
            otherwise: Yup.object().notRequired(),
          }),
          user_affinity_attributes: Yup.object().when(
            ['filter_type', 'operator_type'],
            {
              is: (filterTypeValue, opertorTypeValue) =>
                (filterTypeValue === 'user_affinity' &&
                  opertorTypeValue === 'predominantly') ||
                opertorTypeValue === 'for_a_minimum_of',
              then: Yup.object()
                .shape({
                  filter_operator: Yup.string().required(),
                  filters: Yup.array()
                    .of(
                      Yup.object().shape({ ...FilterAttributesTypeValidation })
                    )
                    .min(1),
                })
                .required(),
              otherwise: Yup.object().notRequired(),
            }
          ),
          attributes: Yup.object().when('filter_type', {
            is: (filterTypeValue) =>
              filterTypeValue === 'user_affinity' ||
              filterTypeValue === 'user_behavior',
            then: Yup.object()
              .shape({
                filter_operator: Yup.string().required(),
                filters: Yup.array().of(
                  Yup.object().shape({ ...FilterAttributesTypeValidation })
                ),
              })
              .required(),
            otherwise: Yup.object().notRequired(),
          }),
        })
      ),
    })
  ),
};
export const eventTriggerSchema = {
  included_filters: Yup.object().shape({
    filters: Yup.array().of(
      Yup.object().shape({
        filters: Yup.array().of(
          Yup.object().shape({
            executed: Yup.string().required(),
            filter_type: Yup.string().required(),
            name: Yup.string().required(),
            operator: Yup.string().when('executed', {
              is: true,
              then: Yup.string().required(),
              otherwise: Yup.string().notRequired(),
            }),
            value: Yup.string().when('executed', {
              is: true,
              then: Yup.string().required(),
              otherwise: Yup.string().notRequired(),
            }),
            attributes: Yup.object().when('filter_type', {
              is: 'user_behavior',
              then: Yup.object()
                .shape({
                  filter_operator: Yup.string().required(),
                  filters: Yup.array().of(
                    Yup.object().shape({ ...FilterAttributesTypeValidation })
                  ),
                })
                .required(),
              otherwise: Yup.object().notRequired(),
            }),
          })
        ),
      })
    ),
  }),
  trigger_relation: Yup.string().when('trigger_message_type', {
    is: TargetAudienceEnums.WITH_DELAY,
    then: Yup.string().required().nullable(true),
    otherwise: Yup.string().notRequired().nullable(true),
  }),
  trigger_attr: Yup.string().when('trigger_message_type', {
    is: TargetAudienceEnums.WITH_DELAY,
    then: Yup.string().required().nullable(true),
    otherwise: Yup.string().notRequired().nullable(true),
  }),
  time_value: Yup.string().when('trigger_message_type', {
    is: TargetAudienceEnums.WITH_DELAY,
    then: Yup.string().required(),
    otherwise: Yup.string().notRequired(),
  }),
  time_multiplier: Yup.string().when('trigger_message_type', {
    is: TargetAudienceEnums.WITH_DELAY,
    then: Yup.string().required(),
    otherwise: Yup.string().notRequired(),
  }),
  trigger_message_type: Yup.string().required(),
};

export const createSegmentvalidationSchema = Yup.object().shape({
  audience_type: Yup.string(),
  included_filters: Yup.object().shape({
    ...filterUsersSchema,
  }),
  exclude_users: Yup.boolean().required(),
  excluded_filters: Yup.object().when('exclude_users', {
    is: true,
    then: Yup.object().shape({
      ...filterUsersSchema,
    }),
  }),
});
