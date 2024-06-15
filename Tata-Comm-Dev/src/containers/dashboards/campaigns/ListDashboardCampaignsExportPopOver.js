import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import IntlMessages from 'helpers/IntlMessages';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import {
  Button,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { injectIntl } from 'react-intl';
import { getCurrentUser } from 'helpers/Utils';
import { NotificationManager } from 'components/common/react-notifications';
import {
  getCampaignsDetailsExportDownload,
  getCampaignsDetailsExportDownloadReset,
} from 'redux/dashboard-campaigns/actions';
import moment from 'moment';
import Datetime from 'react-datetime';

const ListDashboardCampaignsExportUserPopOver = ({
  showExport,
  setShowExport,
  intl,
  loading,
  dashboardCampaignList,
  getCampaignsDetailsExportDownloadAction,
  getCampaignsDetailsExportDownloadResetAction,
  exportSuccess,
  currentPage,
  campaignStatus,
  campaignTypes,
  channelType,
  campaignName,
  startDate,
  endDate,
  filters,
}) => {
  const inputToggle = () => setShowExport(!showExport);
  const [startDateValue, setStartDateValue] = useState(
    startDate ? moment(startDate) : moment()
  );
  const [endDateValue, setEndDateValue] = useState(
    endDate ? moment(endDate) : moment()
  );
  const [filteredData, setFilteredData] = useState(moment());
  const { messages } = intl;
  const closeBtnForCustomSegment = (
    <button className="close" onClick={inputToggle} type="button">
      &times;
    </button>
  );
  const user = getCurrentUser();
  const initialValues = {
    startDateID: startDate ? startDate : moment().format('DD MMMM YYYY'),
    endDateID: endDate ? endDate : moment().format('DD MMMM YYYY'),
    attribute: '',
  };
  const getFieldRequiredMessage = (message) => {
    return <IntlMessages id={message} />;
  };
  const exportUserSchema = Yup.object().shape({
    startDateID: Yup.string().required('Custom Start date is required'),
    endDateID: Yup.string()
      .test(
        'start-date-less-than-end-date',
        'DASHBOARD.CAMPAIGN.VALUE.CHANNELS.END_TIME_ERROR_MESSAGE',
        function (endDate, value) {
          return (
            moment(value?.parent?.startDateID).unix() <=
            moment(value?.parent?.endDateID).unix()
          );
        }
      )
      .required('Custom End date is required'),
    attribute: Yup.object().required(
      'DASHBOARD.CAMPAIGN.VALUE.CHANNELS.FORMAT_ERROR'
    ),
  });
  const onExport = (values) => {
    const payload = {
      start_date: moment(values.startDateID).format('YYYY-MM-DD'),
      end_date: moment(values.endDateID).format('YYYY-MM-DD'),
      format: values.attribute,
      page: currentPage,
      filter: campaignStatus,
      delivery_types: campaignTypes,
      channel_types: channelType,
      campaign_name: campaignName,
    };
    if (Object.keys(filters).length > 0) {
      payload.moreFilters = filters;
    }
    getCampaignsDetailsExportDownloadAction(payload);
  };
  const getDataTypeOptions = () => {
    const dataTypeOptions = [
      {
        value: 'pdf',
        label: 'PDF',
      },
      {
        value: 'xlsx',
        label: 'Excel',
      },
      {
        value: 'csv',
        label: 'CSV',
      },
    ];
    return dataTypeOptions;
  };
  if (exportSuccess === true) {
    NotificationManager.success(
      'Export is successful',
      'Success',
      2000,
      null,
      null
    );
    getCampaignsDetailsExportDownloadResetAction();
  } else if (exportSuccess === false) {
    NotificationManager.error('Export Failure', 'failure', 5000, null, null);
    getCampaignsDetailsExportDownloadResetAction();
  }
  const handleStartDateOnChange = (data, setFieldValue) => {
    setFieldValue(`startDateID`, data);
    const filteredCampaignData = dashboardCampaignList.filter((item) => {
      let unix = new Date(item.created_at * 1000);
      return (
        data.getFullYear === unix.getFullYear &&
        data.getMonth === unix.getMonth &&
        data.getDate === unix.getDate
      );
    });
    setFilteredData(filteredCampaignData);
  };
  const handleEndDateOnChange = (data, setFieldValue) => {
    setFieldValue(`endDateID`, data);
  };
  return (
    <div>
      <Modal isOpen={showExport} toggle={inputToggle}>
        <ModalHeader toggle={inputToggle} close={closeBtnForCustomSegment}>
          <IntlMessages id="ALL_SEGMENTS.EXPORT.TITLE.EXPORT_USER_DATA" />
        </ModalHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={exportUserSchema}
          onSubmit={onExport}
        >
          {({ values, errors, touched, setFieldValue }) => {
            return (
              <Form>
                <ModalBody>
                  <FormGroup className="has-float-label">
                    <Label htmlFor="attribute">
                      <IntlMessages id="DASHBOARD.CAMPAIGN.BUTTONS.CUSTOM_START_DATE" />
                    </Label>
                    <Datetime
                      className="send-date"
                      id="startDateID"
                      name="startDate"
                      input
                      dateFormat
                      initialValue={
                        startDateValue
                          ? startDateValue
                          : moment().format('DD MMMM YYYY')
                      }
                      timeFormat={false}
                      value={startDateValue}
                      placeholder={<IntlMessages id="custom campaign date" />}
                      onChange={(e) => {
                        const data = moment(e).format('DD MMMM YYYY');
                        setStartDateValue(data);
                        handleStartDateOnChange(data, setFieldValue);
                      }}
                    />
                  </FormGroup>
                  <FormGroup className="has-float-label">
                    <Label htmlFor="attribute">
                      <IntlMessages id="DASHBOARD.CAMPAIGN.BUTTONS.CUSTOM_END_DATE" />
                    </Label>
                    <Datetime
                      className="send-date"
                      id="endDateID"
                      name="endDate"
                      input
                      dateFormat
                      initialValue={
                        endDateValue
                          ? endDateValue
                          : moment().format('DD MMMM YYYY')
                      }
                      timeFormat={false}
                      value={endDateValue}
                      placeholder={<IntlMessages id="custom campaign date" />}
                      onChange={(e) => {
                        const data = moment(e).format('DD MMMM YYYY');
                        setEndDateValue(data);
                        handleEndDateOnChange(data, setFieldValue);
                      }}
                    />
                    {errors?.endDateID && (
                      <div className="invalid-feedback d-block w-30">
                        <span>
                          <IntlMessages id={errors?.endDateID} />
                        </span>
                      </div>
                    )}
                  </FormGroup>
                  <FormGroup className="has-float-label">
                    <Label htmlFor="attribute">
                      <IntlMessages id="DASHBOARD.CAMPAIGN.BUTTONS.FORMAT" />
                    </Label>
                    <Select
                      placeholder={
                        messages['DASHBOARD.CAMPAIGN.BUTTONS.FORMAT_TYPE']
                      }
                      onChange={(event) => setFieldValue('attribute', event)}
                      options={getDataTypeOptions()}
                      errors={errors}
                      touched={touched}
                      isMulti={false}
                    />
                    {errors?.attribute && (
                      <div className="invalid-feedback d-block w-30">
                        <span>
                          <IntlMessages id={errors?.attribute} />
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
                      <IntlMessages id="DASHBOARD.CAMPAIGN.BUTTONS.DOWNLOAD" />
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
  const {
    dashboardCampaignList,
    loadedDashboardCampaignList,
    exportSuccess,
    currentPage,
    campaignStatus,
    campaignTypes,
    channelType,
    campaignName,
    startDate,
    endDate,
    filters,
  } = dashboardCampaignsApp;
  return {
    dashboardCampaignList,
    loadedDashboardCampaignList,
    exportSuccess,
    currentPage,
    campaignStatus,
    campaignTypes,
    channelType,
    campaignName,
    startDate,
    endDate,
    filters,
  };
};
export default connect(mapStateToProps, {
  getCampaignsDetailsExportDownloadAction: getCampaignsDetailsExportDownload,
  getCampaignsDetailsExportDownloadResetAction:
    getCampaignsDetailsExportDownloadReset,
})(injectIntl(ListDashboardCampaignsExportUserPopOver));
