import React from 'react';

import FormGroupCoustom from 'components/common/FormGroupCoustom';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';

import { Formik, Form } from 'formik';
import { Row, Button, Alert, Label, FormGroup } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import {
  timeSlotParse,
  timeSlotTransform,
  defaultTimeSlot,
} from 'helpers/businessHour';
import * as Yup from 'yup';
import { NotificationManager } from 'components/common/react-notifications';
import TimezoneSelect, { allTimezones } from 'react-timezone-select';
import BusinessDay from './BusinessDay';
import { updateInbox, updateInboxClean } from 'redux/channels/actions';
import { conversationLabelCustomStyle } from 'helpers/ConversationFiltersHelper';
import CommonEnums from 'enums/commonEnums';

const Website = ({
  formSuccess,
  formError,
  formLoading,
  editFormData,
  updateInboxAction,
  updateInboxCleanAction,
}) => {
  const onSubmitForm = (values) => {
    if (formLoading) {
      return false;
    }
    const newParams = {
      id: values.currentInboxId,
      formData: false,
      working_hours_enabled: values.isBusinessHoursEnabled,
      out_of_office_message: values.unavailableMessage,
      working_hours: timeSlotTransform(values.timeSlots),
      timezone: values.timeZone,
      channel: {},
    };
    updateInboxAction(newParams);
    return false;
  };
  if (formSuccess) {
    NotificationManager.success(
      <IntlMessages id="CREATE_INBOX.LABEL.SUCCESS_MESSAGE" />,
      'Success',
      6000,
      null,
      null,
      ''
    );
    updateInboxCleanAction({});
  }
  const unavailableMessage =
    'We are unavailable at the moment. Leave a message we will respond once we are back.';
  const initialValues = {
    currentInboxId: editFormData.id,
    isBusinessHoursEnabled: editFormData.working_hours_enabled,
    unavailableMessage:
      editFormData.out_of_office_message || unavailableMessage,
    timeZone: editFormData.timezone,
  };

  let timezoneFound = false;
  if (editFormData?.timezone === CommonEnums.UTC) {
    timezoneFound = false;
  } else {
    timezoneFound = true;
  }
  if (!timezoneFound) {
    initialValues.timeZone = 'Etc/GMT';
  }
  initialValues.timeSlots = editFormData.working_hours || [];
  const slots = timeSlotParse(initialValues.timeSlots).length
    ? timeSlotParse(initialValues.timeSlots)
    : defaultTimeSlot;
  initialValues.timeSlots = slots;
  const dayNames = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };

  const SignupSchema = Yup.object().shape({
    timeSlots: Yup.array().of(
      Yup.object().shape({
        day: Yup.number(),
        to: Yup.string().test({
          name: 'dateCheck',
          test: function (value, schema) {
            const { valid, from } = schema.parent;
            if (!valid && !from && !value) {
              return true;
            } else {
              if (!valid && from && value) {
                return false;
              } else {
                return true;
              }
            }
          },
        }),
        from: Yup.string().when('valid', {
          is: true,
          then: Yup.string().required(),
          otherwise: Yup.string().notRequired(),
        }),
        valid: Yup.boolean(),
        openAllDay: Yup.boolean(),
      })
    ),
  });

  return (
    <>
      <Row>
        <Colxx xxs="3">
          <h3>
            <IntlMessages id="inboxes.business_hours_nav" />
          </h3>
          <p>
            <IntlMessages id="inboxes.business_hours_nav_help" />
          </p>
        </Colxx>
        <Colxx xxs="9">
          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={onSubmitForm}
            validationSchema={SignupSchema}
            validateOnBlur
            validateOnMount
            validateOnChange
          >
            {({ errors, touched, setFieldValue, values, isValid }) => (
              <Form className="av-tooltip tooltip-label-right">
                <Row>
                  <Colxx xxs="12">
                    <FormGroupCoustom
                      identifier="selectedFeatureFlags"
                      errors={errors}
                      touched={touched}
                      identifierLabel="inboxes.features"
                      type="checkboxMulti"
                      radioMultiOptions={[
                        {
                          id: 'bizz_enabled',
                          value: 'enabled',
                          label: 'inboxes.business_hours_toggle_availability',
                        },
                      ]}
                      onChange={(event) => {
                        setFieldValue(
                          'isBusinessHoursEnabled',
                          event.target.checked,
                          false
                        );
                      }}
                      value={values.isBusinessHoursEnabled ? ['enabled'] : []}
                    />
                    <p>
                      <IntlMessages id="inboxes.business_hours_toggle_help" />
                    </p>
                    {values.isBusinessHoursEnabled && (
                      <div>
                        <FormGroupCoustom
                          type="textarea"
                          identifier="unavailableMessage"
                          errors={errors}
                          value={values.unavailableMessage}
                          onChange={(event) =>
                            setFieldValue(
                              'unavailableMessage',
                              event.target.value
                            )
                          }
                          touched={touched}
                          identifierLabel="inboxes.unavailable_message_label"
                        />
                        <FormGroup className="has-float-label">
                          <Label htmlFor="timeZone">
                            <IntlMessages id="inboxes.business_hours_timezone_label" />
                          </Label>
                          <TimezoneSelect
                            value={values.timeZone}
                            onChange={(value) =>
                              setFieldValue('timeZone', value.value)
                            }
                            timezones={{ ...allTimezones }}
                            styles={conversationLabelCustomStyle}
                          />
                        </FormGroup>
                        <div className="mb-2">
                          <IntlMessages id="inboxes.business_hours_weekly_title" />
                        </div>
                        {values.timeSlots.map((timeSlot) => {
                          return (
                            <BusinessDay
                              key={timeSlot.day}
                              dayName={dayNames[timeSlot.day]}
                              timeSlot={values.timeSlots[timeSlot.day]}
                              update={(data) => {
                                const slotIndex = timeSlot.day;
                                const slotData = data;
                                setFieldValue(
                                  'timeSlots',
                                  values.timeSlots.map((item) =>
                                    item.day === slotIndex ? slotData : item
                                  )
                                );
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          );
                        })}
                      </div>
                    )}
                    {formError && formError.errorMsg && (
                      <Alert color="danger" className="rounded">
                        {formError.errorMsg}
                      </Alert>
                    )}
                    <Button color="primary" disabled={!isValid}>
                      <IntlMessages id="pages.update-business-hours" />
                    </Button>
                  </Colxx>
                </Row>
              </Form>
            )}
          </Formik>
        </Colxx>
      </Row>
    </>
  );
};

const mapStateToProps = ({ channelsApp }) => {
  const { successUpdate, errorUpdate, loadingUpdate } = channelsApp;
  return {
    formSuccess: successUpdate,
    formError: errorUpdate,
    formLoading: loadingUpdate,
  };
};
export default connect(mapStateToProps, {
  updateInboxAction: updateInbox,
  updateInboxCleanAction: updateInboxClean,
})(Website);
