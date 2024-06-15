/* eslint-disable react/display-name */
import React, { useContext, useEffect, useState } from 'react';
import { getCustomSegListData } from 'redux/actions';
import { connect } from 'react-redux';
import SearchFilterDropdown from './SearchFilterDropdown';
import { CleanFieldValuesProvider } from 'data/segments/createSegmentFilterData';

const CustomSegment = ({
  customSegListData,
  getCustomSegListDataAction,
  identifier,
  form,
  filterFormErrors,
  filterFormTouched,
  selectedCustomSegmentValues,
}) => {
  let data = [];
  const [selectedVal, setSelectedVal] = useState({
    value: selectedCustomSegmentValues.segment_id,
    label: selectedCustomSegmentValues.name,
  });
  useEffect(() => {
    getCustomSegListDataAction();
  }, []);

  const { getErrorMessageOfField } = useContext(CleanFieldValuesProvider);

  if (customSegListData && customSegListData?.length > 0) {
    data = customSegListData.map((item) => {
      return { value: item.id, label: item.name };
    });
  }

  const handleDropdownChange = (val) => {
    form.setFieldValue(`${identifier}.id`, undefined);
    form.setFieldValue(`${identifier}.segment_id`, val.value);
    form.setFieldValue(`${identifier}.name`, val.label?.toString());
    setSelectedVal(val);
  };

  return (
    <>
      <SearchFilterDropdown
        custSegData={data}
        selectedValue={selectedVal}
        handleOnChange={handleDropdownChange}
        identifier={identifier}
        onBlur={() => {
          form.setFieldTouched(`${identifier}.name`, true, false);
        }}
        handleOnFocus={() => {
          form.setFieldTouched(`${identifier}.name`, false, false);
        }}
      />
      {getErrorMessageOfField(filterFormErrors, filterFormTouched, 'name')}
    </>
  );
};

const mapStateToProps = ({ segmentationApp }) => {
  const { customSegList } = segmentationApp;
  return { customSegListData: customSegList };
};

export default connect(mapStateToProps, {
  getCustomSegListDataAction: getCustomSegListData,
})(CustomSegment);
