import React from 'react';

import FormGroupCoustom from 'components/common/FormGroupCoustom';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';

import { NavLink } from 'react-router-dom';

import { enabledLanguages, onChangeDefault } from 'helpers/TringReactHelper';

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
  Label,
  // Card, CardBody
} from 'reactstrap';

import { Colxx } from 'components/common/CustomBootstrap';
// import { injectIntl } from 'react-intl';

import * as Yup from 'yup';

import { NotificationManager } from 'components/common/react-notifications';

import { addAccount, addAccountClean } from 'redux/actions';

const Website = ({
  // inboxid,
  // fields,
  // formRef, next,
  // setFieldsCoustom,
  formSuccess,
  formError,
  formLoading,
  // addData,
  account,
  // updateData,
  addAccountAction,
  addAccountCleanAction,
}) => {
  // const [greetingMessageVisible, setGreetingMessageVisible] = useState(account.greeting_enabled);

  const onSubmitForm = (values) => {
    if (formLoading) {
      return false;
    }
    const newParams = {
      id: account.id,
      locale: values.locale,
      name: values.name,
      domain: values.domain,
      support_email: values.supportEmail,
      auto_resolve_duration: values.autoResolveDuration,
    };
    addAccountAction(newParams);
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
    addAccountCleanAction({});
    // updateData();
  }
  const initialValues = {
    id: account.id || '',
    name: account.name || '',
    locale: account.locale || 'en',
    domain: typeof account.domain !== 'undefined' ? account.domain : '',
    supportEmail: account.support_email || '',
    customEmailDomainEnabled:
      typeof account.custom_email_domain_enabled !== 'undefined'
        ? account.custom_email_domain_enabled
        : '',
    features: account.features || {},
    autoResolveDuration:
      typeof account.auto_resolve_duration !== 'undefined'
        ? account.auto_resolve_duration
        : null,
    latestTringVersion:
      typeof account.latest_tring_version !== 'undefined'
        ? account.latest_tring_version
        : null,
  };

  const yupObj = {
    name: Yup.string().required('This Field is required!'),
    locale: Yup.string().required('This Field is required!'),
    autoResolveDuration: Yup.number()
      .positive()
      .integer()
      .min(1, 'Must be min 1')
      .max(999, 'Must be max 999')
      .nullable(),
  };
  const SignupSchema = Yup.object().shape(yupObj);

  const enabledLanguagesSorted = enabledLanguages.sort((l1, l2) =>
    l1.iso_639_1_code.localeCompare(l2.iso_639_1_code)
  );
  const enabledLanguagesAll = enabledLanguagesSorted.map((item) => {
    return { value: item.name, id: item.iso_639_1_code };
  });

  const featureInboundEmailEnabled = () => {
    return !!account.features.inbound_emails;
  };
  const featureCustomDomainEmailEnabled = () => {
    return (
      featureInboundEmailEnabled() && !!account.custom_email_domain_enabled
    );
  };
  return (
    <>
      <Formik
        // innerRef={formRef}
        initialValues={initialValues}
        validationSchema={SignupSchema}
        validateOnMount
        enableReinitialize
        onSubmit={onSubmitForm}
      >
        {({ errors, touched, setFieldValue, values }) => {
          return (
            <Form className="av-tooltip tooltip-label-right">
              <Row>
                <Colxx xxs="3">
                  <h3>
                    <IntlMessages id="GENERAL_SETTINGS.FORM.GENERAL_SECTION.TITLE" />
                  </h3>
                  <p>
                    <IntlMessages id="GENERAL_SETTINGS.FORM.GENERAL_SECTION.NOTE" />
                  </p>
                </Colxx>
                <Colxx xxs="9">
                  <FormGroupCoustom
                    identifier="name"
                    errors={errors}
                    touched={touched}
                    identifierLabel="GENERAL_SETTINGS.FORM.NAME.LABEL"
                    placeholder="GENERAL_SETTINGS.FORM.NAME.PLACEHOLDER"
                    required={true}
                  />
                  <FormGroupCoustom
                    identifier="locale"
                    errors={errors}
                    touched={touched}
                    identifierLabel="GENERAL_SETTINGS.FORM.LANGUAGE.LABEL"
                    type="select"
                    // languagesSortedByCode
                    options={enabledLanguagesAll}
                    value={values.locale}
                    onChange={(event) =>
                      onChangeDefault(event, 'locale', setFieldValue)
                    }
                    required={true}
                  />
                  {featureInboundEmailEnabled() && (
                    <Label>
                      <IntlMessages id="GENERAL_SETTINGS.FORM.FEATURES.INBOUND_EMAIL_ENABLED" />
                    </Label>
                  )}
                  {featureCustomDomainEmailEnabled() && (
                    <Label>
                      <IntlMessages id="GENERAL_SETTINGS.FORM.FEATURES.CUSTOM_EMAIL_DOMAIN_ENABLED" />
                    </Label>
                  )}
                  {featureCustomDomainEmailEnabled() && (
                    <FormGroupCoustom
                      identifier="domain"
                      errors={errors}
                      touched={touched}
                      identifierLabel="GENERAL_SETTINGS.FORM.DOMAIN.LABEL"
                      placeholder="GENERAL_SETTINGS.FORM.DOMAIN.PLACEHOLDER"
                    />
                  )}
                  {featureCustomDomainEmailEnabled() && (
                    <FormGroupCoustom
                      identifier="supportEmail"
                      errors={errors}
                      touched={touched}
                      identifierLabel="GENERAL_SETTINGS.FORM.SUPPORT_EMAIL.LABEL"
                      placeholder="GENERAL_SETTINGS.FORM.SUPPORT_EMAIL.PLACEHOLDER"
                    />
                  )}
                  <FormGroupCoustom
                    identifier="autoResolveDuration"
                    type="number"
                    errors={errors}
                    touched={touched}
                    identifierLabel="GENERAL_SETTINGS.FORM.AUTO_RESOLVE_DURATION.LABEL"
                    placeholder="GENERAL_SETTINGS.FORM.AUTO_RESOLVE_DURATION.PLACEHOLDER"
                  />
                </Colxx>
              </Row>

              <Row>
                <Colxx xxs="3">
                  <h3>
                    <IntlMessages id="GENERAL_SETTINGS.FORM.ACCOUNT_ID.TITLE" />
                  </h3>
                  <p>
                    <IntlMessages id="GENERAL_SETTINGS.FORM.ACCOUNT_ID.NOTE" />
                  </p>
                </Colxx>
                <Colxx xxs="9">
                  <div className="directContent">
                    <div className="position-absolute  pt-1 pl-2 l-0">
                      <NavLink
                        className="p-0"
                        href="#"
                        to={{}}
                        onClick={() => {
                          navigator.clipboard.writeText(account.id);
                        }}
                      >
                        <i className="simple-icon-docs large-icon1 initial-height1 ml-1" />
                      </NavLink>
                    </div>
                    <div className="pt-1">
                      <code className="pl-5">{account.id}</code>
                    </div>
                  </div>
                </Colxx>
              </Row>

              <Row>
                <Colxx xxs="3" />
                <Colxx xxs="9">
                  {/* <div>
                                        {`v${globalConfig.appVersion}`}
                                    </div> */}

                  {formError && formError.errorMsg && (
                    <Alert color="danger" className="rounded">
                      {formError.errorMsg}
                    </Alert>
                  )}
                  <Button color="primary" className="mt-3">
                    <IntlMessages id="GENERAL_SETTINGS.SUBMIT" />
                  </Button>
                </Colxx>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

// export default Website;

const mapStateToProps = ({ channelsApp }) => {
  const { successAdd, errorAdd, loadingAdd } = channelsApp;
  return {
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
  };
};
export default connect(mapStateToProps, {
  addAccountAction: addAccount,
  addAccountCleanAction: addAccountClean,
})(Website);
