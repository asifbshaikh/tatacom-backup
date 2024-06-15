/* eslint-disable react/display-name */
import { reactSelectStyles } from 'data/segments/createSegmentFilterData';
import React from 'react';
import Select from 'react-select';

const SearchFilterDropdown = ({
  custSegData,
  selectedValue,
  handleOnChange,
  identifier,
  onBlur,
  handleOnFocus,
}) => {
  return (
    <>
      <Select
        className="basic-single"
        isSearchable="true"
        aria-label="custom-segment-select"
        value={selectedValue}
        identifier={`${identifier}.name`}
        onChange={(val) => handleOnChange(val)}
        options={custSegData}
        styles={reactSelectStyles}
        onBlur={onBlur}
        onFocus={handleOnFocus}
      />
    </>
  );
};

export default SearchFilterDropdown;
