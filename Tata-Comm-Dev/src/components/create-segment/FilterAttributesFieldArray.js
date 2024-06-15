import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { filterConditionOptions } from 'data/createCampaignData';
import { FieldArray } from 'formik';
import IntlMessages from 'helpers/IntlMessages';
import React, { useContext } from 'react';
import { Button, Row } from 'reactstrap';
import GroupedOptionsSelect from './GroupedOptionsSelect';
import FilterBasedOnDataTypes from './FilterBasedOnDataTypes';
import {
  CleanFieldValuesProvider,
  showDropdownForCampaignChannelAndType,
} from 'data/segments/createSegmentFilterData';
import createSegementEnums from 'enums/createSegment/createSegementEnums';

const FilterAttributesFieldArray = ({
  filterAttributeIdentifier,
  filterAttributeValue,
  isFilterTypeDropDown = false,
  userAttributesList,
  ConditionLabel,
  form,
  isWithAttribute = false,
  attributeIdentifier,
  dropDownType,
  filterFormErrors,
  filterFormTouched,
  flowExit,
}) => {
  const { cleanFieldValues, getErrorMessageOfField } = useContext(
    CleanFieldValuesProvider
  );

  const handleOnAttributeNameChange = (option, index) => {
    cleanFieldValues(
      `${filterAttributeIdentifier}.${attributeIdentifier}.filters.${index}`,
      'name'
    );
    form.setFieldValue(
      `${filterAttributeIdentifier}.${attributeIdentifier}.filters.${index}.name`,
      option.value
    );
    const dataTypeListOptions = userAttributesList.find((category) => {
      return category.name === option.value;
    });
    if (dataTypeListOptions && dataTypeListOptions.data_types.length === 1) {
      form.setFieldValue(
        `${filterAttributeIdentifier}.${attributeIdentifier}.filters.${index}.data_type`,
        dataTypeListOptions.data_types[0]
      );
    } else {
      form.setFieldValue(
        `${filterAttributeIdentifier}.${attributeIdentifier}.filters.${index}.data_type`,
        ''
      );
    }
    form.setFieldValue(
      `${filterAttributeIdentifier}.${attributeIdentifier}.filters.${index}.category`,
      dataTypeListOptions.category
    );

    if (showDropdownForCampaignChannelAndType.includes(option.value)) {
      form.setFieldValue(
        `${filterAttributeIdentifier}.${attributeIdentifier}.filters.${index}.operator`,
        createSegementEnums.CONDITION.IS
      );
    }
  };

  const handleOnAttributeClick = () => {
    const obj = { name: '' };
    if (
      filterAttributeValue.filter_type ===
      createSegementEnums.CONDITION.USER_AFFINITY
    ) {
      obj.filter_type =
        createSegementEnums.INITIALVALUES.USER_AFFINITY_ATTRIBUTES;
    } else {
      obj.filter_type =
        createSegementEnums.INITIALVALUES.USER_BEHAVIOR_ATTRIBUTES;
    }
    const array = [...filterAttributeValue[attributeIdentifier].filters, obj];

    form.setFieldValue(
      `${filterAttributeIdentifier}.${attributeIdentifier}.filters`,
      array
    );
  };

  const handleOnDeleteBtnClick = (index) => {
    const arr = [...filterAttributeValue[attributeIdentifier].filters];
    arr.splice(index, 1);
    form.setFieldValue(
      `${filterAttributeIdentifier}.${attributeIdentifier}.filters`,
      arr
    );
  };

  const getDataTypeOptions = (index) => {
    const dataTypeOptions = [];
    const dataTypeListOptions = userAttributesList?.find((category) => {
      return (
        category.name ===
        filterAttributeValue[attributeIdentifier].filters[index].name
      );
    });
    if (dataTypeListOptions) {
      dataTypeListOptions?.data_types?.forEach((list) => {
        dataTypeOptions.push({ id: list, value: list });
      });
      if (dataTypeListOptions?.data_types.length > 1) {
        dataTypeOptions.unshift({
          id: '',
          value: 'Select data type',
        });
      }
    }
    return dataTypeOptions;
  };

  return (
    <div
      className={`${
        isWithAttribute &&
        filterAttributeValue?.[attributeIdentifier]?.filters.length > 0
          ? 'stretch-line'
          : ''
      } pl-0`}
    >
      <FieldArray name={filterAttributeIdentifier} className="filter-by-users">
        {() =>
          filterAttributeValue?.[attributeIdentifier]?.filters?.length > 0 &&
          filterAttributeValue?.[attributeIdentifier]?.filters?.map(
            (attributeObject, index) => {
              return (
                <Row
                  key={`${attributeObject}.${index.toString()}`}
                  className={`d-flex pt-${
                    !isWithAttribute && index === 0 ? 0 : 4
                  } pl-0 field-array-row ml-0`}
                >
                  {isWithAttribute ? (
                    <span className="horizontal-tree-line" />
                  ) : (
                    <></>
                  )}
                  {index === 0 && (
                    <Colxx
                      xxs="12"
                      md={isWithAttribute ? '2' : '1'}
                      className="d-flex align-items-center"
                    >
                      <span>
                        <IntlMessages id={ConditionLabel} />
                      </span>
                    </Colxx>
                  )}
                  {isFilterTypeDropDown && index >= 1 && (
                    <Colxx xxs="12" md={isWithAttribute ? '2' : '1'}>
                      <FormGroupCoustom
                        dataTestId="filterCondition"
                        identifierLabel="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.SELECT_AUDIENCE_FILTER_CONDITION"
                        identifier={`${filterAttributeIdentifier}.${attributeIdentifier}.filter_operator`}
                        type="select"
                        options={filterConditionOptions}
                        className="rounded-3"
                      />
                    </Colxx>
                  )}

                  {!isFilterTypeDropDown && index >= 1 && (
                    <Colxx
                      xxs="12"
                      md="1"
                      className="d-flex align-items-center"
                    >
                      <span>
                        {flowExit ? (
                          <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.OR" />
                        ) : (
                          <IntlMessages id="CREATE_SEGMENT.AND" />
                        )}
                      </span>
                    </Colxx>
                  )}
                  <Colxx xxs="12" md="2">
                    <GroupedOptionsSelect
                      ariaLabel="filterAttributeNameField"
                      data={userAttributesList}
                      form={form}
                      groupedOptionsValue={
                        filterAttributeValue[attributeIdentifier].filters[index]
                      }
                      optionIdentifier={{
                        label: 'display_name',
                        value: 'name',
                      }}
                      handleOnBlur={() =>
                        form.setFieldTouched(
                          `${filterAttributeIdentifier}.${attributeIdentifier}.filters.${index}.name`
                        )
                      }
                      handleOnChangeDropDown={(option) =>
                        handleOnAttributeNameChange(option, index)
                      }
                      optionType={dropDownType}
                    />
                    {getErrorMessageOfField(
                      filterFormErrors?.[attributeIdentifier]?.filters?.[index],
                      filterFormTouched?.[attributeIdentifier]?.filters?.[
                        index
                      ],
                      'name'
                    )}
                  </Colxx>
                  {filterAttributeValue[attributeIdentifier].filters[index]
                    .category && (
                    <FilterBasedOnDataTypes
                      form={form}
                      filteredValueByname={
                        filterAttributeValue[attributeIdentifier].filters[index]
                      }
                      identifier={`${filterAttributeIdentifier}.${attributeIdentifier}.filters.${index}`}
                      dataTypeOptions={getDataTypeOptions(index)}
                      filterFormErrors={
                        filterFormErrors?.[attributeIdentifier]?.filters?.[
                          index
                        ]
                      }
                      filterFormTouched={
                        filterFormTouched?.[attributeIdentifier]?.filters?.[
                          index
                        ]
                      }
                    />
                  )}
                  {!isWithAttribute && index !== 0 && (
                    <Button
                      aria-label="withDeleteBtn"
                      color="theme-3 bg-transparent"
                      className="icon-button ml-1"
                      onClick={() => handleOnDeleteBtnClick(index)}
                    >
                      <i className="simple-icon-trash" />
                    </Button>
                  )}
                  {isWithAttribute && (
                    <Button
                      aria-label="withAttributeDeleteBtn"
                      color="theme-3 bg-transparent"
                      className="icon-button ml-1"
                      onClick={() => handleOnDeleteBtnClick(index)}
                    >
                      <i className="simple-icon-trash" />
                    </Button>
                  )}
                </Row>
              );
            }
          )
        }
      </FieldArray>

      <Row className="mt-3">
        <Colxx xxs="12" md="10" className="ml-3">
          <span
            onClick={() => handleOnAttributeClick()}
            role="button"
            tabIndex={0}
            onKeyDown={() => {}}
            className="font-weight-bold clickable-text user-pointer"
          >
            {flowExit ? (
              <IntlMessages id="DRIP_CAMPAIGN.FLOW_CONDITIONS.LABEL.EXIT_FILTER" />
            ) : (
              <IntlMessages id="CREATE_SEGMENT.BUTTONS.ADD_ATTRIBUTES" />
            )}
          </span>
        </Colxx>
      </Row>
    </div>
  );
};

export default FilterAttributesFieldArray;
