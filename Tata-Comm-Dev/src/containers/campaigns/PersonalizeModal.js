import React from 'react';
import {
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { Form, FieldArray } from 'formik';
import { getColAttributesDropDownValues } from 'helpers/campaignHelper';
import CommonEnums from 'enums/commonEnums';

function PersonalizeModal({
  modalOpen,
  form,
  messageBody,
  toggleModal,
  getPersonalizedMsgAction,
  colAttributesList,
  channelType,
}) {
  const { values, setFieldValue } = form;

  const closeForm = () => {
    if (modalOpen) {
      toggleModal(!modalOpen);
      form.setFieldValue('personalize', false);
    }
  };

  const handleSubmit = () => {
    const payload = {
      message: messageBody,
      mapping: [],
    };
    if (channelType === CommonEnums.WHATSAPP) {
      values.personalisedParam.fieldsArray.forEach((fields) => {
        const findIndexOfFields = payload.mapping.findIndex(
          (e) => e.type === fields.type
        );
        const fieldKey = fields.key.replace(/[{}]/g, '').toString();

        if (findIndexOfFields !== -1) {
          payload.mapping[findIndexOfFields].parameters[fieldKey] =
            fields.value;
        } else {
          payload.mapping.push({
            type: fields.type,
            parameters: {
              [fieldKey]: fields.value,
            },
            text: fields.text,
          });
        }
      });
    } else {
      values.personalisedParam.fieldsArray.forEach((fields) => {
        if (fields.isAccepted) {
          const fieldValue = getColAttributesDropDownValues(
            colAttributesList
          ).find((attr) => attr.label === fields.value);
          payload.mapping = [
            ...payload.mapping,
            {
              key: fields.key.replace(/[{}]/g, '').toString(),
              value: fieldValue ? fieldValue.value : fields.value,
            },
          ];
        }
      });
    }
    getPersonalizedMsgAction({ payload, channelType });
    toggleModal(false);
  };

  const handleFieldChangeValue = (field, event) => {
    if (channelType === CommonEnums.WHATSAPP) {
      setFieldValue(`personalisedParam.fieldsArray`, [
        ...values.personalisedParam.fieldsArray.map((fieldKey) =>
          field.key === fieldKey.key && field.type === fieldKey.type
            ? { ...fieldKey, value: event.target.value }
            : fieldKey
        ),
      ]);
    } else {
      setFieldValue(`personalisedParam.fieldsArray`, [
        ...values.personalisedParam.fieldsArray.map((fieldKey) =>
          field.key === fieldKey.key
            ? { ...fieldKey, value: event.target.value }
            : fieldKey
        ),
      ]);
    }
  };

  const acceptField = (field, isAccepted) => {
    if (channelType === CommonEnums.WHATSAPP) {
      setFieldValue(`personalisedParam.fieldsArray`, [
        ...values.personalisedParam.fieldsArray.map((fieldKey) =>
          field.key === fieldKey.key && field.type === fieldKey.type
            ? { ...fieldKey, isAccepted: !isAccepted }
            : fieldKey
        ),
      ]);
    } else {
      setFieldValue(`personalisedParam.fieldsArray`, [
        ...values.personalisedParam.fieldsArray.map((fieldKey) =>
          field.key === fieldKey.key
            ? { ...fieldKey, isAccepted: !isAccepted }
            : fieldKey
        ),
      ]);
    }
  };
  return (
    <>
      <Modal isOpen={modalOpen} toggle={closeForm} backdrop="static">
        {channelType === CommonEnums.SMS ? (
          <ModalHeader toggle={closeForm}>
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.LABEL.PERSONALISE_M0ODAL_HEADER_SMS" />
          </ModalHeader>
        ) : (
          <ModalHeader toggle={closeForm}>
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.LABEL.PERSONALISE_M0ODAL_HEADER_WHATSAPP" />
          </ModalHeader>
        )}

        <Form>
          <ModalBody>
            <FieldArray>
              {() => {
                return values.personalisedParam.fieldsArray.map(
                  (field, index) => {
                    return (
                      <div
                        className="p-0"
                        key={`${field.key}_${index.toString()}`}
                      >
                        <Row className="d-flex justify-content-between align-items-center">
                          <Colxx xxs="12" md="3" className="mb-3">
                            {field?.type && (
                              <div>{`${field?.type?.toUpperCase()}`}</div>
                            )}
                            <div>{`${field.key}`}</div>
                          </Colxx>
                          <Colxx xxs="12" md="6">
                            <FormGroupCoustom
                              type="select"
                              identifier={`${field.key}`}
                              value={field.value}
                              identifierLabel="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.USER_EVENTS"
                              options={getColAttributesDropDownValues(
                                colAttributesList
                              )}
                              onChange={(event) =>
                                handleFieldChangeValue(field, event)
                              }
                              required={true}
                              dataTestId="select-user-event"
                            />
                          </Colxx>
                          <Colxx xxs="12" md="3" className="mb-3">
                            <Button
                              color="tertiary"
                              onClick={() =>
                                acceptField(field, field.isAccepted)
                              }
                            >
                              {field.isAccepted ? (
                                <IntlMessages id="SMS_TEMPLATE_FORM.FORM.IGNORE" />
                              ) : (
                                <IntlMessages id="SMS_TEMPLATE_FORM.FORM.ACCEPT" />
                              )}
                            </Button>
                          </Colxx>
                        </Row>
                      </div>
                    );
                  }
                );
              }}
            </FieldArray>
          </ModalBody>

          <ModalFooter>
            <Button color="sButtonecondary" outline onClick={closeForm}>
              <IntlMessages id="SMS_TEMPLATE_FORM.FORM.CANCEL" />
            </Button>
            <Button color="primary" onClick={() => handleSubmit()}>
              <IntlMessages id="SMS_TEMPLATE_FORM.FORM.DONE" />
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
}

export default PersonalizeModal;
