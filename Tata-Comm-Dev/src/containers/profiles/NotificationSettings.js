import React, { useEffect } from "react";
import { Colxx } from 'components/common/CustomBootstrap';
import { connect } from 'react-redux';
import {
    Row,
    Button,
    Alert,
} from 'reactstrap';

import {
    Formik,
    Form,
    // Field
} from 'formik';

import { getNotificationSettings, postNotificationSettings, postNotificationSettingsClean, updateProfile, updateProfileClean } from "redux/actions";
import IntlMessages from "helpers/IntlMessages";
// import * as Yup from 'yup';
import FormGroupCoustom from "components/common/FormGroupCoustom";
import { NotificationManager } from "components/common/react-notifications";


const NotificationSettings = ({
    // match,
    currentUser,
    notificationSettings,
    formError,
    // formLoading,
    formSuccess,
    getNotificationSettingsAction,
    postNotificationSettingsAction,
    postNotificationSettingsCleanAction,
    // formErrorProfile,
    formLoadingProfile,
    formSuccessProfile,
    updateProfileAction,
    updateProfileCleanAction,
}) => {
    useEffect(() => {
        getNotificationSettingsAction();
    }, [])


    const onSubmitForm = (values) => {
        if (formLoadingProfile) {
            return false;
        }
        const newParams = {
            formData: false,
            ui_settings: {
                enable_audio_alerts: values.enableAudioAlerts
            },
        };

       updateProfileAction(newParams);
        return false;
    };
    if (formSuccessProfile) {
        NotificationManager.success(
            <IntlMessages id="PROFILE_SETTINGS.FORM.API.UPDATE_SUCCESS" />,
            'Success',
            6000,
            null,
            null,
            '', // className
        );
        updateProfileCleanAction({});
    }
    const updateNotificationSettings = (values) => {
        const newParams = {
            selected_email_flags: values.selectedEmailFlags,
            selected_push_flags: values.selectedPushFlags,
        };
         postNotificationSettingsAction(newParams);
        return false;
    }
    if (formSuccess) {
        NotificationManager.success(
            <IntlMessages id="PROFILE_SETTINGS.FORM.API.UPDATE_SUCCESS" />,
            'Success',
            6000,
            null,
            null,
            '', // className
        );
        postNotificationSettingsCleanAction({});
    }
    const hasEnabledPushPermissions = false;

    const { enable_audio_alerts: enableAudio = false } = currentUser.ui_settings || {};
    const enableAudioAlerts = enableAudio;

    const initialValues = {
        selectedEmailFlags: notificationSettings.selected_email_flags ? notificationSettings.selected_email_flags : [],
        selectedPushFlags: notificationSettings.selected_push_flags ? notificationSettings.selected_push_flags : [],
        enableAudioAlerts,
        hasEnabledPushPermissions: false,
    };

    // const yupObj = {
    //     currentPassword: Yup.string()
    //         .required('This field is required!'),
    //     password: Yup.string()
    //         .required('This field is required!'),
    //     passwordConfirmation: Yup.string()
    //         .required('This field is required!'),
    // };
    // const SignupSchema = Yup.object().shape(yupObj);

    return (
        // {/* <Formik initialValues={initialValues} validationSchema={SignupSchema} enableReinitialize onSubmit={onsendConversation}> */ }
        < Formik
            // innerRef={formRef}
            initialValues={initialValues}
            // validationSchema={SignupSchema}
            validateOnMount
            enableReinitialize
        // onSubmit={onSubmitForm}
        >
            {({ errors, touched, values, setFieldValue }) => {
                return (
                    <Form className="av-tooltip tooltip-label-right">
                        <Row className="mt-2">
                            <Colxx xxs="3">
                                <h3><IntlMessages id="PROFILE_SETTINGS.FORM.AUDIO_NOTIFICATIONS_SECTION.TITLE" /></h3>
                                <p><IntlMessages id="PROFILE_SETTINGS.FORM.AUDIO_NOTIFICATIONS_SECTION.NOTE" /></p>
                            </Colxx>
                            <Colxx xxs="9">
                                <FormGroupCoustom
                                    identifier='enableAudioAlerts'
                                    errors={errors}
                                    touched={touched}
                                    // identifierLabel='PROFILE_SETTINGS.FORM.AUDIO_NOTIFICATIONS_SECTION.NONE'
                                    // help='PROFILE_SETTINGS.FORM.AUDIO_NOTIFICATIONS_SECTION.NONE'
                                    type='radioMulti'
                                    noLable
                                    radioMultiOptions={[
                                        {
                                            id: 'alert_none',
                                            value: 'none',
                                            label: 'PROFILE_SETTINGS.FORM.AUDIO_NOTIFICATIONS_SECTION.NONE',
                                        },
                                        {
                                            id: 'greeting_mine',
                                            value: 'mine',
                                            label: 'PROFILE_SETTINGS.FORM.AUDIO_NOTIFICATIONS_SECTION.ASSIGNED',
                                        },
                                        {
                                            id: 'greeting_all',
                                            value: 'all',
                                            label: 'PROFILE_SETTINGS.FORM.AUDIO_NOTIFICATIONS_SECTION.ALL_CONVERSATIONS',
                                        },
                                    ]}
                                    onChange={(event) => {
                                        // setGreetingMessageVisible(event.target.value === 'enabled')
                                        setFieldValue('enableAudioAlerts', event.target.value, false);
                                        onSubmitForm({ enableAudioAlerts: event.target.value });
                                    }}
                                    value={values.enableAudioAlerts}
                                />
                            </Colxx>
                        </Row>
                        <Row className="mt-2">
                            <Colxx xxs="3">
                                <h3><IntlMessages id="PROFILE_SETTINGS.FORM.EMAIL_NOTIFICATIONS_SECTION.TITLE" /></h3>
                                <p><IntlMessages id="PROFILE_SETTINGS.FORM.EMAIL_NOTIFICATIONS_SECTION.NOTE" /></p>
                            </Colxx>
                            <Colxx xxs="9">
                                <FormGroupCoustom
                                    identifier='selectedEmailFlags'
                                    errors={errors}
                                    touched={touched}
                                    // identifierLabel='inboxes.features'
                                    // help='inboxes.website.channel_greeting_toggle_help'
                                    type='checkboxMulti'
                                    noLable
                                    radioMultiOptions={[
                                        {
                                            id: 'email_conversation_creation',
                                            value: 'email_conversation_creation',
                                            label: 'PROFILE_SETTINGS.FORM.EMAIL_NOTIFICATIONS_SECTION.CONVERSATION_CREATION',
                                        },
                                        {
                                            id: 'email_conversation_assignment',
                                            value: 'email_conversation_assignment',
                                            label: 'PROFILE_SETTINGS.FORM.EMAIL_NOTIFICATIONS_SECTION.CONVERSATION_ASSIGNMENT',
                                        },
                                        {
                                            id: 'email_conversation_mention',
                                            value: 'email_conversation_mention',
                                            label: 'PROFILE_SETTINGS.FORM.EMAIL_NOTIFICATIONS_SECTION.CONVERSATION_MENTION',
                                        },
                                        {
                                            id: 'email_assigned_conversation_new_message',
                                            value: 'email_assigned_conversation_new_message',
                                            label: 'PROFILE_SETTINGS.FORM.EMAIL_NOTIFICATIONS_SECTION.ASSIGNED_CONVERSATION_NEW_MESSAGE',
                                        },
                                    ]}
                                    onChange={(event) => {
                                        let { selectedEmailFlags } = values;
                                        if (event.target.checked) {
                                            selectedEmailFlags.push(event.target.value);
                                        } else {
                                            selectedEmailFlags = selectedEmailFlags.filter(item => item !== event.target.value)
                                        }
                                        setFieldValue('selectedEmailFlags', selectedEmailFlags, false);
                                        updateNotificationSettings({ ...values, selectedEmailFlags });
                                    }}
                                    value={values.selectedEmailFlags}
                                />
                            </Colxx>
                        </Row>
                        <Row className="mt-2">
                            <Colxx xxs="3">
                                <h3><IntlMessages id="PROFILE_SETTINGS.FORM.PUSH_NOTIFICATIONS_SECTION.TITLE" /></h3>
                                <p><IntlMessages id="PROFILE_SETTINGS.FORM.PUSH_NOTIFICATIONS_SECTION.NOTE" /></p>
                            </Colxx>
                            <Colxx xxs="9">
                                {hasEnabledPushPermissions && <p className="mb-2"><IntlMessages id="PROFILE_SETTINGS.FORM.PUSH_NOTIFICATIONS_SECTION.HAS_ENABLED_PUSH" /></p>}
                                {!hasEnabledPushPermissions && <Button color="primary" className="mb-2">
                                    <IntlMessages id="PROFILE_SETTINGS.FORM.PUSH_NOTIFICATIONS_SECTION.REQUEST_PUSH" />
                                </Button>}
                                <FormGroupCoustom
                                    identifier='selectedPushFlags'
                                    errors={errors}
                                    touched={touched}
                                    type='checkboxMulti'
                                    noLable
                                    radioMultiOptions={[
                                        {
                                            id: 'push_conversation_creation',
                                            value: 'push_conversation_creation',
                                            label: 'PROFILE_SETTINGS.FORM.PUSH_NOTIFICATIONS_SECTION.CONVERSATION_CREATION',
                                        },
                                        {
                                            id: 'push_conversation_assignment',
                                            value: 'push_conversation_assignment',
                                            label: 'PROFILE_SETTINGS.FORM.PUSH_NOTIFICATIONS_SECTION.CONVERSATION_ASSIGNMENT',
                                        },
                                        {
                                            id: 'push_conversation_mention',
                                            value: 'push_conversation_mention',
                                            label: 'PROFILE_SETTINGS.FORM.PUSH_NOTIFICATIONS_SECTION.CONVERSATION_MENTION',
                                        },
                                        {
                                            id: 'push_assigned_conversation_new_message',
                                            value: 'push_assigned_conversation_new_message',
                                            label: 'PROFILE_SETTINGS.FORM.PUSH_NOTIFICATIONS_SECTION.ASSIGNED_CONVERSATION_NEW_MESSAGE',
                                        },
                                    ]}
                                    onChange={(event) => {
                                        let { selectedPushFlags } = values;
                                        if (event.target.checked) {
                                            selectedPushFlags.push(event.target.value);
                                        } else {
                                            selectedPushFlags = selectedPushFlags.filter(item => item !== event.target.value)
                                        }
                                        setFieldValue('selectedPushFlags', selectedPushFlags, false);
                                        updateNotificationSettings({ ...values, selectedPushFlags });
                                    }}
                                    value={values.selectedPushFlags}
                                />
                            </Colxx>
                        </Row>

                        <Row>
                            <Colxx xxs="12">
                                {formError && formError.errorMsg && (
                                    <Alert color="danger" className="rounded">
                                        {formError.errorMsg}
                                    </Alert>
                                )}
                                {/* <Button color="primary">
                                    <IntlMessages id="PROFILE_SETTINGS.FORM.PASSWORD_SECTION.BTN_TEXT" />
                                </Button> */}
                            </Colxx>
                        </Row>
                    </Form>
                )
            }}
        </Formik >
    );
}

const mapStateToProps = ({ authUser }) => {
    const {
        currentUser,
        notificationSettings,
        errorNotificationSetting,
        loadingNotificationSetting,
        successNotificationSetting,
        errorUpdate,
        loadingUpdate,
        successUpdate,
    } = authUser;
    return {
        currentUser,
        notificationSettings,
        formError: errorNotificationSetting,
        formLoading: loadingNotificationSetting,
        formSuccess: successNotificationSetting,
        formErrorProfile: errorUpdate,
        formLoadingProfile: loadingUpdate,
        formSuccessProfile: successUpdate,
    };
};
export default connect(mapStateToProps, {
    getNotificationSettingsAction: getNotificationSettings,
    postNotificationSettingsAction: postNotificationSettings,
    postNotificationSettingsCleanAction: postNotificationSettingsClean,
    updateProfileAction: updateProfile,
    updateProfileCleanAction: updateProfileClean,
})(NotificationSettings);