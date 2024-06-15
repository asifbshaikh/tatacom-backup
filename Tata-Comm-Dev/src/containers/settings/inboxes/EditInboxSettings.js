import React, { useEffect, useState } from 'react';

import FormGroupCoustom from 'components/common/FormGroupCoustom';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';
import { INBOX_TYPES } from 'helpers/TringIconHelper';
import { onChangeDefault } from 'helpers/TringReactHelper';
import { Formik, Form } from 'formik';
import { Row, Button, Alert, Label } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import * as Yup from 'yup';

import { deleteChannelAvatar } from 'redux/actions';
import { updateInbox, updateInboxClean } from 'redux/channels/actions';
import RichTextEditor from 'react-rte';

const Website = ({
  formError,
  formLoading,
  editFormData,
  deleteChannelAvatarAction,
  updateInboxAction,
}) => {
  const [isEnableGreeting, setIsEnableGreeting] = useState(false);
  const onSubmitForm = (values) => {
    if (formLoading) {
      return false;
    }
    const newParams = {
      id: values.currentInboxId,
      name: values.inboxName,
      enable_auto_assignment: values.autoAssignment,
      enable_email_collect: values.emailCollectEnabled,
      csat_survey_enabled: values.csatSurveyEnabled,
      allow_messages_after_resolved: values.allowMessagesAfterResolved,
      greeting_enabled: values.greetingEnabled,
      greeting_message: textValue || '',
      channel: {
        widget_color: values.channelWidgetColor,
        website_url: values.channelWebsiteUrl,
        webhook_url: values.webhookUrl || '',
        welcome_title: values.channelWelcomeTitle || '',
        welcome_tagline: values.channelWelcomeTagline || '',
        selectedFeatureFlags: values.selectedFeatureFlags,
        reply_time: values.replyTime || 'in_a_few_minutes',
        hmac_mandatory: values.hmacMandatory || null,
        tweets_enabled: values.tweetsEnabled || true,
        continuity_via_email: values.continuityViaEmail || true,
      },
    };
    if (!values.greetingEnabled) {
      setIsEnableGreeting(false);
    }
    if (values.avatarFile) {
      newParams.avatar = values.avatarFile;
    }
    updateInboxAction(newParams);
    return false;
  };

  const [textValue, setTextValue] = useState('');
  const [textQuillStandart, setTextQuillStandart] = useState(
    RichTextEditor.createValueFromString(textValue, 'html')
  );

  useEffect(() => {
    if (editFormData.greeting_message) {
      setTextQuillStandart(
        RichTextEditor.createValueFromString(
          editFormData.greeting_message,
          'html'
        )
      );
    } else {
      setTextQuillStandart(RichTextEditor.createValueFromString('', 'html'));
    }
  }, [editFormData.greeting_message]);

  const toolbarConfig = {
    display: [
      'INLINE_STYLE_BUTTONS',
      'BLOCK_TYPE_BUTTONS',
      'LINK_BUTTONS',
      'HISTORY_BUTTONS',
    ],
    INLINE_STYLE_BUTTONS: [
      { label: 'Bold', style: 'BOLD', className: 'text-editor__button' },
      { label: 'Italic', style: 'ITALIC', className: 'text-editor__button' },
      { label: 'Code', style: 'CODE', className: 'text-editor__button' },
    ],
    BLOCK_TYPE_DROPDOWN: [
      {
        label: 'Normal',
        style: 'unstyled',
        className: 'text-editor__button',
      },
      {
        label: 'Heading Large',
        style: 'header-one',
        className: 'text-editor__button',
      },
      {
        label: 'Heading Medium',
        style: 'header-two',
        className: 'text-editor__button',
      },
      {
        label: 'Heading Small',
        style: 'header-three',
        className: 'text-editor__button',
      },
    ],
    BLOCK_TYPE_BUTTONS: [
      {
        label: 'UL',
        style: 'unordered-list-item',
        className: 'text-editor__button',
      },
      {
        label: 'OL',
        style: 'ordered-list-item',
        className: 'text-editor__button',
      },
    ],
  };
  useEffect(() => {
    if (textQuillStandart.toString('html') !== textValue) {
      setTextQuillStandart(
        RichTextEditor.createValueFromString(textValue, 'html')
      );
    }
  }, [textValue]);

  const handleGreetingMessage = (val) => {
    setTextQuillStandart(val);
    const htmlString = val.toString('html');
    setTextValue(htmlString);
    setIsEnableGreeting(true);
  };

  const initialValues = {
    currentInboxId: editFormData.id,
    inboxName: editFormData.name,
    webhookUrl: editFormData.webhook_url,
    channelWebsiteUrl: editFormData.website_url,
    channelWidgetColor: editFormData.widget_color,
    channelWelcomeTitle: editFormData.welcome_title,
    channelWelcomeTagline: editFormData.welcome_tagline,
    greetingEnabled: editFormData.greeting_enabled,
    greetingMessage: editFormData.greeting_message,
    replyTime: editFormData.reply_time,
    emailCollectEnabled: editFormData.enable_email_collect,
    autoAssignment: editFormData.enable_auto_assignment,
    csatSurveyEnabled: editFormData.csat_survey_enabled,
    allowMessagesAfterResolved: editFormData.allow_messages_after_resolved,
    continuityViaEmail: editFormData.continuity_via_email,
    selectedFeatureFlags: editFormData.selected_feature_flags,
    hmacMandatory: editFormData.hmac_mandatory,
    avatarFile: '',
    avatarFileURL: editFormData.avatar_url,
  };

  if (isEnableGreeting) {
    initialValues.greetingEnabled = true;
  }

  const getFieldRequiredMessage = (message) => {
    return <IntlMessages id={message} />;
  };

  const yupObj = {
    inboxName: Yup.string().required(
      getFieldRequiredMessage('forms.required-message')
    ),
    greetingEnabled: Yup.string().required(
      getFieldRequiredMessage('forms.required-message')
    ),
    greetingMessage: Yup.string().when('greetingEnabled', {
      is: true,
      then: (schema) =>
        schema.required(getFieldRequiredMessage('forms.required-message')),
      otherwise: (schema) => schema.nullable(),
    }),
  };
  if (editFormData.channel_type === INBOX_TYPES.API) {
    yupObj.webhookUrl = Yup.string()
      .matches(/(http|https):\/\/(.*)/, 'Valid http(s) URL only')
      .required('webhookUrl is required!');
  }
  if (editFormData.channel_type === INBOX_TYPES.WEB) {
    yupObj.channelWebsiteUrl = Yup.string().required(
      'Website URL is required!'
    );
    yupObj.channelWidgetColor = Yup.string().required('Color is required!');
    yupObj.channelWelcomeTitle = Yup.string().required(
      'Welcome Title is required!'
    );
    yupObj.channelWelcomeTagline = Yup.string().required(
      'Welcome Tagline is required!'
    );
  }
  const SignupSchema = Yup.object().shape(yupObj);
  return (
    <>
      <Row>
        <Colxx xxs="3">
          <h3>
            <IntlMessages id="inboxes.settings_nav" />
          </h3>
          <p>
            <IntlMessages id="inboxes.settings_nav_help" />
          </p>
        </Colxx>
        <Colxx xxs="9">
          <Formik
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
                    <Colxx xxs="12">
                      <FormGroupCoustom
                        identifier="avatarFile"
                        className="channel-avatar-input mb-4"
                        errors={errors}
                        touched={touched}
                        identifierLabel="inboxes.channel_avatar_file"
                        type="image"
                        onChange={(event) => {
                          setFieldValue(
                            'avatarFile',
                            event.currentTarget.files[0],
                            false
                          );
                        }}
                      />

                      {editFormData.avatar_url && (
                        <div className="mb-5">
                          <img
                            src={editFormData.avatar_url}
                            alt="avatar"
                            style={{ height: '100px', width: '100px' }}
                          />
                          <Button
                            // outline
                            color="theme-3"
                            className="icon-button ml-1 edit-button"
                            onClick={() => {
                              deleteChannelAvatarAction(editFormData);
                            }}
                          >
                            <i className="simple-icon-trash" />
                          </Button>
                        </div>
                      )}
                      <FormGroupCoustom
                        identifier="inboxName"
                        className="mb-4"
                        errors={errors}
                        touched={touched}
                        identifierLabel="CHANNEL_MGMT.SMS_CHANNEL.INBOX_NAME"
                        placeholder="CHANNEL_MGMT.SMS_CHANNEL.INBOX_NAME_PLACEHOLDER"
                        required={true}
                      />
                      {editFormData.channel_type === INBOX_TYPES.API && (
                        <FormGroupCoustom
                          identifier="webhookUrl"
                          className="mb-4"
                          errors={errors}
                          touched={touched}
                          identifierLabel="inboxes.api_channel.webhook_url_label"
                          placeholder="inboxes.api_channel.webhook_url_placeholder"
                          help="inboxes.api_channel.webhook_url_help"
                          required={true}
                        />
                      )}
                      {editFormData.channel_type === INBOX_TYPES.WEB && (
                        <FormGroupCoustom
                          identifier="channelWebsiteUrl"
                          className="mb-4"
                          errors={errors}
                          touched={touched}
                          identifierLabel="inboxes.website.website_domain"
                          placeholder="inboxes.website.website_domain_placeholder"
                          required={true}
                        />
                      )}
                      {editFormData.channel_type === INBOX_TYPES.WEB && (
                        <FormGroupCoustom
                          identifier="channelWidgetColor"
                          className="mb-4"
                          errors={errors}
                          touched={touched}
                          identifierLabel="inboxes.website.widget_color"
                          placeholder="inboxes.website.widget_color_placeholder"
                          help="contacts.color_msg"
                          required={true}
                        />
                      )}
                      {editFormData.channel_type === INBOX_TYPES.WEB && (
                        <FormGroupCoustom
                          identifier="channelWelcomeTitle"
                          className="mb-4"
                          errors={errors}
                          touched={touched}
                          identifierLabel="inboxes.website.channel_welcome_title"
                          placeholder="inboxes.website.channel_welcome_title_placeholder"
                          required={true}
                        />
                      )}
                      {editFormData.channel_type === INBOX_TYPES.WEB && (
                        <FormGroupCoustom
                          identifier="channelWelcomeTagline"
                          className="mb-4"
                          errors={errors}
                          touched={touched}
                          identifierLabel="inboxes.website.channel_welcome_tagline"
                          placeholder="inboxes.website.channel_welcome_tagline_placeholder"
                          required={true}
                        />
                      )}
                      <FormGroupCoustom
                        identifier="greetingEnabled"
                        className="mb-3"
                        errors={errors}
                        touched={touched}
                        identifierLabel="inboxes.website.channel_greeting_toggle"
                        help="inboxes.website.channel_greeting_toggle_help"
                        type="select"
                        options={[
                          {
                            id: true,
                            value: 'inboxes.website.greeting_enabled_enabled',
                          },
                          {
                            id: false,
                            value: 'inboxes.website.greeting_enabled_disabled',
                          },
                        ]}
                        value={values.greetingEnabled}
                        onChange={(event) =>
                          onChangeDefault(
                            event,
                            'greetingEnabled',
                            setFieldValue
                          )
                        }
                        required={true}
                      />
                      {values.greetingEnabled && (
                        <Form className="av-tooltip tooltip-label-right mb-4">
                          <Row>
                            <Colxx xxs="12">
                              <Label className="message-signature-label mb-0">
                                <IntlMessages id="inboxes.website.channel_greeting_message" />
                              </Label>
                              <RichTextEditor
                                placeholder={
                                  <h4>
                                    <IntlMessages
                                      id={
                                        'inboxes.website.channel_greeting_message_placeholder'
                                      }
                                    />
                                  </h4>
                                }
                                required={true}
                                identifier="greetingMessage"
                                value={textQuillStandart}
                                toolbarConfig={toolbarConfig}
                                errors={errors}
                                touched={touched}
                                onChange={(val) => {
                                  handleGreetingMessage(val);
                                }}
                              />
                            </Colxx>
                          </Row>
                        </Form>
                      )}

                      {editFormData.channel_type === INBOX_TYPES.WEB && (
                        <FormGroupCoustom
                          identifier="replyTime"
                          className="mb-4"
                          errors={errors}
                          touched={touched}
                          identifierLabel="inboxes.reply_time"
                          help="inboxes.reply_time_help"
                          type="select"
                          options={[
                            {
                              id: 'in_a_few_minutes',
                              value: 'inboxes.in_a_few_minutes',
                            },
                            {
                              id: 'in_a_few_hours',
                              value: 'inboxes.in_a_few_hours',
                            },
                            { id: 'in_a_day', value: 'inboxes.in_a_day' },
                          ]}
                          value={values.replyTime}
                          onChange={(event) =>
                            onChangeDefault(event, 'replyTime', setFieldValue)
                          }
                        />
                      )}
                      {editFormData.channel_type === INBOX_TYPES.WEB && (
                        <FormGroupCoustom
                          identifier="emailCollectEnabled"
                          className="mb-4"
                          errors={errors}
                          touched={touched}
                          identifierLabel="inboxes.email_collect_box"
                          help="inboxes.email_collect_box_help"
                          type="select"
                          options={[
                            {
                              id: true,
                              value: 'inboxes.email_collect_box_enabled',
                            },
                            {
                              id: false,
                              value: 'inboxes.email_collect_box_disabled',
                            },
                          ]}
                          value={values.emailCollectEnabled}
                          onChange={(event) =>
                            onChangeDefault(
                              event,
                              'emailCollectEnabled',
                              setFieldValue
                            )
                          }
                        />
                      )}
                      <FormGroupCoustom
                        identifier="autoAssignment"
                        className="mb-4"
                        errors={errors}
                        touched={touched}
                        identifierLabel="inboxes.auto_assignment"
                        help="inboxes.auto_assignment_help"
                        type="select"
                        options={[
                          {
                            id: true,
                            value: 'inboxes.auto_assignment_enabled',
                          },
                          {
                            id: false,
                            value: 'inboxes.auto_assignment_disabled',
                          },
                        ]}
                        value={values.autoAssignment}
                        onChange={(event) =>
                          onChangeDefault(
                            event,
                            'autoAssignment',
                            setFieldValue
                          )
                        }
                      />
                      <FormGroupCoustom
                        identifier="csatSurveyEnabled"
                        className="mb-4"
                        errors={errors}
                        touched={touched}
                        identifierLabel="inboxes.enable_csat"
                        help="inboxes.enable_csat_help"
                        type="select"
                        options={[
                          { id: true, value: 'inboxes.enable_csat_enabled' },
                          { id: false, value: 'inboxes.enable_csat_disabled' },
                        ]}
                        value={values.csatSurveyEnabled}
                        onChange={(event) =>
                          onChangeDefault(
                            event,
                            'csatSurveyEnabled',
                            setFieldValue
                          )
                        }
                      />
                      {editFormData.channel_type === INBOX_TYPES.WEB && (
                        <FormGroupCoustom
                          identifier="allowMessagesAfterResolved"
                          className="mb-4"
                          errors={errors}
                          touched={touched}
                          identifierLabel="inboxes.allow_messages_after_resolved"
                          help="inboxes.allow_messages_after_resolved_help"
                          type="select"
                          options={[
                            {
                              id: true,
                              value:
                                'inboxes.allow_messages_after_resolved_enabled',
                            },
                            {
                              id: false,
                              value:
                                'inboxes.allow_messages_after_resolved_disabled',
                            },
                          ]}
                          value={values.allowMessagesAfterResolved}
                          onChange={(event) =>
                            onChangeDefault(
                              event,
                              'allowMessagesAfterResolved',
                              setFieldValue
                            )
                          }
                          required={true}
                        />
                      )}
                      {editFormData.channel_type === INBOX_TYPES.WEB && (
                        <FormGroupCoustom
                          identifier="continuityViaEmail"
                          className="mb-4"
                          errors={errors}
                          touched={touched}
                          identifierLabel="inboxes.continuity_via_email"
                          help="inboxes.continuity_via_email_help"
                          type="select"
                          options={[
                            {
                              id: true,
                              value: 'inboxes.continuity_via_email_enabled',
                            },
                            {
                              id: false,
                              value: 'inboxes.continuity_via_email_disabled',
                            },
                          ]}
                          value={values.continuityViaEmail}
                          onChange={(event) =>
                            onChangeDefault(
                              event,
                              'continuityViaEmail',
                              setFieldValue
                            )
                          }
                        />
                      )}

                      {editFormData.channel_type === INBOX_TYPES.WEB && (
                        <FormGroupCoustom
                          identifier="selectedFeatureFlags"
                          className="mb-4"
                          errors={errors}
                          touched={touched}
                          identifierLabel="inboxes.features"
                          // help='inboxes.website.channel_greeting_toggle_help'
                          type="checkboxMulti"
                          // noLable
                          radioMultiOptions={[
                            {
                              id: 'attachments',
                              value: 'attachments',
                              label: 'inboxes.features_display_file_picker',
                            },
                            {
                              id: 'emoji_picker',
                              value: 'emoji_picker',
                              label: 'inboxes.features_display_emoji_picker',
                            },
                          ]}
                          onChange={(event) => {
                            let { selectedFeatureFlags } = values;
                            if (event.target.checked) {
                              selectedFeatureFlags.push(event.target.value);
                            } else {
                              selectedFeatureFlags =
                                selectedFeatureFlags.filter(
                                  (item) => item !== event.target.value
                                );
                            }
                            setFieldValue(
                              'selectedFeatureFlags',
                              selectedFeatureFlags,
                              false
                            );
                          }}
                          value={values.selectedFeatureFlags}
                        />
                      )}
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
              );
            }}
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
  deleteChannelAvatarAction: deleteChannelAvatar,
  updateInboxAction: updateInbox,
  updateInboxCleanAction: updateInboxClean,
})(Website);
