import { Colxx } from 'components/common/CustomBootstrap';
import React, { useContext, useEffect } from 'react';
import { Row } from 'reactstrap';
import { connect } from 'react-redux';
import { getCategoryDropdownList } from 'redux/actions';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import GroupedOptionsSelect from './GroupedOptionsSelect';
import FilterBasedOnDataTypes from './FilterBasedOnDataTypes';

const FilterByUsersProperty = ({
  categoryList,
  getCategoryDropdownListAction,
  filteredUserPropertyValues,
  identifier,
  form,
  filterFormErrors,
  filterFormTouched,
}) => {
  useEffect(() => {
    getCategoryDropdownListAction();
  }, []);

  const { cleanFieldValues, getErrorMessageOfField } = useContext(
    CleanFieldValuesProvider
  );

  const getDataTypeOptions = () => {
    const dataTypeOptions = [];
    const dataTypeListOptions = categoryList?.find((category) => {
      return category.name === filteredUserPropertyValues.name;
    });
    if (dataTypeListOptions) {
      dataTypeListOptions?.data_types?.forEach((list) => {
        dataTypeOptions.push({ id: list, value: list });
      });
      if (dataTypeListOptions?.data_types.length > 1) {
        dataTypeOptions.unshift({
          id: '',
          value: createSegementEnums.LABEL.SELECT_OPERATOR,
        });
      }
    }
    return dataTypeOptions;
  };

  const handleOnNameChangeDropDown = (option) => {
    cleanFieldValues(identifier, createSegementEnums.IDENTIFIERS.NAME);
    const dataTypeListOptions = categoryList?.find((category) => {
      return category.name === option.value;
    });
    if (dataTypeListOptions && dataTypeListOptions.data_types.length === 1) {
      form.setFieldValue(
        `${identifier}.data_type`,
        dataTypeListOptions.data_types[0]
      );
    } else {
      form.setFieldValue(`${identifier}.data_type`, '');
    }
    form.setFieldValue(`${identifier}.category`, dataTypeListOptions.category);
    form.setFieldValue(
      `${identifier}.displayed_name`,
      dataTypeListOptions.displayed_name
    );
    form.setFieldValue(`${identifier}.name`, option.value);
  };

  return (
    <Row>
      <Colxx xxs="12" md="2" className="mb-2">
        <GroupedOptionsSelect
          ariaLabel="userPropertyNameField"
          data={categoryList}
          optionIdentifier={{
            label: createSegementEnums.IDENTIFIERS.DISPLAYED_NAME,
            value: createSegementEnums.IDENTIFIERS.NAME,
          }}
          groupedOptionsValue={filteredUserPropertyValues}
          handleOnChangeDropDown={handleOnNameChangeDropDown}
          handleOnBlur={() => {
            form.setFieldTouched(`${identifier}.name`, true, false);
          }}
          handleOnFocus={() => {
            form.setFieldTouched(`${identifier}.name`, false, false);
          }}
        />

        {getErrorMessageOfField(filterFormErrors, filterFormTouched, 'name')}
      </Colxx>

      {filteredUserPropertyValues.name && (
        <FilterBasedOnDataTypes
          form={form}
          filteredValueByname={filteredUserPropertyValues}
          identifier={identifier}
          dataTypeOptions={getDataTypeOptions()}
          filterFormErrors={filterFormErrors}
          filterFormTouched={filterFormTouched}
        />
      )}
    </Row>
  );
};

const mapStateToProps = ({ segmentationApp }) => {
  const { categoryDropdownList, userEventsList } = segmentationApp;
  return {
    categoryList: categoryDropdownList,
    userEventsList,
  };
};

export default connect(mapStateToProps, {
  getCategoryDropdownListAction: getCategoryDropdownList,
})(FilterByUsersProperty);
