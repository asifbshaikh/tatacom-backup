import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import IntlMessages from 'helpers/IntlMessages';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import {
  Button,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { injectIntl } from 'react-intl';
import { setFiltersValue } from 'redux/dashboard-campaigns/actions';
import { filterTypeOptions } from 'data/createCampaignData';
import FormGroupCoustom from 'components/common/FormGroupCoustom';

const MoreFiltersPopOver = ({
  showFilter,
  setShowFilter,
  status,
  loading,
  getOptionsForFiltersAction,
  setFilters,
  setApply,
  setFiltersValue,
  filters,
}) => {
  const [statusChange, setStatusChange] = useState(false);
  const [createdChange, setCreatedChange] = useState(false);
  const [statusArray, setStatus] = useState();
  const [createdBy, setCreatedBy] = useState();
  const inputToggle = () => setShowFilter(!showFilter);
  const closeBtnForCustomSegment = (
    <button className="close" onClick={inputToggle} type="button">
      &times;
    </button>
  );
  const initialValues = {
    status: [],
    createdBy: '',
  };
  const filterUserSchema = Yup.object().shape({
    status: Yup.array().notRequired(),
    createdBy: Yup.string()
      .email(<IntlMessages id="HELP_CENTER.VALIDATION.INVALID_EMAIL" />)
      .notRequired(),
  });
  const onApply = (values) => {
    if (!statusChange && !createdChange) {
      setFilters({
        filter: 'both',
        value: filters.value,
        createdBy: filters.createdBy,
      });
      setFiltersValue({ value: filters.value, createdBy: filters.createdBy });
    } else if (values.status.length > 0 && values.createdBy) {
      setFilters({
        filter: 'both',
        value: values.status,
        createdBy: values.createdBy,
      });
      setFiltersValue({ value: values.status, createdBy: values.createdBy });
    } else if (values.status.length > 0 && !values.createdBy) {
      setFilters({ filter: 'status', value: values.status, status });
      setFiltersValue({ value: values.status, createdBy: values.createdBy });
    } else if (values.status.length === 0 && values.createdBy) {
      setFilters({ filter: 'createdBy', createdBy: values.createdBy });
      setFiltersValue({ value: values.status, createdBy: values.createdBy });
    } else if (statusChange && createdChange) {
      setFilters({
        filter: 'both',
        value: values.status,
        createdBy: values.createdBy,
      });
      setFiltersValue({ value: values.status, createdBy: values.createdBy });
    } else if (values.status.length === 0 && !values.createdBy) {
      setFilters({ filter: 'both', value: values.status, createdBy: '' });
      setFiltersValue({ value: '', createdBy: '' });
    }
    setApply(true);
    inputToggle();
  };
  return (
    <div>
      <Modal isOpen={showFilter} toggle={inputToggle}>
        <ModalHeader toggle={inputToggle} close={closeBtnForCustomSegment}>
          <i className="iconsminds-filter-2 campaignInfo3" />
          <IntlMessages id="DASHBOARD.FILTER.MORE_FILTERS" />
        </ModalHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={filterUserSchema}
          onSubmit={onApply}
        >
          {({ values, errors, touched, setFieldValue }) => {
            const handleCreatedByChange = (event) => {
              setCreatedChange(true);
              setFieldValue('createdBy', event.target.value);
              setCreatedBy(event.target.value);
              if (statusChange) {
                setFieldValue('status', statusArray);
              } else {
                setFieldValue('status', filters?.value);
              }
            };
            const handleSelect = (event) => {
              setStatusChange(true);
              setFieldValue('status', event);
              setStatus(event);
              if (createdChange) {
                setFieldValue('createdBy', createdBy);
              } else {
                setFieldValue('createdBy', filters?.createdBy);
              }
            };
            return (
              <Form>
                <ModalBody>
                  {(status === 'ALL' || status === 'ran_yesterday') && (
                    <>
                      <IntlMessages id="DASHBOARD.FILTER.STATUS" />
                      <FormGroup className="has-float-label">
                        <Select
                          className="react-select"
                          classNamePrefix="react-select"
                          identifier="status"
                          name="status"
                          placeholder={
                            <IntlMessages id="DASHBOARD.FILTER.SELECT_STATUS" />
                          }
                          closeMenuOnSelect
                          onChange={(event) => {
                            handleSelect(event);
                          }}
                          options={filterTypeOptions}
                          errors={errors}
                          touched={touched}
                          isMulti={true}
                          defaultValue={filters?.value}
                        />
                        {errors?.status && (
                          <div className="invalid-feedback d-block w-30">
                            <span>
                              <IntlMessages id={errors?.status} />
                            </span>
                          </div>
                        )}
                      </FormGroup>
                    </>
                  )}
                  <IntlMessages id="DASHBOARD.FILTER.CREATED_BY" />
                  <FormGroup className="has-float-label">
                    <FormGroupCoustom
                      identifier="createdBy"
                      noLable
                      fieldWithoutGroup
                      className="form-control flex-grow-1"
                      type="text"
                      placeholder="Created By"
                      onChange={(event) => {
                        handleCreatedByChange(event);
                      }}
                      value={
                        !createdChange ? filters?.createdBy : values.createdBy
                      }
                    />
                    {errors?.createdBy && (
                      <div className="invalid-feedback d-block w-30">
                        <span>
                          <IntlMessages id={errors?.createdBy?.props?.id} />
                        </span>
                      </div>
                    )}
                  </FormGroup>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="secondary"
                    onClick={() => {
                      inputToggle();
                    }}
                  >
                    <IntlMessages id="ALL_SEGMENTS.EXPORT.BUTTON.CANCEL" />
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    className={`btn-shadow btn-multiple-state ${
                      loading ? 'show-spinner' : ''
                    }`}
                  >
                    <span className="spinner d-inline-block">
                      <span className="bounce1" />
                      <span className="bounce2" />
                      <span className="bounce3" />
                    </span>
                    <span className="label">
                      <IntlMessages id="DASHBOARD.FILTER.APPLY" />
                    </span>
                  </Button>
                </ModalFooter>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    </div>
  );
};
const mapStateToProps = ({ dashboardCampaignsApp }) => {
  const { dashboardCampaignList, loadedDashboardCampaignList, filters } =
    dashboardCampaignsApp;
  return {
    dashboardCampaignList,
    loadedDashboardCampaignList,
    filters,
  };
};
export default connect(mapStateToProps, {
  setFiltersValue,
})(injectIntl(MoreFiltersPopOver));
