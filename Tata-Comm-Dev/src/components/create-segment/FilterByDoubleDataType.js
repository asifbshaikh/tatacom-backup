import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import {
  doubleHideInputDropDown,
  doubleHideInputFieldAndShowDropDown,
  doubleShowTwoInputFields,
  getNumericValues,
  numericFilterType,
  CleanFieldValuesProvider,
  getIsBetweenValues,
} from 'data/segments/createSegmentFilterData';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import React, { useContext } from 'react';
import GroupedOptionsSelect from './GroupedOptionsSelect';
import IntlMessages from 'helpers/IntlMessages';

const FilterByDoubleDataType = ({
  filteredValueByname,
  identifier,
  form,
  filterFormErrors,
  filterFormTouched,
}) => {
  const { cleanFieldValues, getErrorMessageOfField } = useContext(
    CleanFieldValuesProvider
  );

  const handleOnOperatorChange = (event) => {
    form.setFieldValue(`${identifier}.operator`, event.target.value);
    cleanFieldValues(identifier, createSegementEnums.IDENTIFIERS.OPERATOR);
  };

  const handleOnValueChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    form.setFieldValue(`${identifier}.value`, selectedValues);
  };

  return (
    <>
      <Colxx xxs="12" md="2">
        <FormGroupCoustom
          dataTestId={filteredValueByname.operator}
          noLable
          options={numericFilterType}
          identifier={`${identifier}.operator`}
          type="select"
          onChange={handleOnOperatorChange}
          value={filteredValueByname.operator}
        />
        {getErrorMessageOfField(
          filterFormErrors,
          filterFormTouched,
          'operator'
        )}
      </Colxx>

      {!doubleHideInputDropDown.includes(filteredValueByname.operator) && (
        <>
          {doubleHideInputFieldAndShowDropDown.includes(
            filteredValueByname.operator
          ) && (
            <Colxx xxs="12" md="2">
              <GroupedOptionsSelect
                ariaLabel="multiSelectIntheFollowing"
                data={getNumericValues(
                  createSegementEnums.RANGE_CONSTANTS.OTHER_RANGE
                )}
                form={form}
                groupedOptionsValue={filteredValueByname}
                optionIdentifier={{
                  label: 'value',
                  value: 'id',
                }}
                handleOnBlur={() => form.setFieldTouched(`${identifier}.value`)}
                handleOnChangeDropDown={handleOnValueChange}
                optionType="unGrouped"
                isCheckboxMultiSelect
                fieldLabel="value"
              />
              {getErrorMessageOfField(
                filterFormErrors,
                filterFormTouched,
                'value'
              )}
            </Colxx>
          )}

          {!doubleHideInputFieldAndShowDropDown.includes(
            filteredValueByname.operator
          ) && (
            <>
              <Colxx xxs="12" md="2">
                <FormGroupCoustom
                  dataTestId={filteredValueByname.value}
                  noLable
                  type="select"
                  identifier={`${identifier}.value`}
                  options={getNumericValues(
                    createSegementEnums.RANGE_CONSTANTS.OTHER_RANGE
                  )}
                />
                {getErrorMessageOfField(
                  filterFormErrors,
                  filterFormTouched,
                  'value'
                )}
              </Colxx>
              {doubleShowTwoInputFields.includes(
                filteredValueByname.operator
              ) && (
                <>
                  <Colxx xxs="12" md="1">
                    {' '}
                    <span>
                      <IntlMessages id="CREATE_SEGMENT.LOWER_CASE_AND" />
                    </span>
                  </Colxx>{' '}
                  <Colxx xxs="12" md="2">
                    <FormGroupCoustom
                      dataTestId={filteredValueByname.value1}
                      noLable
                      identifier={`${identifier}.value1`}
                      type="select"
                      options={getIsBetweenValues(
                        filteredValueByname.value,
                        getNumericValues(
                          createSegementEnums.RANGE_CONSTANTS.OTHER_RANGE
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
          )}
        </>
      )}
    </>
  );
};

export default FilterByDoubleDataType;
