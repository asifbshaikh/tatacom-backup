import React, { useContext } from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import {
  booleanDataTypeDropDownOptions,
  booleanFilterType,
  booleanHideDropDown,
  CleanFieldValuesProvider,
} from 'data/segments/createSegmentFilterData';
import createSegementEnums from 'enums/createSegment/createSegementEnums';

const FilterByBooleanDataType = ({
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

  return (
    <>
      <Colxx xxs="12" md="2">
        <FormGroupCoustom
          dataTestId={filteredValueByname.operator}
          noLable
          options={booleanFilterType}
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

      {!booleanHideDropDown.includes(filteredValueByname.operator) && (
        <Colxx xxs="12" md="2">
          <FormGroupCoustom
            dataTestId={filteredValueByname.value}
            noLable
            identifier={`${identifier}.value`}
            type="select"
            options={booleanDataTypeDropDownOptions}
          />
          {getErrorMessageOfField(filterFormErrors, filterFormTouched, 'value')}
        </Colxx>
      )}
    </>
  );
};

export default FilterByBooleanDataType;
