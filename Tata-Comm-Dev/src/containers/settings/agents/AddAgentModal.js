/* eslint-disable no-param-reassign */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/no-this-in-sfc */

import React from 'react';
import {
  // CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  // Input,
  // Label,
  // Form,
  Alert,
} from 'reactstrap';

import {
  Formik,
  Form,
  // Field
} from 'formik';
// import Select from 'react-select';
// import CustomSelectInput from 'components/common/CustomSelectInput';
import IntlMessages from 'helpers/IntlMessages';

// import { loginUser } from 'redux/actions';
import { addAgent, addAgentClean } from 'redux/actions';
import { connect } from 'react-redux';

import * as Yup from 'yup';

import { NotificationManager } from 'components/common/react-notifications';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { onChangeDefault } from 'helpers/TringReactHelper';

const AddAgentModal = ({
  modalOpen,
  toggleModal,
  formSuccess,
  formError,
  formLoading,
  editFormData,
  addAgentAction,
  addAgentCleanAction,
}) => {
  const closeForm = () => {
    if (modalOpen) {
      toggleModal();
      addAgentCleanAction({});
    }
  };

  const onAddItem = (values) => {
    if (formLoading) {
      return false;
    }
    const newParams = {
      name: values.agentName,
      role: values.agentType,
    };
    if (values.id) {
      newParams.id = values.id;
    } else {
      newParams.email = values.agentEmail; // not editable
    }
    addAgentAction(newParams);
    return false;
  };
  if (modalOpen) {
    if (formSuccess) {
      const successMsg = editFormData.id
        ? 'AGENT_MGMT.EDIT.API.SUCCESS_MESSAGE'
        : 'AGENT_MGMT.ADD.API.SUCCESS_MESSAGE';
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
    agentEmail: '',
    agentName: editFormData.name || '',
    agentType: editFormData.role || 'agent',
  };

  const SignupSchema = Yup.object().shape({
    agentName: Yup.string()
      .min(1, 'Must be min 1 digits')
      .required('This field is required!'),
    agentEmail: Yup.string().when('id', (id) => {
      if (!id) {
        return Yup.string()
          .email('Invalid email!')
          .required('This field is required!');
      }
      return Yup.string().nullable();
    }),
    agentType: Yup.string().required('This field is required!'),
  });
  const resetPassword = () => {
    // const agentCredentials = { email: editFormData.email };
    alert('TODO...');
    // /auth/password POST
    // Post: {"email":"shailendra.kumar@tatacommunications.com"}
    // {"message":"Woot! Request for password reset is successful. Check your mail for instructions."}
    // try {
    //   await Auth.resetPassword(this.agentCredentials);
    //   this.showAlert(
    //     this.$t('AGENT_MGMT.EDIT.PASSWORD_RESET.ADMIN_SUCCESS_MESSAGE')
    //   );
    // } catch (error) {
    //   this.showAlert(this.$t('AGENT_MGMT.EDIT.PASSWORD_RESET.ERROR_MESSAGE'));
    // }
    return false;
  };

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
              ? 'AGENT_MGMT.ADD.TITLE'
              : 'AGENT_MGMT.EDIT.TITLE'
          }
        />
        {editFormData.name ? ` - ${editFormData.name}` : ''}
      </ModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
        onSubmit={onAddItem}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form>
            <ModalBody>
              {typeof editFormData.id === 'undefined' && (
                <p>
                  <IntlMessages id="AGENT_MGMT.ADD.DESC" />
                </p>
              )}
              <FormGroupCoustom
                identifier="agentName"
                identifierLabel="AGENT_MGMT.ADD.FORM.NAME.LABEL"
                placeholder="AGENT_MGMT.ADD.FORM.NAME.PLACEHOLDER"
                errors={errors}
                touched={touched}
                required={true}
              />
              <FormGroupCoustom
                identifier="agentType"
                errors={errors}
                touched={touched}
                identifierLabel="AGENT_MGMT.ADD.FORM.AGENT_TYPE.LABEL"
                type="select"
                options={[
                  {
                    id: 'administrator',
                    value: 'AGENT_MGMT.AGENT_TYPES.ADMINISTRATOR',
                  },
                  {
                    id: 'agent',
                    value: 'AGENT_MGMT.AGENT_TYPES.AGENT',
                  },
                ]}
                value={values.agentType}
                onChange={(event) =>
                  onChangeDefault(event, 'agentType', setFieldValue)
                }
                required={true}
              />
              {typeof editFormData.id === 'undefined' && (
                <FormGroupCoustom
                  identifier="agentEmail"
                  identifierLabel="AGENT_MGMT.ADD.FORM.EMAIL.LABEL"
                  placeholder="AGENT_MGMT.ADD.FORM.EMAIL.PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                  required={true}
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
                <IntlMessages id="AGENT_MGMT.ADD.CANCEL_BUTTON_TEXT" />
              </Button>
              <Button color="primary">
                <IntlMessages
                  id={
                    typeof editFormData.id === 'undefined'
                      ? 'AGENT_MGMT.ADD.FORM.SUBMIT'
                      : 'AGENT_MGMT.EDIT.FORM.SUBMIT'
                  }
                />
              </Button>{' '}
              {editFormData.id && (
                <Button color="warning" onClick={resetPassword}>
                  <IntlMessages id="AGENT_MGMT.EDIT.PASSWORD_RESET.ADMIN_RESET_BUTTON" />
                </Button>
              )}{' '}
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const mapStateToProps = ({ agentsApp }) => {
  const { successAdd, errorAdd, loadingAdd } = agentsApp;
  return {
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
  };
};
export default connect(mapStateToProps, {
  addAgentAction: addAgent,
  addAgentCleanAction: addAgentClean,
})(AddAgentModal);
