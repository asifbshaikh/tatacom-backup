import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import {
  arrayStringOptions,
  strigHideDropDownsFor,
  strigHideInputField,
  stringFilterType,
  CleanFieldValuesProvider,
  reactSelectStyles,
  showDropdownForCampaignChannelAndType,
} from 'data/segments/createSegmentFilterData';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import IntlMessages from 'helpers/IntlMessages';
import React, { useContext, useState } from 'react';
import { CustomInput } from 'reactstrap';
import CreatableSelect from 'react-select/creatable';
import { connect } from 'react-redux';

const FilterByStringOrArrayOfStringDataType = ({
  filteredValueByname,
  form,
  identifier,
  filterFormErrors,
  filterFormTouched,
  campaignChannelAndTypeList,
}) => {
  const { cleanFieldValues, getErrorMessageOfField } = useContext(
    CleanFieldValuesProvider
  );

  const [inputValue, setInputValue] = useState('');

  const handleOnOperatorChange = (event) => {
    form.setFieldValue(`${identifier}.operator`, event.target.value);
    cleanFieldValues(identifier, createSegementEnums.IDENTIFIERS.OPERATOR);
    if (
      strigHideDropDownsFor.includes(event.target.value) ||
      strigHideInputField.includes(event.target.value)
    ) {
      form.setFieldValue(`${identifier}.case_sensitive`, '');
    } else {
      form.setFieldValue(`${identifier}.case_sensitive`, false);
    }
  };

  const getReactTagInputValue = (values) => {
    return values && values.length > 0
      ? values.map((item) => {
          return { label: item, value: item };
        })
      : [];
  };

  const components = {
    DropdownIndicator: null,
  };

  const handleOnValueChange = (values) => {
    const selectedValues = values.map((option) => option.value);
    form.setFieldValue(`${identifier}.value`, selectedValues);
  };

  const handleKeyDown = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        form.setFieldValue(`${identifier}.value`, [
          ...filteredValueByname.value,
          inputValue,
        ]);
        setInputValue('');
        event.preventDefault();
        break;
      default:
        return false;
    }
  };

  const getCampaignDropdownOptions = () => {
    return [
      { id: '', value: 'CREATE_SEGMENT.SELECT_OPTION' },
      ...campaignChannelAndTypeList?.[filteredValueByname.name],
    ];
  };

  return (
    <>
      {showDropdownForCampaignChannelAndType.includes(
        filteredValueByname.name
      ) ? (
        <>
          <div className="d-flex align-items-center mr-2 ml-2">
            <span>
              <IntlMessages id="CREATE_SEGMENT.IS" />
            </span>
          </div>

          <Colxx xxs="12" md="2">
            <FormGroupCoustom
              type="select"
              noLable
              identifier={`${identifier}.value`}
              options={getCampaignDropdownOptions()}
              dataTestId="valueSelect"
            />
            {getErrorMessageOfField(
              filterFormErrors,
              filterFormTouched,
              'value'
            )}
          </Colxx>
        </>
      ) : (
        <>
          <Colxx xxs="12" md="2">
            <FormGroupCoustom
              noLable
              options={
                filteredValueByname.data_type ===
                createSegementEnums.CONDITION.ARRAY_STRING
                  ? arrayStringOptions
                  : stringFilterType
              }
              identifier={`${identifier}.operator`}
              type="select"
              onChange={handleOnOperatorChange}
              value={filteredValueByname.operator}
              onBlur={form.handleBlur}
              dataTestId="operatorSelect"
            />
            {getErrorMessageOfField(
              filterFormErrors,
              filterFormTouched,
              'operator'
            )}
          </Colxx>
          {!strigHideDropDownsFor.includes(filteredValueByname.operator) && (
            <>
              {!strigHideInputField.includes(filteredValueByname.operator) && (
                <Colxx xxs="12" md="2">
                  <FormGroupCoustom
                    noLable
                    identifier={`${identifier}.value`}
                    onBlur={form.handleBlur}
                  />
                  {getErrorMessageOfField(
                    filterFormErrors,
                    filterFormTouched,
                    'value'
                  )}
                </Colxx>
              )}
              {strigHideInputField.includes(filteredValueByname.operator) && (
                <Colxx xxs="12" md="2">
                  <CreatableSelect
                    aria-label="reactSelectTag"
                    components={components}
                    inputValue={inputValue}
                    isClearable
                    isMulti
                    styles={reactSelectStyles}
                    menuIsOpen={false}
                    onChange={handleOnValueChange}
                    onInputChange={(newValue) => setInputValue(newValue)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      <IntlMessages id="CREATE_SEGMENT.ENTER_THE_TEXT" />
                    }
                    value={getReactTagInputValue(filteredValueByname.value)}
                  />
                  {getErrorMessageOfField(
                    filterFormErrors,
                    filterFormTouched,
                    'value'
                  )}
                </Colxx>
              )}
              {!strigHideInputField.includes(filteredValueByname.operator) && (
                <Colxx xxs="12" md="2">
                  <div className="mt-1 text-no-wrap">
                    <CustomInput
                      type="checkbox"
                      id={`${identifier}.case_sensitive`}
                      checked={filteredValueByname.case_sensitive}
                      onChange={(event) =>
                        form.setFieldValue(
                          `${identifier}.case_sensitive`,
                          event.target.checked
                        )
                      }
                      label={
                        <IntlMessages id="CREATE_SEGMENT.CASE_SENSITIVE" />
                      }
                    />
                  </div>
                </Colxx>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

const mapStateToProps = ({ segmentationApp }) => {
  const { campaignChannelAndTypeList } = segmentationApp;
  return {
    campaignChannelAndTypeList,
  };
};

export default connect(
  mapStateToProps,
  null
)(FilterByStringOrArrayOfStringDataType);
