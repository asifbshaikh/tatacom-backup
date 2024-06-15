import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import IntlMessages from 'helpers/IntlMessages';
import React, { useEffect, useState } from 'react';
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
import { connect } from 'react-redux';
import {
  createCustomEvent,
  getuserEventsList,
} from 'redux/segmentation/actions';
import { NotificationManager } from 'components/common/react-notifications';
import SegmentationEnums from 'enums/segmentation/segmentationEnums';
import createSegementEnums from 'enums/createSegment/createSegementEnums';

const CreateEventPopOver = ({
  showCreateEvent,
  setShowCreateEvent,
  intl,
  loading,
  createCustomEventAction,
  formError,
  formSuccess,
  getUserEventsDropDownList,
}) => {
  const inputToggle = () => setShowCreateEvent(!showCreateEvent);
  const [customEventAlert, setCustomEventAlert] = useState(false);
  const { messages } = intl;
  const closeBtnForCustomSegment = (
    <button className="close" onClick={inputToggle} type="button">
      &times;
    </button>
  );
  const user = getCurrentUser();

  const initialValues = {
    eventName: '',
    description: '',
    propertyName: '',
    propertyType: [],
  };
  const getFieldRequiredMessage = (message) => {
    return <IntlMessages id={message} />;
  };
  const createEventSchema = Yup.object().shape({
    eventName: Yup.string().required(
      getFieldRequiredMessage('forms.required-message')
    ),
    description: Yup.string().required(
      getFieldRequiredMessage('forms.required-message')
    ),
    propertyName: Yup.string().required(
      getFieldRequiredMessage('forms.required-message')
    ),
    propertyType: Yup.object().required(
      getFieldRequiredMessage('forms.required-message')
    ),
  });

  const onCreateEvent = (values) => {
    const payload = {
      custom_event: {
        name: values.eventName,
        displayed_name: values.eventName,
        description: values.description,
        property_name: values.propertyName,
        data_type: values.propertyType.value,
        account_id: user.account_id,
        source: [SegmentationEnums.INTERNAL],
      },
    };
    createCustomEventAction(payload);
    setCustomEventAlert(true);
    return true;
  };

  useEffect(() => {
    if (customEventAlert) {
      if (formSuccess) {
        inputToggle();
        NotificationManager.success(
          <IntlMessages id="CREATE_SEGMENT.CREATE_EVENT.SAVED_MESSAGE" />,
          'Success',
          6000,
          null,
          null,
          ''
        );
        getUserEventsDropDownList();
      }
    }
  }, [formSuccess, customEventAlert]);

  if (formError.errorMsg) {
    NotificationManager.error(
      formError.errorMsg,
      'Error',
      6000,
      null,
      null,
      ''
    );
  }

  const getPropertyType = [
    {
      label: (
        <IntlMessages id="CREATE_SEGMENT.CREATE_EVENT.DATA_TYPE.BOOLEAN" />
      ),
      value: createSegementEnums.DATA_TYPE.BOOLEAN,
    },
    {
      label: <IntlMessages id="CREATE_SEGMENT.CREATE_EVENT.DATA_TYPE.STRING" />,
      value: createSegementEnums.DATA_TYPE.STRING,
    },
    {
      label: <IntlMessages id="CREATE_SEGMENT.CREATE_EVENT.DATA_TYPE.DATE" />,
      value: createSegementEnums.DATA_TYPE.DATE,
    },
    {
      label: <IntlMessages id="CREATE_SEGMENT.CREATE_EVENT.DATA_TYPE.NUMBER" />,
      value: createSegementEnums.DATA_TYPE.NUMBER,
    },
  ];

  return (
    <div>
      <Modal isOpen={showCreateEvent} toggle={inputToggle}>
        <ModalHeader toggle={inputToggle} close={closeBtnForCustomSegment}>
          <IntlMessages id="CREATE_SEGMENT.CREATE_EVENT.HEADING" />
        </ModalHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={createEventSchema}
          onSubmit={onCreateEvent}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <ModalBody>
                <FormGroupCoustom
                  identifier="eventName"
                  identifierLabel="CREATE_SEGMENT.CREATE_EVENT.EVENT_NAME"
                  placeholder="CREATE_SEGMENT.CREATE_EVENT.PLACEHOLDER.EVENT_NAME_PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                  required={true}
                />
                <FormGroupCoustom
                  identifier="description"
                  type="textarea"
                  identifierLabel="CREATE_SEGMENT.CREATE_EVENT.DESCRIPTION_BOX"
                  placeholder="CREATE_SEGMENT.CREATE_EVENT.PLACEHOLDER.DESCRIPTION_BOX_PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                  required={true}
                />
                <div className="mb-2">
                  <IntlMessages id="CREATE_SEGMENT.CREATE_EVENT.EVENT_PROPERTIES" />
                </div>
                <FormGroupCoustom
                  identifier="propertyName"
                  identifierLabel="CREATE_SEGMENT.CREATE_EVENT.PROPERTY_NAME"
                  placeholder="CREATE_SEGMENT.CREATE_EVENT.PLACEHOLDER.PROPERTY_NAME_PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                  required={true}
                />
                <FormGroup className="has-float-label">
                  <Label htmlFor="propertyType">
                    <IntlMessages id="CREATE_SEGMENT.CREATE_EVENT.TYPE" />
                    <span className="required-star-mark">{`*`}</span>
                  </Label>
                  <Select
                    aria-label="selectType"
                    placeholder={
                      messages[
                        'CREATE_SEGMENT.CREATE_EVENT.PLACEHOLDER.SELECT_TYPE'
                      ]
                    }
                    onChange={(event) => setFieldValue('propertyType', event)}
                    options={getPropertyType}
                    errors={errors}
                    touched={touched}
                  />
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  onClick={() => {
                    inputToggle();
                  }}
                >
                  <IntlMessages id="CREATE_SEGMENT.CREATE_EVENT.BUTTON.CANCEL" />
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
                    <IntlMessages id="CREATE_SEGMENT.CREATE_EVENT.BUTTON.SUBMIT" />
                  </span>
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

const mapStateToProps = ({ segmentationApp }) => {
  const { successAddPopOver, errorAdd } = segmentationApp;
  return { formSuccess: successAddPopOver, formError: errorAdd };
};

export default connect(mapStateToProps, {
  getUserEventsDropDownList: getuserEventsList,
  createCustomEventAction: createCustomEvent,
})(injectIntl(CreateEventPopOver));
