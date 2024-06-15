import React from 'react';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { connect } from 'react-redux';
import { Row, Button, Spinner, Alert } from 'reactstrap';

import {
  Formik,
  Form,
  // Field
} from 'formik';

import {
  deleteProfileAvatar,
  updateProfile,
  updateProfileClean,
} from 'redux/actions';
import IntlMessages from 'helpers/IntlMessages';
import * as Yup from 'yup';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { NotificationManager } from 'components/common/react-notifications';
import { NavLink } from 'react-router-dom';
import Thumbnail from 'components/common/Thumbnail';
import MessageSignature from 'containers/profiles/MessageSignature';
import ChangePassword from 'containers/profiles/ChangePassword';
import NotificationSettings from 'containers/profiles/NotificationSettings';

const InboxesNew = ({
  match,
  currentUser,
  formError,
  formLoading,
  formSuccess,
  updateProfileAction,
  updateProfileCleanAction,
  deleteProfileAvatarAction,
}) => {
  // useEffect(() => {
  //     getChannelAction();
  // }, [match.params.inboxid])

  const onSubmitForm = (values) => {
    if (formLoading) {
      return false;
    }
    const newParams = {
      // id: values.currentUserId,
      name: values.name,
      displayName: values.displayName,
      email: values.email,
    };
    if (values.avatarFile) {
      newParams.avatar = values.avatarFile;
    }

    updateProfileAction(newParams);
    return false;
  };
  if (formSuccess) {
    NotificationManager.success(
      <IntlMessages id="PROFILE_SETTINGS.UPDATE_SUCCESS" />,
      'Success',
      6000,
      null,
      null,
      '' // className
    );
    updateProfileCleanAction({});
  }
  const initialValues = {
    currentUserId: currentUser.id,
    name: currentUser.name,
    displayName: currentUser.display_name,
    email: currentUser.email,
  };

  const yupObj = {
    name: Yup.string().required('This field is required!'),
    displayName: Yup.string().required('This field is required!'),
    email: Yup.string()
      .required('This field is required!')
      .email('Invalid email!'),
  };
  const SignupSchema = Yup.object().shape(yupObj);

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="GENERAL_SETTINGS.TITLE" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12" className="mb-5">
          {!currentUser ? (
            <Spinner color="primary" />
          ) : (
            <>
              <Row>
                <Colxx xxs="3">
                  <h3>
                    <IntlMessages id="PROFILE_SETTINGS.FORM.PROFILE_SECTION.TITLE" />
                  </h3>
                  <p>
                    <IntlMessages id="PROFILE_SETTINGS.FORM.PROFILE_SECTION.NOTE" />
                  </p>
                </Colxx>
                <Colxx xxs="9">
                  {/* <Formik initialValues={initialValues} validationSchema={SignupSchema} enableReinitialize onSubmit={onsendConversation}> */}

                  <Formik
                    // innerRef={formRef}
                    initialValues={initialValues}
                    validationSchema={SignupSchema}
                    validateOnMount
                    enableReinitialize
                    onSubmit={onSubmitForm}
                  >
                    {({ errors, touched, setFieldValue }) => {
                      return (
                        <Form className="av-tooltip tooltip-label-right">
                          <Row>
                            <Colxx xxs="12">
                              <FormGroupCoustom
                                identifier="avatarFile"
                                errors={errors}
                                touched={touched}
                                identifierLabel="PROFILE_SETTINGS.FORM.PROFILE_IMAGE.LABEL"
                                type="file"
                                onChange={(event) => {
                                  setFieldValue(
                                    'avatarFile',
                                    event.currentTarget.files[0],
                                    false
                                  );
                                }}
                              />

                              {typeof currentUser.avatar_url !==
                                'undefined' && (
                                <div className="mb-3">
                                  {/* <img src={currentUser.avatar_url} alt="avatar" style={{ height: "100px", width: "100px" }} /> */}
                                  <div
                                    style={{ width: '50px' }}
                                    // currentUser={currentUser}
                                  >
                                    <Thumbnail
                                      source={currentUser.avatar_url}
                                      name={currentUser.name}
                                    />
                                  </div>
                                  {/* <div>{currentUser.avatar_url}</div> */}
                                  {!currentUser.avatar_url.includes(
                                    'www.gravatar.com'
                                  ) && (
                                    <Button
                                      // outline
                                      color="theme-3"
                                      className="icon-button ml-1 edit-button"
                                      onClick={() => {
                                        deleteProfileAvatarAction(currentUser);
                                      }}
                                    >
                                      <i className="simple-icon-trash" />
                                    </Button>
                                  )}
                                </div>
                              )}
                              <FormGroupCoustom
                                identifier="name"
                                errors={errors}
                                touched={touched}
                                identifierLabel="PROFILE_SETTINGS.FORM.NAME.LABEL"
                                placeholder="PROFILE_SETTINGS.FORM.NAME.PLACEHOLDER"
                                required={true}
                              />
                              <FormGroupCoustom
                                identifier="displayName"
                                errors={errors}
                                touched={touched}
                                identifierLabel="PROFILE_SETTINGS.FORM.DISPLAY_NAME.LABEL"
                                placeholder="PROFILE_SETTINGS.FORM.DISPLAY_NAME.PLACEHOLDER"
                                required={true}
                              />
                              <FormGroupCoustom
                                identifier="email"
                                errors={errors}
                                touched={touched}
                                identifierLabel="PROFILE_SETTINGS.FORM.EMAIL.LABEL"
                                placeholder="PROFILE_SETTINGS.FORM.EMAIL.PLACEHOLDER"
                                required={true}
                              />

                              {formError && formError.errorMsg && (
                                <Alert color="danger" className="rounded">
                                  {formError.errorMsg}
                                </Alert>
                              )}
                              <Button color="primary">
                                <IntlMessages id="PROFILE_SETTINGS.BTN_TEXT" />
                              </Button>
                            </Colxx>
                          </Row>
                        </Form>
                      );
                    }}
                  </Formik>
                </Colxx>
              </Row>
              {/* // <message-signature /> */}
              <MessageSignature />
              <ChangePassword />
              <NotificationSettings />
              {/* // <change-password v-if="!globalConfig.disableUserProfileUpdate" /> */}
              {/* // <notification-settings /> */}
            </>
          )}
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12" className="mb-5">
          <Row>
            <Colxx xxs="3">
              <h3>
                <IntlMessages id="PROFILE_SETTINGS.FORM.ACCESS_TOKEN.TITLE" />
              </h3>
              <p>
                <IntlMessages id="PROFILE_SETTINGS.FORM.ACCESS_TOKEN.NOTE" />
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
                      navigator.clipboard.writeText(currentUser.access_token);
                    }}
                  >
                    <i className="simple-icon-docs large-icon1 initial-height1 ml-1" />
                  </NavLink>
                </div>
                <code className="pl-5">{currentUser.access_token}</code>
              </div>
            </Colxx>
          </Row>
        </Colxx>
      </Row>
    </>
  );
};

// export default InboxesNew;
const mapStateToProps = ({ authUser }) => {
  const { currentUser, errorUpdate, loadingUpdate, successUpdate } = authUser;
  return {
    currentUser,
    formError: errorUpdate,
    formLoading: loadingUpdate,
    formSuccess: successUpdate,
  };
};
export default connect(mapStateToProps, {
  updateProfileAction: updateProfile,
  updateProfileCleanAction: updateProfileClean,
  deleteProfileAvatarAction: deleteProfileAvatar,
})(InboxesNew);
