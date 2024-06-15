import {
  dateTimeHideDropDownsAndInputFields,
  getDateInputStringDropDownOptions,
  getNumericValues,
  getlastDropDownforWhereWeeklytheday,
  hideDropDownForDate,
  showDateFieldBasedOnCompareOperator,
  showDatePicker,
  showInputFieldbeforeAfter,
  CleanFieldValuesProvider,
  getIsBetweenValues,
} from 'data/segments/createSegmentFilterData';
import React, { useContext } from 'react';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import { Colxx } from 'components/common/CustomBootstrap';
import Datetime from 'react-datetime';
import moment from 'moment';
import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import { DATE_FORMAT_WITHOUT_TIME } from 'constants/appConstant';

const DateAndYearlyWhereDateRangeType = ({
  filteredValueByname,
  identifier,
  form,
  filterFormErrors,
  filterFormTouched,
  handleOnCompareOperatorChange,
  intl,
}) => {
  const { getErrorMessageOfField } = useContext(CleanFieldValuesProvider);
  const { messages: messagesIntl } = intl;

  const getIsDateValid = (currentDate) => {
    return filteredValueByname.value
      ? currentDate.isAfter(filteredValueByname.value)
      : true;
  };

  const handleDateValueChange = (val) => {
    if (moment(val).format() === 'Invalid date') {
      form.setFieldValue(`${identifier}.value`, '');
    } else {
      form.setFieldValue(
        `${identifier}.value`,
        moment(val).format(DATE_FORMAT_WITHOUT_TIME)
      );
    }
  };

  return (
    <>
      {!dateTimeHideDropDownsAndInputFields.includes(
        filteredValueByname.operator
      ) && (
        <>
          {showInputFieldbeforeAfter.includes(filteredValueByname.operator) &&
            (filteredValueByname.compare_operator !==
            createSegementEnums.CONDITION.DATE ? (
              <Colxx xxs="12" md="2">
                <FormGroupCoustom
                  dataTestId={filteredValueByname.value}
                  identifier={`${identifier}.value`}
                  type="number"
                  noLable
                  onBlur={form.handleBlur}
                />
                {getErrorMessageOfField(
                  filterFormErrors,
                  filterFormTouched,
                  'value'
                )}
              </Colxx>
            ) : (
              <Colxx xxs="12" md="2">
                <Datetime
                  closeOnSelect={true}
                  inputProps={{
                    placeholder:
                      messagesIntl['CREATE_SEGMENT.PLACEHOLDER.SELECT_DATE'],
                    onBlur: () => form.setFieldTouched(`${identifier}.value`),
                  }}
                  identifier={`${identifier}.value`}
                  dateFormat={DATE_FORMAT_WITHOUT_TIME}
                  timeFormat={false}
                  onChange={handleDateValueChange}
                  value={filteredValueByname.value}
                />
                {getErrorMessageOfField(
                  filterFormErrors,
                  filterFormTouched,
                  'value'
                )}
              </Colxx>
            ))}
          {hideDropDownForDate.includes(filteredValueByname.operator) && (
            <>
              {filteredValueByname.range ===
                createSegementEnums.CONDITION.DATE && (
                <Colxx xxs="12" md="2">
                  <FormGroupCoustom
                    dataTestId={filteredValueByname.value}
                    identifier={`${identifier}.value`}
                    type="number"
                    noLable
                    onBlur={form.handleBlur}
                  />
                  {getErrorMessageOfField(
                    filterFormErrors,
                    filterFormTouched,
                    'value'
                  )}
                </Colxx>
              )}
              {filteredValueByname.range ===
                createSegementEnums.CONDITION.YEARLY_WHERE_THE_DATE && (
                <Colxx xxs="12" md="2">
                  <FormGroupCoustom
                    dataTestId={filteredValueByname.value}
                    identifier={`${identifier}.value`}
                    type="select"
                    noLable
                    options={getDateInputStringDropDownOptions(
                      filteredValueByname.range,
                      filteredValueByname.operator
                    )}
                    onBlur={form.handleBlur}
                  />
                  {getErrorMessageOfField(
                    filterFormErrors,
                    filterFormTouched,
                    'value'
                  )}
                </Colxx>
              )}
              <Colxx xxs="12" md="1">
                <IntlMessages id="CREATE_SEGMENT.DAYS" />
              </Colxx>
            </>
          )}
          {showDatePicker.includes(filteredValueByname.operator) &&
            (!showDateFieldBasedOnCompareOperator.includes(
              filteredValueByname.compare_operator
            ) ? (
              <Colxx xxs="12" md="2">
                <FormGroupCoustom
                  dataTestId={filteredValueByname.value}
                  identifier={`${identifier}.value`}
                  options={getNumericValues(
                    createSegementEnums.RANGE_CONSTANTS.YEAR_RANGE
                  )}
                  type={
                    filteredValueByname.range ===
                    createSegementEnums.CONDITION.YEARLY_WHERE_THE_DATE
                      ? 'select'
                      : 'number'
                  }
                  noLable
                />
                {getErrorMessageOfField(
                  filterFormErrors,
                  filterFormTouched,
                  'value'
                )}
              </Colxx>
            ) : (
              <Colxx xxs="12" md="2">
                <Datetime
                  closeOnSelect={true}
                  inputProps={{
                    placeholder:
                      messagesIntl['CREATE_SEGMENT.PLACEHOLDER.SELECT_DATE'],
                    onBlur: () => form.setFieldTouched(`${identifier}.value`),
                  }}
                  identifier={`${identifier}.value`}
                  dateFormat={DATE_FORMAT_WITHOUT_TIME}
                  timeFormat={false}
                  onChange={handleDateValueChange}
                  value={filteredValueByname.value}
                />
                {getErrorMessageOfField(
                  filterFormErrors,
                  filterFormTouched,
                  'value'
                )}
              </Colxx>
            ))}
          {filteredValueByname.operator ===
            createSegementEnums.CONDITION.IS_BETWEEN && (
            <>
              <Colxx xxs="12" md="1">
                {' '}
                <span>
                  <IntlMessages id="CREATE_SEGMENT.USER_AFFINITY.AND" />
                </span>
              </Colxx>
              {!showDateFieldBasedOnCompareOperator.includes(
                filteredValueByname.compare_operator
              ) ? (
                <Colxx xxs="12" md="2">
                  <FormGroupCoustom
                    dataTestId={filteredValueByname.value1}
                    identifier={`${identifier}.value1`}
                    options={getIsBetweenValues(
                      filteredValueByname.value,
                      getNumericValues(
                        createSegementEnums.RANGE_CONSTANTS.YEAR_RANGE
                      )
                    )}
                    type={
                      filteredValueByname.range ===
                      createSegementEnums.CONDITION.YEARLY_WHERE_THE_DATE
                        ? 'select'
                        : 'number'
                    }
                    noLable
                  />
                  {getErrorMessageOfField(
                    filterFormErrors,
                    filterFormTouched,
                    'value1'
                  )}
                </Colxx>
              ) : (
                <Colxx xxs="12" md="2">
                  <Datetime
                    isValidDate={getIsDateValid}
                    closeOnSelect={true}
                    inputProps={{
                      placeholder:
                        messagesIntl['CREATE_SEGMENT.PLACEHOLDER.SELECT_DATE'],
                      onBlur: () =>
                        form.setFieldTouched(`${identifier}.value1`),
                    }}
                    identifier={`${identifier}.value1`}
                    dateFormat={DATE_FORMAT_WITHOUT_TIME}
                    timeFormat={false}
                    onChange={(val) => {
                      if (moment(val).format() === 'Invalid date') {
                        form.setFieldValue(`${identifier}.value1`, '');
                      } else {
                        form.setFieldValue(
                          `${identifier}.value1`,
                          moment(val).format(DATE_FORMAT_WITHOUT_TIME)
                        );
                      }
                    }}
                    value={filteredValueByname.value1}
                  />
                  {getErrorMessageOfField(
                    filterFormErrors,
                    filterFormTouched,
                    'value1'
                  )}
                </Colxx>
              )}
            </>
          )}
          {!hideDropDownForDate.includes(filteredValueByname.operator) && (
            <Colxx xxs="12" md="2">
              <FormGroupCoustom
                dataTestId={filteredValueByname.compare_operator}
                noLable
                identifier={`${identifier}.compare_operator`}
                type="select"
                options={getlastDropDownforWhereWeeklytheday(
                  filteredValueByname.range,
                  filteredValueByname.operator
                )}
                onChange={handleOnCompareOperatorChange}
                value={filteredValueByname.compare_operator}
              />
              {getErrorMessageOfField(
                filterFormErrors,
                filterFormTouched,
                'compare_operator'
              )}
            </Colxx>
          )}
        </>
      )}
    </>
  );
};

export default injectIntl(DateAndYearlyWhereDateRangeType);
