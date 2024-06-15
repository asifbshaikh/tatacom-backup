import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import React, { useContext } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import '../../assets/css/sass/views/segment.scss';
import {
  renderBooleanAndCheckbox,
  renderDateAndDatetime,
  renderDoubleAndNumber,
  renderStringAndStringArray,
  CleanFieldValuesProvider,
} from 'data/segments/createSegmentFilterData';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import FilterByStringOrArrayOfStringDataType from './FilterByStringOrArrayOfStringDataType';
import FilterByDateTimeDataType from './FilterByDateTimeDataType';
import FilterByDoubleDataType from './FilterByDoubleDataType';
import FilterByBooleanDataType from './FilterByBooleanDataType';

const FilterBasedOnDataTypes = ({
  identifier,
  form,
  dataTypeOptions,
  filteredValueByname,
  filterFormErrors,
  filterFormTouched,
}) => {
  const { cleanFieldValues, getErrorMessageOfField } = useContext(
    CleanFieldValuesProvider
  );

  const handleOnDataTypeChange = (event) => {
    form.setFieldValue(`${identifier}.data_type`, event.target.value);
    cleanFieldValues(identifier, createSegementEnums.IDENTIFIERS.DATA_TYPE);
  };

  return (
    <>
      {!(dataTypeOptions.length === 1) && (
        <Colxx xxs="12" md="2">
          <FormGroupCoustom
            dataTestId="dataTypeDropDown"
            noLable
            options={dataTypeOptions}
            identifier={`${identifier}.data_type`}
            type="select"
            className="disable-first-option"
            onChange={handleOnDataTypeChange}
            value={filteredValueByname.data_type}
            onBlur={form.handleBlur}
          />
          {getErrorMessageOfField(
            filterFormErrors,
            filterFormTouched,
            'data_type'
          )}
        </Colxx>
      )}

      {renderStringAndStringArray.includes(filteredValueByname.data_type) && (
        <FilterByStringOrArrayOfStringDataType
          form={form}
          filteredValueByname={filteredValueByname}
          identifier={identifier}
          filterFormErrors={filterFormErrors}
          filterFormTouched={filterFormTouched}
        />
      )}
      {renderDateAndDatetime.includes(filteredValueByname.data_type) && (
        <FilterByDateTimeDataType
          form={form}
          filteredValueByname={filteredValueByname}
          identifier={identifier}
          filterFormErrors={filterFormErrors}
          filterFormTouched={filterFormTouched}
        />
      )}
      {renderDoubleAndNumber.includes(filteredValueByname.data_type) && (
        <FilterByDoubleDataType
          form={form}
          filteredValueByname={filteredValueByname}
          identifier={identifier}
          filterFormErrors={filterFormErrors}
          filterFormTouched={filterFormTouched}
        />
      )}
      {renderBooleanAndCheckbox.includes(filteredValueByname.data_type) && (
        <FilterByBooleanDataType
          filteredValueByname={filteredValueByname}
          identifier={identifier}
          form={form}
          filterFormErrors={filterFormErrors}
          filterFormTouched={filterFormTouched}
        />
      )}
    </>
  );
};

export default FilterBasedOnDataTypes;
