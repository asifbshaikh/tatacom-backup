import React, { useEffect } from 'react';

import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';

import {
  Formik,
  Form,
  // Field
} from 'formik';

import {
  // FormGroup,
  // Label,
  Row,
  Button,
  Alert,
  FormGroup,
  // Card, CardBody
} from 'reactstrap';

import Select from 'react-select';
import { Colxx } from 'components/common/CustomBootstrap';
// import { injectIntl } from 'react-intl';

import { NotificationManager } from 'components/common/react-notifications';

import {
  getChannelAgents,
  getAgents,
  addAgentsChannel,
  addAgentsChannelClean,
} from 'redux/actions';

const Website = ({
  inboxid,
  // fields,
  // formRef, next,
  // setFieldsCoustom,
  agents,
  loadedAgents,
  formSuccess,
  formError,
  formLoading,
  // addData,
  editFormData,
  // loadedChannelAgents,
  channelAgents,
  getChannelAgentsAction,
  getAgentsAction,
  addAgentsChannelAction,
  addAgentsChannelCleanAction,
}) => {
  useEffect(() => {
    if (!loadedAgents) {
      getAgentsAction();
    }
    getChannelAgentsAction(inboxid);
  }, []);
  const onSubmitForm = (values) => {
    if (formLoading) {
      return false;
    }
    addAgentsChannelAction(values);
    return false;
  };
  if (formSuccess) {
    NotificationManager.success(
      'Saved successfully',
      'Success',
      6000,
      null,
      null,
      '' // className
    );
    addAgentsChannelCleanAction({});
  }
  const filterFunc = (val) => {
    return { value: val.id, label: val.name };
  };
  const initialValues = {
    inboxId: editFormData.id,
    selectedAgents: channelAgents ? channelAgents.map(filterFunc) : [],
  };
  return (
    <>
      <Row>
        <Colxx xxs="3">
          <h3>
            <IntlMessages id="inboxes.edit_agents_nav" />
          </h3>
          <p>
            <IntlMessages id="inboxes.edit_agents_nav_help" />
          </p>
        </Colxx>
        <Colxx xxs="9">
          {/* <Formik initialValues={initialValues} validationSchema={SignupSchema} enableReinitialize onSubmit={onsendConversation}> */}

          <Formik
            // innerRef={formRef}
            initialValues={initialValues}
            // validationSchema={SignupSchema}
            validateOnMount
            enableReinitialize
            onSubmit={onSubmitForm}
          >
            {({ errors, touched, setFieldValue, values, setFieldTouched }) => (
              <Form className="av-tooltip tooltip-label-right">
                <Row>
                  <Colxx xxs="12">
                    {/* <h5 className="mb-4">
                                            <IntlMessages id="inboxes.website.title" />
                                        </h5>
                                        <p><IntlMessages id="inboxes.website.desc" /></p> */}
                    <FormGroup className="error-l-100">
                      <Select
                        className="react-select"
                        classNamePrefix="react-select"
                        options={agents.map(filterFunc)}
                        isMulti
                        // onChange={(val, actionNameOptions) => {
                        //     handleChange(val)
                        //     onChangeLabel(val)
                        // }}
                        onBlur={setFieldTouched}
                        value={values.selectedAgents}
                        // onChange={setFieldValue}
                        onChange={(val) => {
                          setFieldValue('selectedAgents', val);
                          // onChangeLabel(val)
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
                    </FormGroup>
                    {formError && formError.errorMsg && (
                      <Alert color="danger" className="rounded">
                        {formError.errorMsg}
                      </Alert>
                    )}
                    <Button color="primary">
                      <IntlMessages id="pages.update" />
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

// export default Website;

const mapStateToProps = ({ channelsApp, agentsApp }) => {
  const {
    successAddAgents,
    errorAddAgents,
    loadingAddAgents,
    loadedChannelAgents,
    channelAgents,
  } = channelsApp;

  const { loadedAgents, agents } = agentsApp;
  return {
    formSuccess: successAddAgents,
    formError: errorAddAgents,
    formLoading: loadingAddAgents,
    loadedAgents,
    agents,
    loadedChannelAgents,
    channelAgents,
  };
};
export default connect(mapStateToProps, {
  getAgentsAction: getAgents,
  addAgentsChannelAction: addAgentsChannel,
  addAgentsChannelCleanAction: addAgentsChannelClean,
  getChannelAgentsAction: getChannelAgents,
})(Website);
