import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import {
  chatListStatus,
  checkBoxDataTypeOptions,
  getdropDownOptionsBasedOnIdentifier,
  hideValueField,
} from 'helpers/ConversationFiltersHelper';
import React from 'react';
import Select from 'react-select';
import Datetime from 'react-datetime';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { DATE_FORMAT_WITHOUT_TIME } from 'constants/appConstant';
import { reactSelectStyles } from 'data/segments/createSegmentFilterData';
import { localeOptions } from 'constants/defaultValues';
import ConversationEnums from 'enums/conversations/conversationEnums';

const ValueFieldBasedOnDataType = ({
  form,
  filterValues,
  index,
  intl,
  labels,
  inboxes,
  teams,
  agents,
  campaigns,
  countryList,
  getErrorMessage,
}) => {
  const { messages } = intl;

  const handleOnChangeMultiSelect = (selectedOptions, type) => {
    if (type === ConversationEnums.FILTER_KEYS.MULTI_SELECT) {
      const selectValues = [];
      selectedOptions.forEach((option) => {
        selectValues.push(option.value);
      });
      form.setFieldValue(`filters.${index}.values`, selectValues);
    } else {
      form.setFieldValue(`filters.${index}.values`, selectedOptions.value);
    }
  };

  const getDropDownValuesBasedOnKeyAndDataTypes = () => {
    let dropDownOptions = [];
    switch (filterValues.attribute_key) {
      case ConversationEnums.FILTER_KEYS.STATUS:
        dropDownOptions = getdropDownOptionsBasedOnIdentifier(
          ConversationEnums.IDENTIFIERS.LABEL,
          ConversationEnums.IDENTIFIERS.VALUE,
          ConversationEnums.IDENTIFIERS.VALUE,
          ConversationEnums.IDENTIFIERS.ID,
          chatListStatus
        );
        break;
      case ConversationEnums.FILTER_KEYS.ASSIGNEE_ID:
        dropDownOptions = getdropDownOptionsBasedOnIdentifier(
          ConversationEnums.IDENTIFIERS.LABEL,
          ConversationEnums.IDENTIFIERS.VALUE,
          ConversationEnums.IDENTIFIERS.NAME,
          ConversationEnums.IDENTIFIERS.ID,
          agents
        );
        break;
      case ConversationEnums.FILTER_KEYS.LABELS:
        dropDownOptions = getdropDownOptionsBasedOnIdentifier(
          ConversationEnums.IDENTIFIERS.LABEL,
          ConversationEnums.IDENTIFIERS.VALUE,
          ConversationEnums.IDENTIFIERS.TITLE,
          ConversationEnums.IDENTIFIERS.TITLE,
          labels
        );
        break;
      case ConversationEnums.FILTER_KEYS.INBOX_ID:
        dropDownOptions = getdropDownOptionsBasedOnIdentifier(
          ConversationEnums.IDENTIFIERS.LABEL,
          ConversationEnums.IDENTIFIERS.VALUE,
          ConversationEnums.IDENTIFIERS.NAME,
          ConversationEnums.IDENTIFIERS.ID,
          inboxes
        );
        break;
      case ConversationEnums.FILTER_KEYS.TEAM_ID:
        dropDownOptions = getdropDownOptionsBasedOnIdentifier(
          ConversationEnums.IDENTIFIERS.LABEL,
          ConversationEnums.IDENTIFIERS.VALUE,
          ConversationEnums.IDENTIFIERS.NAME,
          ConversationEnums.IDENTIFIERS.ID,
          teams
        );
        break;
      case ConversationEnums.FILTER_KEYS.CAMPAIGN_ID:
        dropDownOptions = getdropDownOptionsBasedOnIdentifier(
          ConversationEnums.IDENTIFIERS.LABEL,
          ConversationEnums.IDENTIFIERS.VALUE,
          ConversationEnums.IDENTIFIERS.TITLE,
          ConversationEnums.IDENTIFIERS.ID,
          campaigns
        );
        break;
      case ConversationEnums.FILTER_KEYS.COUNTRY_ID:
        dropDownOptions = getdropDownOptionsBasedOnIdentifier(
          ConversationEnums.IDENTIFIERS.LABEL,
          ConversationEnums.IDENTIFIERS.VALUE,
          ConversationEnums.IDENTIFIERS.NAME,
          ConversationEnums.IDENTIFIERS.COUNTRY_CODE,
          countryList
        );
        break;
      case ConversationEnums.FILTER_KEYS.BROWSER_LANGUAGE:
        dropDownOptions = getdropDownOptionsBasedOnIdentifier(
          ConversationEnums.IDENTIFIERS.LABEL,
          ConversationEnums.IDENTIFIERS.VALUE,
          ConversationEnums.IDENTIFIERS.NAME,
          ConversationEnums.IDENTIFIERS.ID,
          localeOptions
        );
        break;

      default:
        switch (filterValues?.data_type) {
          case ConversationEnums.FILTER_KEYS.CHECKBOX:
            dropDownOptions = checkBoxDataTypeOptions;
            break;

          default:
            dropDownOptions = [];
            break;
        }
        dropDownOptions = [];
        break;
    }
    return dropDownOptions;
  };
  const getSelectedValues = (type) => {
    let selectedValue;
    const data = getDropDownValuesBasedOnKeyAndDataTypes();
    if (type === ConversationEnums.FILTER_KEYS.MULTI_SELECT) {
      selectedValue = data.filter((option) => {
        return filterValues?.values.includes(option.value);
      });
    } else {
      selectedValue = data.filter((option) => {
        return option.value === filterValues?.values;
      });
    }
    return selectedValue;
  };

  return (
    <>
      {!hideValueField.includes(filterValues.filter_operator) ? (
        <>
          {filterValues.input_type ===
            ConversationEnums.FILTER_KEYS.MULTI_SELECT && (
            <Colxx xxs="12" md="4">
              <Select
                aria-label={`multiSelect_${index}`}
                options={getDropDownValuesBasedOnKeyAndDataTypes()}
                isMulti
                onChange={(selectedOptions) =>
                  handleOnChangeMultiSelect(
                    selectedOptions,
                    ConversationEnums.FILTER_KEYS.MULTI_SELECT
                  )
                }
                value={getSelectedValues(
                  ConversationEnums.FILTER_KEYS.MULTI_SELECT
                )}
                styles={reactSelectStyles}
                onBlur={() => form.setFieldTouched(`filters.${index}.values`)}
              />
              {getErrorMessage(
                form.errors?.filters?.[index]?.values,
                form.touched?.filters?.[index]?.values
              )}
            </Colxx>
          )}
          {filterValues.input_type === ConversationEnums.FILTER_KEYS.DATE && (
            <Colxx xxs="12" md="4">
              {filterValues.filter_operator ===
                ConversationEnums.FILTER_KEYS.DAYS_BEFORE && (
                <>
                  <FormGroupCoustom
                    dataTestId={`daysBefore_${index}`}
                    noLable
                    identifier={`filters.${index}.values`}
                    onChange={(event) => {
                      form.setFieldValue(
                        `filters.${index}.values`,
                        event.target.value
                      );
                    }}
                    type={'number'}
                    value={filterValues.values}
                  />
                  {getErrorMessage(
                    form.errors?.filters?.[index]?.values,
                    form.touched?.filters?.[index]?.values
                  )}
                </>
              )}
              {filterValues.filter_operator ===
                ConversationEnums.IDENTIFIERS.IS_GREATER_THAN && (
                <>
                  <Datetime
                    data-testid={`greaterThan_${index}`}
                    closeOnSelect={true}
                    inputProps={{
                      placeholder:
                        messages['CREATE_SEGMENT.USER_AFFINITY.SELECT_DATE'],
                      onBlur: () =>
                        form.setFieldTouched(`filters.${index}.values`),
                    }}
                    identifier={`filters.${index}.values`}
                    dateFormat={DATE_FORMAT_WITHOUT_TIME}
                    timeFormat={false}
                    onChange={(val) => {
                      if (moment(val).format() === 'Invalid date') {
                        form.setFieldValue(`filters.${index}.values`, '');
                      } else {
                        form.setFieldValue(
                          `filters.${index}.values`,
                          moment(val).format(DATE_FORMAT_WITHOUT_TIME)
                        );
                      }
                    }}
                    value={filterValues.values}
                  />
                  {getErrorMessage(
                    form.errors?.filters?.[index]?.values,
                    form.touched?.filters?.[index]?.values
                  )}
                </>
              )}
              {filterValues.filter_operator ===
                ConversationEnums.FILTER_KEYS.EQUALS_TO && (
                <>
                  <Datetime
                    data-testid={`greaterThan_${index}`}
                    closeOnSelect={true}
                    inputProps={{
                      placeholder:
                        messages['CREATE_SEGMENT.USER_AFFINITY.SELECT_DATE'],
                      onBlur: () =>
                        form.setFieldTouched(`filters.${index}.values`),
                    }}
                    identifier={`filters.${index}.values`}
                    dateFormat={DATE_FORMAT_WITHOUT_TIME}
                    timeFormat={false}
                    onChange={(val) => {
                      if (moment(val).format() === 'Invalid date') {
                        form.setFieldValue(`filters.${index}.values`, '');
                      } else {
                        form.setFieldValue(
                          `filters.${index}.values`,
                          moment(val).format(DATE_FORMAT_WITHOUT_TIME)
                        );
                      }
                    }}
                    value={filterValues.values}
                  />
                  {getErrorMessage(
                    form.errors?.filters?.[index]?.values,
                    form.touched?.filters?.[index]?.values
                  )}
                </>
              )}
              {filterValues.filter_operator ===
                ConversationEnums.IDENTIFIERS.NOT_EQUAL_TO && (
                <>
                  <Datetime
                    data-testid={`greaterThan_${index}`}
                    closeOnSelect={true}
                    inputProps={{
                      placeholder:
                        messages['CREATE_SEGMENT.USER_AFFINITY.SELECT_DATE'],
                      onBlur: () =>
                        form.setFieldTouched(`filters.${index}.values`),
                    }}
                    identifier={`filters.${index}.values`}
                    dateFormat={DATE_FORMAT_WITHOUT_TIME}
                    timeFormat={false}
                    onChange={(val) => {
                      if (moment(val).format() === 'Invalid date') {
                        form.setFieldValue(`filters.${index}.values`, '');
                      } else {
                        form.setFieldValue(
                          `filters.${index}.values`,
                          moment(val).format(DATE_FORMAT_WITHOUT_TIME)
                        );
                      }
                    }}
                    value={filterValues.values}
                  />
                  {getErrorMessage(
                    form.errors?.filters?.[index]?.values,
                    form.touched?.filters?.[index]?.values
                  )}
                </>
              )}
              {filterValues.filter_operator ===
                ConversationEnums.IDENTIFIERS.IS_LESS_THAN && (
                <>
                  <Datetime
                    data-testid={`lessThan_${index}`}
                    closeOnSelect={true}
                    inputProps={{
                      placeholder:
                        messages['CREATE_SEGMENT.USER_AFFINITY.SELECT_DATE'],
                      onBlur: () =>
                        form.setFieldTouched(`filters.${index}.values`),
                    }}
                    identifier={`filters.${index}.values`}
                    dateFormat={DATE_FORMAT_WITHOUT_TIME}
                    timeFormat={false}
                    onChange={(val) => {
                      if (moment(val).format() === 'Invalid date') {
                        form.setFieldValue(`filters.${index}.values`, '');
                      } else {
                        form.setFieldValue(
                          `filters.${index}.values`,
                          moment(val).format(DATE_FORMAT_WITHOUT_TIME)
                        );
                      }
                    }}
                    value={filterValues.values}
                  />
                  {getErrorMessage(
                    form.errors?.filters?.[index]?.values,
                    form.touched?.filters?.[index]?.values
                  )}
                </>
              )}
              {!filterValues.filter_operator && (
                <>
                  <Datetime
                    data-testid={`noOpertorSelected${index}`}
                    closeOnSelect={true}
                    inputProps={{
                      placeholder:
                        messages['CREATE_SEGMENT.USER_AFFINITY.SELECT_DATE'],
                      onBlur: () =>
                        form.setFieldTouched(`filters.${index}.values`),
                    }}
                    identifier={`filters.${index}.values`}
                    dateFormat={DATE_FORMAT_WITHOUT_TIME}
                    timeFormat={false}
                    onChange={(val) => {
                      if (moment(val).format() === 'Invalid date') {
                        form.setFieldValue(`filters.${index}.values`, '');
                      } else {
                        form.setFieldValue(
                          `filters.${index}.values`,
                          moment(val).format(DATE_FORMAT_WITHOUT_TIME)
                        );
                      }
                    }}
                    value={filterValues.values}
                  />
                  {getErrorMessage(
                    form.errors?.filters?.[index]?.values,
                    form.touched?.filters?.[index]?.values
                  )}
                </>
              )}
            </Colxx>
          )}
          {filterValues.input_type ===
            ConversationEnums.FILTER_KEYS.SEARCH_BOX && (
            <Colxx xxs="12" md="4">
              <Select
                aria-label={`searchBox_${index}`}
                options={getDropDownValuesBasedOnKeyAndDataTypes()}
                onChange={(options) =>
                  handleOnChangeMultiSelect(
                    options,
                    ConversationEnums.FILTER_KEYS.SEARCH_BOX
                  )
                }
                value={getSelectedValues(
                  ConversationEnums.FILTER_KEYS.SEARCH_BOX
                )}
                styles={reactSelectStyles}
                onBlur={() => form.setFieldTouched(`filters.${index}.values`)}
              />
              {getErrorMessage(
                form.errors?.filters?.[index]?.values,
                form.touched?.filters?.[index]?.values
              )}
            </Colxx>
          )}
          {filterValues.input_type ===
            ConversationEnums.FILTER_KEYS.PLAIN_TEXT && (
            <Colxx xxs="12" md="4">
              <FormGroupCoustom
                type={'text'}
                dataTestId={`plainText_${index}`}
                noLable
                identifier={`filters.${index}.values`}
                onChange={(event) => {
                  form.setFieldValue(
                    `filters.${index}.values`,
                    event.target.value
                  );
                }}
                value={filterValues.values}
              />
              {getErrorMessage(
                form.errors?.filters?.[index]?.values,
                form.touched?.filters?.[index]?.values
              )}
            </Colxx>
          )}
          {filterValues.input_type === ConversationEnums.FILTER_KEYS.NUMBER && (
            <Colxx xxs="12" md="4">
              <FormGroupCoustom
                type={'number'}
                dataTestId={`plainText_${index}`}
                noLable
                identifier={`filters.${index}.values`}
                onChange={(event) => {
                  form.setFieldValue(
                    `filters.${index}.values`,
                    event.target.value
                  );
                }}
                value={filterValues.values}
              />
              {getErrorMessage(
                form.errors?.filters?.[index]?.values,
                form.touched?.filters?.[index]?.values
              )}
            </Colxx>
          )}
          {!filterValues.input_type && (
            <Colxx xxs="12" md="4">
              <FormGroupCoustom
                dataTestId={`emptyInputValue_${index}`}
                noLable
                identifier={`filters.${index}.values`}
                onChange={(event) => {
                  form.setFieldValue(
                    `filters.${index}.values`,
                    event.target.value
                  );
                }}
                value={filterValues.values}
              />
              {getErrorMessage(
                form.errors?.filters?.[index]?.values,
                form.touched?.filters?.[index]?.values
              )}
            </Colxx>
          )}
        </>
      ) : (
        <Colxx xxs="12" md="4" />
      )}
    </>
  );
};

export default injectIntl(ValueFieldBasedOnDataType);
