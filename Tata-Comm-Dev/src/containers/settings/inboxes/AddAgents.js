import React from 'react';
import { Formik, Form } from 'formik';
import { FormGroup, Button, Alert } from 'reactstrap';
import Select from 'react-select';
import { injectIntl } from 'react-intl';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';
import { NotificationManager } from 'components/common/react-notifications';
import {
  getAgents,
  addAgentsChannel,
  addAgentsChannelClean,
} from 'redux/actions';

const AddAgents = ({
  formRef,
  fields,
  next,
  agents,
  loadedAgents,
  formSuccess,
  formError,
  formLoading,
  getAgentsAction,
  addAgentsChannelAction,
  addAgentsChannelCleanAction,
}) => {
  const initialValues = {
    inboxId: fields.inbox_id,
    selectedAgents: [],
  };
  if (!loadedAgents) {
    getAgentsAction();
  }

  const onSubmitForm = (values) => {
    if (formLoading) {
      return false;
    }
    addAgentsChannelAction(values);
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
    addAgentsChannelCleanAction({});
    next();
  }

  return (
    <div className="wizard-basic-step">
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={onSubmitForm}
      >
        {({ setFieldValue, setFieldTouched, values, errors, touched }) => (
          <Form className="av-tooltip tooltip-label-right">
            <FormGroup className="error-l-100">
              <Select
                className="react-select"
                classNamePrefix="react-select"
                options={agents.map((val) => {
                  return { value: val.id, label: val.name };
                })}
                isMulti
                onBlur={setFieldTouched}
                value={values.selectedAgents}
                onChange={(val) => {
                  setFieldValue('selectedAgents', val);
                }}
              />
              {formError && formError.errorMsg && (
                <Alert color="danger" className="rounded">
                  {formError.errorMsg}
                </Alert>
              )}
              {errors.selectedAgents && touched.selectedAgents ? (
                <div className="invalid-feedback d-block">
                  {errors.selectedAgents}
                </div>
              ) : null}
              <Button color="primary mt-2">
                <IntlMessages id="pages.submit" />
              </Button>
            </FormGroup>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const mapStateToProps = ({ channelsApp, agentsApp }) => {
  const { successAddAgents, errorAddAgents, loadingAddAgents } = channelsApp;
  const { loadedAgents, agents } = agentsApp;
  return {
    formSuccess: successAddAgents,
    formError: errorAddAgents,
    formLoading: loadingAddAgents,
    loadedAgents,
    agents,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    getAgentsAction: getAgents,
    addAgentsChannelAction: addAgentsChannel,
    addAgentsChannelCleanAction: addAgentsChannelClean,
  })(AddAgents)
);
