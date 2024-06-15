import React, { useEffect, useState } from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import { connect } from 'react-redux';
import { Row, Button, Alert, Label } from 'reactstrap';

import { Formik, Form } from 'formik';

import { updateProfile, updateProfileClean } from 'redux/actions';
import IntlMessages from 'helpers/IntlMessages';
import * as Yup from 'yup';
import { NotificationManager } from 'components/common/react-notifications';
import RichTextEditor from 'react-rte';
import ConversationEnums from 'enums/conversations/conversationEnums';
import { htmlRegex } from 'constants/appConstant';

const MessageSignature = ({
  currentUser,
  formError,
  formLoading,
  formSuccess,
  updateProfileAction,
  updateProfileCleanAction,
}) => {
  const [textValue, setTextValue] = useState(
    currentUser.message_signature || ''
  );

  const [textQuillStandart, setTextQuillStandart] = useState(
    RichTextEditor.createValueFromString(textValue, 'html')
  );

  const [plainTextValue, setPlainTextValue] = useState('');

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

  useEffect(() => {
    const plainText = textValue.replace(htmlRegex, '');
    setPlainTextValue(plainText);
  }, [textValue]);

  const handlePrivateNote = (val) => {
    setTextQuillStandart(val);
    const htmlString = val.toString('html');
    setTextValue(htmlString);
  };

  const onSubmitForm = (values) => {
    if (formLoading) {
      return false;
    }
    const newParams = {
      message_signature: values.messageSignature,
    };

    updateProfileAction(newParams);
    return false;
  };
  if (formSuccess) {
    NotificationManager.success(
      <IntlMessages id="PROFILE_SETTINGS.FORM.MESSAGE_SIGNATURE_SECTION.API_SUCCESS" />,
      'Success',
      6000,
      null,
      null,
      ''
    );
    updateProfileCleanAction({});
  }
  const initialValues = {
    messageSignature: textValue,
  };

  return (
    <Row className="mt-3">
      <Colxx xxs="3">
        <h3>
          <IntlMessages id="PROFILE_SETTINGS.FORM.MESSAGE_SIGNATURE_SECTION.TITLE" />
        </h3>
        <p>
          <IntlMessages id="PROFILE_SETTINGS.FORM.MESSAGE_SIGNATURE_SECTION.NOTE" />
        </p>
      </Colxx>
      <Colxx xxs="9">
        <Formik
          initialValues={initialValues}
          validateOnMount
          enableReinitialize
          onSubmit={onSubmitForm}
        >
          {({ isValid }) => (
            <Form className="av-tooltip tooltip-label-right">
              <Row>
                <Colxx xxs="12">
                  <Label className="message-signature-label">
                    <IntlMessages id="PROFILE_SETTINGS.FORM.MESSAGE_SIGNATURE.LABEL" />
                  </Label>
                  <RichTextEditor
                    placeholder={
                      <h4>
                        <IntlMessages
                          id={
                            'PROFILE_SETTINGS.FORM.MESSAGE_SIGNATURE.PLACEHOLDER'
                          }
                        />
                      </h4>
                    }
                    value={textQuillStandart}
                    toolbarConfig={toolbarConfig}
                    onChange={(val) => {
                      handlePrivateNote(val);
                    }}
                  />
                  {formError && formError.errorMsg && (
                    <Alert color="danger" className="rounded">
                      {formError.errorMsg}
                    </Alert>
                  )}
                  <br />
                  <Button
                    color="primary"
                    type="submit"
                    disabled={plainTextValue === '' || !isValid}
                  >
                    <IntlMessages id="PROFILE_SETTINGS.FORM.MESSAGE_SIGNATURE_SECTION.BTN_TEXT" />
                  </Button>
                </Colxx>
              </Row>
              <br />
            </Form>
          )}
        </Formik>
      </Colxx>
    </Row>
  );
};

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
})(MessageSignature);
