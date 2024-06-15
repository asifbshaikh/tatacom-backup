/* eslint-disable no-param-reassign */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React, { useState, useEffect } from 'react';
import {
  // CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  // Input,
  // Label,
  // Form,.
  Alert,
  FormGroup,
} from 'reactstrap';
import Select from 'react-select';

import {
  Formik,
  Form,
  // Field
} from 'formik';
// import CustomSelectInput from 'components/common/CustomSelectInput';
import IntlMessages from 'helpers/IntlMessages';

// import { loginUser } from 'redux/actions';
import {
  addCampaign,
  addCampaignClean,
  getInbox,
  getLabels,
  getChannelAgents,
} from 'redux/actions';
import { connect } from 'react-redux';

import * as Yup from 'yup';

import { NotificationManager } from 'components/common/react-notifications';
import FormGroupCoustom from 'components/common/FormGroupCoustom';

import {
  onChangeDefault,
  // convertToSlug,
} from 'helpers/TringReactHelper';
import { getSMSInboxes, getWebsiteInboxes } from 'helpers/TringIconHelper';

// import DatePicker from 'react-datepicker';

const AddCampaignModal = ({
  modalOpen,
  toggleModal,
  isOngoingType,
  inboxes,
  labels,
  channelAgents,
  formSuccess,
  formError,
  formLoading,
  editFormData,
  addCampaignAction,
  addCampaignCleanAction,
  getInboxAction,
  getLabelsAction,
  getChannelAgentsAction,
}) => {
  const [selectedSender, setSelectedSender] = useState(0);
  useEffect(() => {
    getInboxAction();
    getLabelsAction();
  }, []);
  if (
    editFormData.inbox &&
    editFormData.inbox.id &&
    (!channelAgents || !channelAgents.length)
  ) {
    // for the edit case, load agents first time load
    if (isOngoingType()) {
      getChannelAgentsAction(editFormData.inbox.id);
      if (editFormData.sender && editFormData.sender.id) {
        setTimeout(() => {
          setSelectedSender(editFormData.sender.id);
        }, 2000);
      }
    }
  }
  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      addCampaignCleanAction({});
    }
  };

  const onAddItem = (values) => {
    if (formLoading) {
      return false;
    }
    const newParams = {
      title: values.title,
      message: values.message,
      inbox_id: values.selectedInbox,
    };
    if (values.id) {
      newParams.id = values.id;
    } else {
      // only for add case, not for edit
      // newParams.campaign_model = parseInt(values.campaignModel, 10);
      // newParams.campaign_display_type = parseInt(values.campaignType, 10);
      // newParams.campaign_key = values.campaignKey;
    }
    if (isOngoingType()) {
      newParams.sender_id = values.selectedSender || null;
      newParams.enabled = values.enabled;
      newParams.trigger_only_during_business_hours =
        values.triggerOnlyDuringBusinessHours;
      newParams.trigger_rules = {
        url: values.endPoint,
        time_on_page: values.timeOnPage,
      };
    } else {
      const audience = values.selectedAudience.map((item) => {
        return {
          id: item.value,
          type: 'Label',
        };
      });
      newParams.scheduled_at = values.scheduledAt;
      newParams.audience = audience;
    }
    const resp = addCampaignAction(newParams);
    return false;
  };
  if (modalOpen) {
    if (formSuccess) {
      const successMsg = editFormData.id
        ? 'CAMPAIGN.EDIT.API.SUCCESS_MESSAGE'
        : 'CAMPAIGN.ADD.API.SUCCESS_MESSAGE';
      closeForm();
      NotificationManager.success(
        <IntlMessages id={successMsg} />,
        'Success',
        6000,
        null,
        null,
        '' // className
      );
    }
  }
  const initialValues = {
    id: editFormData.id,
    title: editFormData.title || '',
    message: editFormData.message || '',
    selectedSender: selectedSender,
    enabled:
      typeof editFormData.enabled !== 'undefined' ? editFormData.enabled : true,
    triggerOnlyDuringBusinessHours:
      typeof editFormData.trigger_only_during_business_hours !== 'undefined'
        ? editFormData.trigger_only_during_business_hours
        : false,
    selectedInbox: (editFormData.inbox && editFormData.inbox.id) || null,
    endPoint:
      (editFormData.trigger_rules && editFormData.trigger_rules.url) || '',
    timeOnPage:
      (editFormData.trigger_rules && editFormData.trigger_rules.time_on_page) ||
      10,
    // 'selectedLabels': editFormData.selectedLabels || [],
    scheduledAt: editFormData.scheduledAt || null,
    selectedAudience: editFormData.selectedAudience || [],
    senderList: editFormData.senderList || [],
  };

  let SignupSchemaObject = {
    title: Yup.string().required('This field is required!'),
    message: Yup.string().required('This field is required!'),
    selectedInbox: Yup.string().required('This field is required!'),
  };
  if (isOngoingType()) {
    SignupSchemaObject = {
      ...SignupSchemaObject,
      selectedSender: Yup.string().required('This field is required!'),
      endPoint: Yup.string()
        .min(7, 'Must be min 7 digits')
        .required('This field is required!'), // url
      timeOnPage: Yup.string().required('This field is required!'),
    };
  } else {
    SignupSchemaObject = {
      ...SignupSchemaObject,
      selectedAudience: Yup.array()
        .min(1, 'at least 1')
        .required('This field is required!'),
    };
  }
  const SignupSchema = Yup.object().shape(SignupSchemaObject);
  const sendersAndBotList = [
    {
      id: 0,
      name: 'Bot',
    },
    ...channelAgents,
  ];
  let myInboxes = [];
  if (isOngoingType()) {
    myInboxes = getWebsiteInboxes(inboxes);
  } else {
    myInboxes = getSMSInboxes(inboxes);
  }

  return (
    <Modal
      isOpen={modalOpen}
      toggle={closeForm}
      // wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={closeForm}>
        <IntlMessages
          id={
            typeof editFormData.id === 'undefined'
              ? 'CAMPAIGN.ADD.TITLE'
              : 'CAMPAIGN.EDIT.TITLE'
          }
        />
        {editFormData.name ? ` - ${editFormData.name}` : ''}
      </ModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
        onSubmit={onAddItem}
        enableReinitialize
      >
        {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
          <Form>
            <ModalBody>
              {typeof editFormData.id === 'undefined' && (
                <p>
                  <IntlMessages id="CAMPAIGN.ADD.DESC" />
                </p>
              )}
              <FormGroupCoustom
                identifier="title"
                identifierLabel="CAMPAIGN.ADD.FORM.TITLE.LABEL"
                placeholder="CAMPAIGN.ADD.FORM.TITLE.PLACEHOLDER"
                errors={errors}
                touched={touched}
                required={true}
              />
              <FormGroupCoustom
                identifier="message"
                identifierLabel="CAMPAIGN.ADD.FORM.MESSAGE.LABEL"
                placeholder="CAMPAIGN.ADD.FORM.MESSAGE.PLACEHOLDER"
                errors={errors}
                touched={touched}
                type="textarea"
                required={true}
              />
              <FormGroupCoustom
                identifier="selectedInbox"
                errors={errors}
                touched={touched}
                identifierLabel="CAMPAIGN.ADD.FORM.INBOX.LABEL"
                type="select"
                options={myInboxes.map((inbox) => {
                  return { id: inbox.id, value: inbox.name };
                })}
                value={values.selectedInbox}
                onChange={(event) => {
                  onChangeDefault(event, 'selectedInbox', setFieldValue);
                  if (isOngoingType()) {
                    getChannelAgentsAction(event.target.value);
                  }
                }}
                required={true}
              />
              {!isOngoingType() && (
                <FormGroup className="error-l-100">
                  <label>
                    <IntlMessages id="CAMPAIGN.ADD.FORM.AUDIENCE.LABEL" />
                    <span className="required-star-mark">{`*`}</span>
                  </label>
                  <Select
                    className="react-select"
                    classNamePrefix="react-select"
                    options={labels.map((val) => {
                      return { value: val.id, label: val.title };
                    })}
                    isMulti
                    onBlur={setFieldTouched}
                    value={values.selectedAudience}
                    onChange={(val, name) => {
                      setFieldValue('selectedAudience', val);
                    }}
                  />
                </FormGroup>
              )}
              {isOngoingType() && (
                <FormGroupCoustom
                  identifier="selectedSender"
                  errors={errors}
                  touched={touched}
                  identifierLabel="CAMPAIGN.ADD.FORM.SENT_BY.LABEL"
                  type="select"
                  options={sendersAndBotList.map((inbox) => {
                    return { id: inbox.id, value: inbox.name };
                  })}
                  value={values.selectedSender}
                  onChange={(event) =>
                    onChangeDefault(event, 'selectedSender', setFieldValue)
                  }
                  required={true}
                />
              )}
              {!isOngoingType() && (
                <FormGroupCoustom
                  identifier="scheduledAt"
                  identifierLabel="CAMPAIGN.ADD.FORM.SCHEDULED_AT.LABEL"
                  placeholder="CAMPAIGN.ADD.FORM.SCHEDULED_AT.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                  type="text"
                  required={true}
                />
              )}

              {/* <DatePicker
                                selected={startDateTime}
                                onChange={setStartDateTime}
                                placeholderText={messages['forms.date']}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="LLL"
                                timeCaption="Time"
                            /> */}
              {isOngoingType() && (
                <FormGroupCoustom
                  identifier="endPoint"
                  identifierLabel="CAMPAIGN.ADD.FORM.END_POINT.LABEL"
                  placeholder="CAMPAIGN.ADD.FORM.END_POINT.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                  required={true}
                />
              )}
              {isOngoingType() && (
                <FormGroupCoustom
                  identifier="timeOnPage"
                  identifierLabel="CAMPAIGN.ADD.FORM.TIME_ON_PAGE.LABEL"
                  placeholder="CAMPAIGN.ADD.FORM.TIME_ON_PAGE.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                  required={true}
                />
              )}
              {isOngoingType() && (
                <FormGroupCoustom
                  identifier="enabled"
                  errors={errors}
                  touched={touched}
                  type="checkboxMulti"
                  noLable
                  radioMultiOptions={[
                    {
                      id: 'e_enabled',
                      value: 'enabled',
                      label: 'CAMPAIGN.ADD.FORM.ENABLED',
                    },
                  ]}
                  onChange={(event) => {
                    setFieldValue('enabled', event.target.checked, false);
                  }}
                  value={values.enabled ? ['enabled'] : []}
                />
              )}
              {isOngoingType() && (
                <FormGroupCoustom
                  identifier="triggerOnlyDuringBusinessHours"
                  errors={errors}
                  touched={touched}
                  type="checkboxMulti"
                  noLable
                  radioMultiOptions={[
                    {
                      id: 'todbh_enabled',
                      value: 'enabled',
                      label: 'CAMPAIGN.ADD.FORM.TRIGGER_ONLY_BUSINESS_HOURS',
                    },
                  ]}
                  onChange={(event) => {
                    setFieldValue(
                      'triggerOnlyDuringBusinessHours',
                      event.target.checked,
                      false
                    );
                  }}
                  value={
                    values.triggerOnlyDuringBusinessHours ? ['enabled'] : []
                  }
                />
              )}
              {formError && formError.errorMsg && (
                <Alert color="danger" className="rounded">
                  {formError.errorMsg}
                </Alert>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={closeForm}>
                <IntlMessages id="CAMPAIGN.ADD.CANCEL_BUTTON_TEXT" />
              </Button>
              <Button color="primary">
                <IntlMessages
                  id={
                    typeof editFormData.id === 'undefined'
                      ? 'CAMPAIGN.ADD.CREATE_BUTTON_TEXT'
                      : 'CAMPAIGN.EDIT.UPDATE_BUTTON_TEXT'
                  }
                />
              </Button>{' '}
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = ({
  campaignsApp,
  inboxApp,
  labelsApp,
  channelsApp,
}) => {
  const { successAdd, errorAdd, loadingAdd } = campaignsApp;
  const { inboxes } = inboxApp;
  const { labels } = labelsApp;
  const { channelAgents } = channelsApp;
  return {
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
    inboxes,
    labels,
    channelAgents,
  };
};
export default connect(mapStateToProps, {
  addCampaignAction: addCampaign,
  addCampaignCleanAction: addCampaignClean,
  getInboxAction: getInbox,
  getLabelsAction: getLabels,
  getChannelAgentsAction: getChannelAgents,
})(AddCampaignModal);
