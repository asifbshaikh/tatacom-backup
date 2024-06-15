import React from 'react';
import Select from 'react-select';
import { Label } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';

const CSATReportFilter = ({
  type: fieldType,
  labelKey,
  options,
  getter,
  setter,
  isMulti,
}) => {
  return (
    <div className="form-group p-0 m-0 mr-2">
      <Label htmlFor={`${fieldType}Selection`}>
        <Select
          id={`${fieldType}Selection`}
          classNamePrefix="react-select"
          options={options.map((val) => ({
            value: val.id,
            label: val[labelKey],
          }))}
          isMulti={isMulti}
          value={getter}
          className="react-select filter-select"
          placeholder={<IntlMessages id="REPORT.PLACEHOLDER" />}
          onChange={(val) => {
            setter(val);
          }}
        />
      </Label>
    </div>
  );
};

export default CSATReportFilter;
