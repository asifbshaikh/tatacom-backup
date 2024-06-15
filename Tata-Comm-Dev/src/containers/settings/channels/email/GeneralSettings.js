/* eslint-disable react/no-array-index-key */
import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { Formik, FieldArray } from 'formik';
import { connect } from 'react-redux';
import {
  getColumnAttributeList,
  cleanGetSettingsList,
  addEmailGeneralSettings,
  addEmailGeneralSettingsClean,
  getEmailGeneralSettingsList,
  getEmailConnectorList,
} from 'redux/actions';
import IntlMessages from 'helpers/IntlMessages';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Form, Row } from 'reactstrap';
import * as Yup from 'yup';
import CommonEnums from 'enums/commonEnums';
import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';
import { NotificationManager } from 'components/common/react-notifications';

const GeneralSettings = ({
  allConnectorList,
  getConnectorList,
  getColumnAttributeListAction,
  colAttributesList,
  getSettingsList,
  settingsList,
  formSuccess,
  formError,
  formLoading,
  addSettingsAction,
  addSettingsCleanAction,
  cleanSettingsListAction,
}) => {
  const initialValues = {
    currentConnector: '',
    usrAttrShowsEmailAddress: '',
    fromEmailAddress: [''],
  };

  const formRef = useRef();
  const [isSettingsEdit, setIsSettingsEdit] = useState(false);
  const getValidationMessage = (text) => {
    return <IntlMessages id={text} />;
  };
  const EmailGeneralSettingsSchema = Yup.object().shape({
    currentConnector: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
    usrAttrShowsEmailAddress: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
    fromEmailAddress: Yup.array().of(
      Yup.string()
        .email()
        .required(getValidationMessage('forms.required-message'))
    ),
  });

  useEffect(() => {
    getConnectorList(CommonEnums.EMAIL);
    if (colAttributesList.length === 0) {
      getColumnAttributeListAction();
    }
    return () => {
      cleanSettingsListAction();
    };
  }, []);

  let connectorListData = [];

  if (allConnectorList && allConnectorList.length > 0) {
    connectorListData = allConnectorList.map((item) => {
      return {
        id: item.channel_id,
        value: item.channel_name,
      };
    });
    connectorListData.unshift({ id: '', value: '' });
  }

  const getDropDownValues = () => {
    const arr = [];
    arr.unshift({
      label: '',
      value: '',
      isdisabled: false,
    });
    Object.keys(colAttributesList).map((data) => {
      return arr.push({
        id: data,
        value: colAttributesList[data].name,
        isdisabled: false,
        type:
          colAttributesList[data].type !== ContentConfigurationEnums.INTEGER
            ? colAttributesList[data].type
            : ContentConfigurationEnums.NUMBER,
      });
    });
    return arr;
  };

  const onSubmitForm = (values) => {
    if (formLoading) {
      return false;
    }
    const params = {
      email_general_setting: {
        channel_email_id: values.currentConnector,
        user_attribute: values.usrAttrShowsEmailAddress,
        email_address: values.fromEmailAddress,
      },
    };

    if (settingsList && Object.keys(settingsList).length !== 0) {
      addSettingsAction({
        newParams: params,
        channelEmailId: values.currentConnector,
      });
    } else {
      addSettingsAction({ newParams: params });
    }

    return false;
  };

  useEffect(() => {
    if (settingsList && formRef) {
      if (settingsList && Object.keys(settingsList).length !== 0) {
        setIsSettingsEdit(true);
        formRef.current.setFieldValue(
          'usrAttrShowsEmailAddress',
          settingsList.user_attribute
        );
        formRef.current.setFieldValue(
          'fromEmailAddress',
          settingsList.email_address
        );
      } else {
        setIsSettingsEdit(false);
        formRef.current.setFieldValue('usrAttrShowsEmailAddress', '');
        formRef.current.setFieldValue('fromEmailAddress', ['']);
      }
    }
  }, [settingsList, formRef]);

  useEffect(() => {
    if (formSuccess) {
      const saveMessage = <IntlMessages id="CHANNEL_MGMT.CHANNEL.SAVED_MSG" />;
      NotificationManager.success(saveMessage, 'Success', 6000, null, null, '');
      if (formRef?.current) {
        formRef.current.resetForm();
      }
      addSettingsCleanAction();
      cleanSettingsListAction();
    }
  }, [formSuccess]);

  useEffect(() => {
    if (formError && formError.errorMsg) {
      NotificationManager.error(
        formError.errorMsg,
        'Error',
        6000,
        null,
        null,
        ''
      );
      addSettingsCleanAction();
    }
  }, [formError]);

  return (
    <div className="mt-5">
      <Formik
        initialValues={initialValues}
        validationSchema={EmailGeneralSettingsSchema}
        innerRef={formRef}
        validateOnMount
        enableReinitialize
        onSubmit={onSubmitForm}
      >
        {({ errors, touched, values, setFieldValue, handleSubmit }) => (
          <Form
            onSubmit={handleSubmit}
            className="av-tooltip tooltip-label-right"
          >
            <Row>
              <Colxx xxs="6">
                <FormGroupCoustom
                  identifier="currentConnector"
                  errors={errors}
                  dataTestId="currentConnector"
                  touched={touched}
                  identifierLabel="CHANNEL_MGMT.EMAIL_CHANNEL.GENERAL_SETTINGS.CURRENT_CONNECTOR.LABEL"
                  type="select"
                  options={connectorListData}
                  value={values.currentConnector}
                  onChange={(event) => {
                    setFieldValue(
                      'currentConnector',
                      event.target.value,
                      false
                    );
                    setIsSettingsEdit(false);
                    cleanSettingsListAction();
                    getSettingsList({ connectorId: event.target.value });
                  }}
                />

                <FormGroupCoustom
                  identifier="usrAttrShowsEmailAddress"
                  errors={errors}
                  dataTestId="usrAttrShowsEmailAddress"
                  touched={touched}
                  identifierLabel="CHANNEL_MGMT.EMAIL_CHANNEL.GENERAL_SETTINGS.USER_ATTRIBUTE_THAT_STORES_USER_EMAIL_ADDRESS.LABEL"
                  type="select"
                  options={getDropDownValues()}
                  value={values.usrAttrShowsEmailAddress}
                  onChange={(event) => {
                    setFieldValue(
                      'usrAttrShowsEmailAddress',
                      event.target.value,
                      false
                    );
                  }}
                />

                <FieldArray
                  name="fromEmailAddress"
                  render={(arrayHelpers) => (
                    <div>
                      {values.fromEmailAddress.map((data, index) => (
                        <div key={index}>
                          <Row>
                            <Colxx xxs="6">
                              <FormGroupCoustom
                                identifier={`fromEmailAddress.${index}`}
                                dataTestId="fromEmailAddress"
                                name={`fromEmailAddress.${index}`}
                                errors={errors}
                                touched={touched}
                                identifierLabel="CHANNEL_MGMT.EMAIL_CHANNEL.GENERAL_SETTINGS.FROM_EAMIL_ADDRESS.LABEL"
                              />
                            </Colxx>
                            <Colxx xxs="6">
                              <Button
                                type="button"
                                onClick={() =>
                                  values.fromEmailAddress.length > 1 &&
                                  arrayHelpers.remove(index)
                                }
                              >
                                <IntlMessages id="CHANNEL_MGMT.EMAIL_CHANNEL.BUTTON.REMOVE" />
                              </Button>
                            </Colxx>
                          </Row>
                        </div>
                      ))}
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => arrayHelpers.push('')}
                      >
                        <IntlMessages id="CHANNEL_MGMT.EMAIL_CHANNEL.BUTTON.ADD_ANOTHER" />
                      </Button>
                    </div>
                  )}
                />
              </Colxx>

              <Colxx xxs="12">
                <Button
                  data-testid="saveBtn"
                  color="primary"
                  className={`float-right btn-shadow btn-multiple-state ${
                    formLoading ? 'show-spinner' : ''
                  }`}
                  size="lg"
                >
                  <span className="spinner d-inline-block">
                    <span className="bounce1" />
                    <span className="bounce2" />
                    <span className="bounce3" />
                  </span>
                  <span className="label">
                    {isSettingsEdit ? (
                      <IntlMessages id="CHANNEL_MGMT.EMAIL_CHANNEL.BUTTON.UPDATE" />
                    ) : (
                      <IntlMessages id="CHANNEL_MGMT.EMAIL_CHANNEL.BUTTON.SAVE" />
                    )}
                  </span>
                </Button>
              </Colxx>
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const mapStateToProps = ({ settingsChannels, importusersApp }) => {
  const { tataEmailConnectors } = settingsChannels;
  const { colAttributesList } = importusersApp;
  const { successAdd, errorAdd, loadingAdd, generalSettingsList } =
    settingsChannels;
  return {
    allConnectorList: tataEmailConnectors,
    colAttributesList,
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
    settingsList: generalSettingsList,
  };
};

export default connect(mapStateToProps, {
  getConnectorList: getEmailConnectorList,
  getColumnAttributeListAction: getColumnAttributeList,
  cleanSettingsListAction: cleanGetSettingsList,
  addSettingsAction: addEmailGeneralSettings,
  addSettingsCleanAction: addEmailGeneralSettingsClean,
  getSettingsList: getEmailGeneralSettingsList,
})(GeneralSettings);
