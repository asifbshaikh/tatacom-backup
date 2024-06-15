import { Colxx } from 'components/common/CustomBootstrap';
import {
  getDateInputStringDropDownOptions,
  strigHideInputField,
  CleanFieldValuesProvider,
  getIsBetweenValues,
} from 'data/segments/createSegmentFilterData';
import React, { useContext } from 'react';
import GroupedOptionsSelect from './GroupedOptionsSelect';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import IntlMessages from 'helpers/IntlMessages';

const DailyWhereTheHourRangeType = ({
  handleOnValueChange,
  identifier,
  form,
  filteredValueByname,
  filterFormErrors,
  filterFormTouched,
}) => {
  const { getErrorMessageOfField } = useContext(CleanFieldValuesProvider);
  return (
    <>
      {strigHideInputField.includes(filteredValueByname.operator) ? (
        <Colxx xxs="12" md="2">
          <GroupedOptionsSelect
            data={getDateInputStringDropDownOptions(
              filteredValueByname.range,
              filteredValueByname.operator
            )}
            form={form}
            groupedOptionsValue={filteredValueByname}
            optionIdentifier={{
              label: 'value',
              value: 'id',
            }}
            handleOnChangeDropDown={handleOnValueChange}
            optionType="unGrouped"
            isCheckboxMultiSelect
            fieldLabel="value"
            ariaLabel={filteredValueByname.value}
            handleOnBlur={() => form.setFieldTouched(`${identifier}.value`)}
          />
          {getErrorMessageOfField(filterFormErrors, filterFormTouched, 'value')}
        </Colxx>
      ) : (
        <Colxx xxs="12" md="2">
          <FormGroupCoustom
            dataTestId={filteredValueByname.value}
            noLable
            identifier={`${identifier}.value`}
            type="select"
            options={getDateInputStringDropDownOptions(
              filteredValueByname.range,
              filteredValueByname.operator
            )}
          />
          {getErrorMessageOfField(filterFormErrors, filterFormTouched, 'value')}
        </Colxx>
      )}
      {filteredValueByname.operator ===
        createSegementEnums.CONDITION.IS_BETWEEN && (
        <>
          <Colxx xxs="12" md="1">
            {' '}
            <span>
              <IntlMessages id="CREATE_SEGMENT.USER_AFFINITY.AND" />
            </span>
          </Colxx>
          <Colxx xxs="12" md="2">
            <FormGroupCoustom
              dataTestId={filteredValueByname.value1}
              noLable
              identifier={`${identifier}.value1`}
              type="select"
              options={getIsBetweenValues(
                filteredValueByname.value,
                getDateInputStringDropDownOptions(
                  filteredValueByname.range,
                  filteredValueByname.operator
                )
              )}
            />
            {getErrorMessageOfField(
              filterFormErrors,
              filterFormTouched,
              'value1'
            )}
          </Colxx>
        </>
      )}
    </>
  );
};

export default DailyWhereTheHourRangeType;
