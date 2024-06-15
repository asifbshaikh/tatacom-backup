import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import IntlMessages from 'helpers/IntlMessages';
import React, { useEffect, useState } from 'react';
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
import { Input } from 'reactstrap';
import { getDashboardData } from 'redux/actions';
import { connect } from 'react-redux';
import Datetime from 'react-datetime';
import moment from 'moment';
import DashboardEnums from 'enums/dashboard/dashboardEnums';
import { getCustomDateReportData } from 'redux/reports/actions';
import { endOfDay, getUnixTime, parse, startOfDay } from 'date-fns';
import reportsEnums from 'enums/reports/reportsEnums';

const CustomDateRangePopOver = ({
  selectOption,
  customDate,
  loading,
  setIsCustomDate,
  getDashboardDataAction,
  moduleName,
  getCustomDateReportDataAction,
  setCustomDateRange,
}) => {
  const inputToggle = () => setIsCustomDate(!customDate);
  const [selectedFrom, setSelectedFrom] = useState();
  const [selectedTo, setSelectedTo] = useState(null);
  const today = new Date();
  const convertDateToSlashFromat = (str) => {
    const date = new Date(str);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  };
  const convertDateToHyphenFormat = (str) => {
    const date = new Date(str);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const fromCustomDate = (date) => {
    const dateObject = parse(date, reportsEnums.DATE_FORMAT, new Date());
    return getUnixTime(startOfDay(dateObject));
  };
  const toCustomDate = (date) => {
    const dateObject = parse(date, reportsEnums.DATE_FORMAT, new Date());
    return getUnixTime(endOfDay(dateObject));
  };
  useEffect(() => {
    if (selectOption === DashboardEnums.CUSTOM_RANGE) {
      initialValues.endDateID = '';
    }
  }, []);
  const initialValues = {
    startDateID: '',
  };
  const customDateRangeUserSchema = Yup.object().shape({
    startDateID: Yup.string().required('DASHBOARD.FILTER.CUSTOM_START_DATE'),
    endDateID:
      selectOption === DashboardEnums.CUSTOM_RANGE &&
      Yup.string()
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
        .required('DASHBOARD.FILTER.CUSTOM_END_DATE'),
  });
  const handleDateChange = () => {
    inputToggle();
    if (moduleName === reportsEnums.REPORT) {
      getCustomDateReportDataAction({
        since: fromCustomDate(selectedFrom),
        until: toCustomDate(selectedTo),
      });
      setCustomDateRange([
        fromCustomDate(selectedFrom),
        toCustomDate(selectedTo),
      ]);
    } else {
      if (selectOption === DashboardEnums.SINCE) {
        getDashboardDataAction({
          startDate: convertDateToHyphenFormat(selectedFrom),
          endDate: convertDateToHyphenFormat(today),
        });
      } else {
        getDashboardDataAction({
          startDate: convertDateToHyphenFormat(selectedFrom),
          endDate: convertDateToHyphenFormat(selectedTo),
        });
      }
    }
  };
  const closeBtnForCustomSegment = (
    <button className="close" onClick={inputToggle} type="button">
      &times;
    </button>
  );
  return (
    <div>
      <Modal isOpen={setIsCustomDate} toggle={inputToggle}>
        <ModalHeader toggle={inputToggle} close={closeBtnForCustomSegment}>
          <IntlMessages id={selectOption} />
        </ModalHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={customDateRangeUserSchema}
          onSubmit={handleDateChange}
        >
          {({ errors, setFieldValue }) => {
            return (
              <Form>
                <ModalBody>
                  <FormGroup className="has-float-label">
                    <Label htmlFor="startDateID">
                      <IntlMessages id="DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.FROM" />
                    </Label>
                    <Datetime
                      id="startDateID"
                      value={selectedFrom}
                      timeFormat={false}
                      onChange={(date) => {
                        setSelectedFrom(convertDateToSlashFromat(date));
                        setFieldValue(
                          'startDateID',
                          convertDateToSlashFromat(date)
                        );
                      }}
                      isValidDate={(current) =>
                        current.isSameOrBefore(new Date())
                      }
                      closeOnSelect
                    />
                    {errors?.startDateID && (
                      <div className="invalid-feedback d-block w-30">
                        <span>
                          <IntlMessages id={errors?.startDateID} />
                        </span>
                      </div>
                    )}
                  </FormGroup>
                  <FormGroup className="has-float-label">
                    <Label htmlFor="endDateID">
                      <IntlMessages id="DASHBOARD.CAMPAIGN.VALUE.DATE_TYPE.TO" />
                    </Label>
                    {selectOption === DashboardEnums.SINCE ? (
                      <Input
                        id="toDatePicker"
                        value={convertDateToSlashFromat(new Date())}
                      />
                    ) : (
                      <Datetime
                        id="endDateID"
                        value={selectedTo}
                        timeFormat={false}
                        onChange={(date) => {
                          setSelectedTo(convertDateToSlashFromat(date));
                          setFieldValue(
                            'endDateID',
                            convertDateToSlashFromat(date)
                          );
                          if (moduleName === reportsEnums.REPORT) {
                            getCustomDateReportDataAction({
                              since: fromCustomDate(selectedFrom),
                              until: toCustomDate(selectedTo),
                            });
                          }
                        }}
                        isValidDate={(current) =>
                          current.isSameOrBefore(new Date())
                        }
                        closeOnSelect
                      />
                    )}
                    {errors?.endDateID && (
                      <div className="invalid-feedback d-block w-30">
                        <span>
                          <IntlMessages id={errors?.endDateID} />
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
                      <IntlMessages id="DASHBOARD.CAMPAIGN.BUTTONS.APPLY" />
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

const mapStateToProps = ({ dashboardCampaignsApp, reportsApp }) => {
  const {
    campaignStatus,
    selectChannel,
    selectDeliveryType,
    selectDateType,
    campaignTypes,
    channelType,
    campaignName,
    startDate,
    endDate,
  } = dashboardCampaignsApp;
  const { since, until } = reportsApp;
  return {
    campaignStatus,
    selectChannel,
    selectDeliveryType,
    selectDateType,
    campaignTypes,
    channelType,
    campaignName,
    startDate,
    endDate,
    since,
    until,
  };
};

export default connect(mapStateToProps, {
  getDashboardDataAction: getDashboardData,
  getCustomDateReportDataAction: getCustomDateReportData,
})(injectIntl(CustomDateRangePopOver));
