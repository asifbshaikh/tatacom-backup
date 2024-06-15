import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  CardBody,
  Label,
  Alert,
  FormGroup,
  Button,
  CustomInput,
  Card,
  InputGroupAddon,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { NotificationManager } from 'components/common/react-notifications';
import Select from 'react-select';
import IntlMessages from 'helpers/IntlMessages';
import {
  getAttributesContactItem,
  addAttributesContactItem,
  addAttributesContactItemClean,
  deleteAttributesContactItem,
  deleteAttributesContactItemClean,
} from 'redux/actions';
import { adminRoot } from 'constants/defaultValues';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import {
  DATE_FORMAT_WITHOUT_TIME,
  DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY,
} from 'constants/appConstant';
import Datetime from 'react-datetime';
import moment from 'moment';
import {
  addAttributesConversationItem,
  addAttributesConversationItemClean,
} from 'redux/inbox/actions';
import { injectIntl } from 'react-intl';
import ConversationEnums from 'enums/conversations/conversationEnums';

const ContactAttributes = ({
  contactId,
  loaded,
  attributes,
  getAttributesContactItemAction,
  addAttributesContactItemAction,
  addAttributesContactItemCleanAction,
  customAttributes,
  formSuccess,
  formError,
  deleteAttributesContactItemAction,
  deleteAttributesContactItemCleanAction,
  formSuccessDelete,
  attributeType = 'contact_attribute',
  conversationId,
  addAttributesConversationItemAction,
  errorConversationAttributes,
  successConversationAttributes,
  addAttributesConversationItemCleanAction,
  intl,
}) => {
  /* eslint-disable no-useless-escape */
  const urlValidateRegExp =
    /(http(s)?:\/\/.)+(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  const { messages } = intl;
  const { CHECKBOX, LINK, LIST, DATE, TEXT, NUMBER } =
    ConversationEnums.FILTER_KEYS;
  const attributesSelectionFormRef = useRef(null);
  const [activeAttribute, setActiveAttribute] = useState([]);
  const [lastEditedAttribute, setLastEditedAttribute] = useState(null);
  const [copied, setCopied] = useState(false);
  const saveAttributes = (payload) => {
    if (attributeType == 'contact_attribute') {
      addAttributesContactItemAction({
        custom_attributes: payload,
        contact_id: contactId,
        id: contactId,
      });
    } else {
      addAttributesConversationItemAction({
        custom_attributes: payload,
        conversationId,
      });
    }
  };

  const getPayloadData = (additionalKey, additionalValue) => {
    const newPayload = {
      ...customAttributes,
      [additionalKey]: additionalValue,
    };
    return newPayload;
  };

  const onChangeLabel = (selectedOption) => {
    if (!loaded) {
      return false;
    }
    const attrKey = selectedOption.value;
    const attributeData = attributes.find(
      (item) => item.attribute_key === attrKey
    );
    if (
      attributeData &&
      [TEXT, NUMBER, LINK, DATE].includes(attributeData.attribute_display_type)
    ) {
      setActiveAttribute([...activeAttribute, attrKey]);
    }
    setLastEditedAttribute(attrKey);
    const attrValue =
      typeof customAttributes[attrKey] !== 'undefined'
        ? customAttributes[attrKey]
        : null;
    const payload = getPayloadData(attrKey, attrValue);
    saveAttributes(payload, contactId);
    return true;
  };

  useEffect(() => {
    const attributeLength = activeAttribute.length;
    const selectedElement =
      attributeLength > 0
        ? document.querySelector(
            `#${attributeType} [name=${activeAttribute[attributeLength - 1]}]`
          )
        : null;
    const selectedDateInput =
      attributeLength > 0
        ? document.querySelector(
            `#${attributeType} #${activeAttribute[attributeLength - 1]} input`
          )
        : null;
    if (selectedElement || selectedDateInput) {
      setTimeout(() => {
        if (selectedElement?.focus) {
          selectedElement.focus();
        }
        if (selectedDateInput?.focus) {
          selectedDateInput.focus();
        }
      }, [200]);
    }
  }, [customAttributes, activeAttribute]);
  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(false);
  };
  useEffect(() => {
    if (formSuccess) {
      if (
        lastEditedAttribute &&
        activeAttribute.includes(lastEditedAttribute) &&
        customAttributes[lastEditedAttribute] !== null
      ) {
        const updatedActiveAttributes = activeAttribute.slice();
        updatedActiveAttributes.splice(
          activeAttribute.indexOf(lastEditedAttribute),
          1
        );
        setActiveAttribute(updatedActiveAttributes);
      }
      attributesSelectionFormRef.current.setFieldValue('reactSelectAttrs', '');
      addAttributesContactItemCleanAction({});
      NotificationManager.success(
        <IntlMessages id={'CUSTOM_ATTRIBUTES.ALERT_MESSAGES.SAVE_SUCCESS'} />,
        'Success',
        6000,
        null,
        null,
        ''
      );
    }
  }, [formSuccess]);

  useEffect(() => {
    if (successConversationAttributes) {
      if (
        lastEditedAttribute &&
        activeAttribute.includes(lastEditedAttribute) &&
        customAttributes[lastEditedAttribute] !== null
      ) {
        const updatedActiveAttributes = activeAttribute.slice();
        updatedActiveAttributes.splice(
          activeAttribute.indexOf(lastEditedAttribute),
          1
        );
        setActiveAttribute(updatedActiveAttributes);
      }
      attributesSelectionFormRef.current.setFieldValue('reactSelectAttrs', '');
      addAttributesConversationItemCleanAction({});
      NotificationManager.success(
        <IntlMessages id={'CUSTOM_ATTRIBUTES.ALERT_MESSAGES.SAVE_SUCCESS'} />,
        'Success',
        6000,
        null,
        null,
        ''
      );
    }
  }, [successConversationAttributes]);

  const handleSearchIconClick = (value, key) => {
    const payload = getPayloadData(key, value);
    saveAttributes(payload, contactId);
    setLastEditedAttribute(key);
    if ([TEXT, NUMBER, LINK].includes(key)) {
      setActiveAttribute([...activeAttribute, key]);
    }
  };

  const handleDeleteIconClick = (key) => {
    setLastEditedAttribute(key);
    if (attributeType == 'contact_attribute') {
      deleteAttributesContactItemAction({
        custom_attributes: [key],
        contact_id: contactId,
      });
    } else {
      const updatedPayload = {
        ...customAttributes,
      };

      delete updatedPayload[key];
      addAttributesConversationItemAction({
        custom_attributes: updatedPayload,
        conversationId,
      });
    }
  };
  useEffect(() => {
    if (formSuccessDelete) {
      if (
        lastEditedAttribute &&
        activeAttribute.includes(lastEditedAttribute) &&
        customAttributes[lastEditedAttribute] !== null
      ) {
        const updatedActiveAttributes = activeAttribute.slice();
        updatedActiveAttributes.splice(
          activeAttribute.indexOf(lastEditedAttribute),
          1
        );
        setActiveAttribute(updatedActiveAttributes);
        setLastEditedAttribute(null);
      }
      deleteAttributesContactItemCleanAction({});
      NotificationManager.success(
        <IntlMessages id={'CUSTOM_ATTRIBUTES.ALERT_MESSAGES.SAVE_SUCCESS'} />,
        'Success',
        6000,
        null,
        null,
        ''
      );
    }
  }, [formSuccessDelete]);

  useEffect(() => {
    getAttributesContactItemAction();
  }, []);
  const initialValues = {
    reactSelectAttrs: '',
  };

  const findAttributeByKey = (key) => {
    return attributes.find((item) => item.attribute_key === key);
  };

  const copyToClipBoard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return loaded ? (
    <>
      <CardBody className="pt-4 pb-0" id={attributeType}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          innerRef={attributesSelectionFormRef}
        >
          {({ setFieldValue, setFieldTouched, values, errors, touched }) => (
            <Form className="av-tooltip tooltip-label-right">
              <div className="mb-2">
                <NavLink
                  className="c-pointer badge badge-primary badge-pill"
                  to={`${adminRoot}/settings/attributes/list`}
                >
                  <IntlMessages id="CUSTOM_ATTRIBUTES.ADD_NEW_ATTRIBUTE" />
                </NavLink>
              </div>
              <FormGroup className="error-l-100">
                <Label>
                  <IntlMessages id="contacts.add_attributes" />
                </Label>
                <Select
                  name="reactSelectAttrs"
                  className="react-select"
                  classNamePrefix="react-select"
                  placeholder={
                    messages['contacts.search_attributes_placeholder']
                  }
                  options={attributes
                    .filter(
                      (item) =>
                        item.attribute_model === attributeType &&
                        !Object.keys(customAttributes).includes(
                          item.attribute_key
                        )
                    )
                    .map((val) => {
                      return {
                        value: val.attribute_key,
                        label: val.attribute_display_name,
                      };
                    })}
                  value={values.reactSelectAttrs}
                  onBlur={setFieldTouched}
                  onChange={(val) => {
                    if (val) {
                      setFieldValue('reactSelectAttrs', val);
                      onChangeLabel(val);
                    }
                  }}
                />
                <div className="my-4">
                  {formError && formError.errorMsg && (
                    <Alert color="danger" className="rounded">
                      {formError.errorMsg}
                    </Alert>
                  )}
                  {errorConversationAttributes &&
                    errorConversationAttributes.errorMsg && (
                      <Alert color="danger" className="rounded">
                        {errorConversationAttributes.errorMsg}
                      </Alert>
                    )}
                  {errors.reactSelectAttrs && touched.reactSelectAttrs ? (
                    <div className="invalid-feedback d-block">
                      {errors.reactSelectAttrs}
                    </div>
                  ) : null}
                </div>
              </FormGroup>
            </Form>
          )}
        </Formik>
        {Object.keys(customAttributes).map(function (key) {
          const selectedAttribute = findAttributeByKey(key);
          const dropdownOptions =
            selectedAttribute?.attribute_values &&
            Array.isArray(selectedAttribute.attribute_values)
              ? selectedAttribute.attribute_values.map((item) => ({
                  id: item,
                  value: item,
                }))
              : [];
          dropdownOptions.unshift({
            id: '',
            value:
              messages[
                'CUSTOM_ATTRIBUTES.FORM.ATTRIBUTE_TYPE.LIST.PLACEHOLDER'
              ],
          });
          let attributeFormSchema = Yup.object().shape({});
          if (
            [TEXT, NUMBER].includes(selectedAttribute?.attribute_display_type)
          ) {
            attributeFormSchema = Yup.object().shape({
              [key]: Yup.string()
                .transform((value, original) =>
                  original === null ? '' : value
                )
                .required(
                  messages['CUSTOM_ATTRIBUTES.VALIDATIONS.FIELD_REQUIRED']
                ),
            });
          }
          if (selectedAttribute?.attribute_display_type === LINK) {
            attributeFormSchema = Yup.object().shape({
              [key]: Yup.string()
                .matches(
                  urlValidateRegExp,
                  messages['CUSTOM_ATTRIBUTES.VALIDATIONS.URL_INVALID']
                )
                .transform((value, original) =>
                  original === null ? '' : value
                )
                .required(
                  messages['CUSTOM_ATTRIBUTES.VALIDATIONS.FIELD_REQUIRED']
                ),
            });
          }
          if (selectedAttribute?.attribute_display_type === DATE) {
            attributeFormSchema = Yup.object().shape({
              [key]: Yup.string()
                .transform((value, original) =>
                  original === null ? '' : value
                )
                .required(
                  messages['CUSTOM_ATTRIBUTES.VALIDATIONS.FIELD_REQUIRED']
                ),
            });
          }

          if ([LIST].includes(selectedAttribute?.attribute_display_type)) {
            attributeFormSchema = Yup.object().shape({
              [key]: Yup.string()
                .transform((value, original) =>
                  original === null ? '' : value
                )
                .required(
                  messages['CUSTOM_ATTRIBUTES.VALIDATIONS.FIELD_REQUIRED']
                ),
            });
          }

          return (
            <Card key={key} className="bg-white rounded-0 border-bottom">
              <div className="d-flex flex-row">
                <div className="pl-3 pr-2 w-100">
                  <div className="font-weight-medium mb-0">
                    {selectedAttribute?.attribute_display_type &&
                    [TEXT, LINK, NUMBER, DATE, LIST].includes(
                      selectedAttribute?.attribute_display_type
                    ) ? (
                      <>
                        <div className="mt-2 d-flex">
                          <div className="flex-grow-1 text-break">
                            {selectedAttribute?.attribute_display_name ?? '--'}
                          </div>
                          <div className="p-1">
                            <span
                              className="badge de-badge-primary p-1"
                              tabIndex="0"
                              role="button"
                              onClick={() => handleDeleteIconClick(key)}
                            >
                              <i className="simple-icon-trash" />
                            </span>
                          </div>
                        </div>
                        {selectedAttribute.attribute_display_type &&
                        [TEXT, LINK, NUMBER, DATE].includes(
                          selectedAttribute.attribute_display_type
                        ) ? (
                          <div
                            className="mb-1 d-flex1 flex-row mx-0"
                            style={{
                              display: activeAttribute.includes(key)
                                ? 'none'
                                : 'block',
                            }}
                          >
                            <div className="border-0 d-flex w-100">
                              <div className="flex-grow-1 text-break">
                                {selectedAttribute?.attribute_display_type ===
                                  DATE && customAttributes[key] ? (
                                  moment(customAttributes?.[key]).format(
                                    DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY
                                  )
                                ) : customAttributes[key] ? (
                                  selectedAttribute?.attribute_display_type ===
                                    LINK && customAttributes[key] ? (
                                    <a
                                      href={customAttributes[key]}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="create-event"
                                    >
                                      {customAttributes[key]}
                                    </a>
                                  ) : (
                                    customAttributes[key]
                                  )
                                ) : (
                                  '---'
                                )}
                              </div>
                              <div className="p-1">
                                <span
                                  className="badge de-badge-primary p-1"
                                  tabIndex="0"
                                  role="button"
                                  onClick={() => {
                                    if (
                                      selectedAttribute?.attribute_display_type ===
                                        DATE &&
                                      customAttributes[key]
                                    ) {
                                      copyToClipBoard(
                                        moment(customAttributes?.[key]).format(
                                          DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY
                                        )
                                      );
                                    } else {
                                      copyToClipBoard(
                                        customAttributes[key] ?? ''
                                      );
                                    }
                                  }}
                                >
                                  <i className="iconsminds-file-clipboard" />
                                </span>
                              </div>
                              <div className="p-1">
                                <span
                                  className="badge de-badge-primary p-1"
                                  tabIndex="0"
                                  role="button"
                                  onClick={() => {
                                    setActiveAttribute([
                                      ...activeAttribute,
                                      key,
                                    ]);
                                  }}
                                >
                                  <i className="simple-icon-pencil" />
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                    <Formik
                      initialValues={customAttributes}
                      validateOnBlur
                      validateOnChange
                      validationSchema={attributeFormSchema}
                    >
                      {({
                        setFieldValue,
                        values,
                        errors,
                        touched,
                        isValid,
                        setTouched,
                      }) => (
                        <Form
                          className="mb-1"
                          style={{
                            display:
                              activeAttribute.includes(key) ||
                              (selectedAttribute?.attribute_display_type &&
                                [CHECKBOX, LIST].includes(
                                  selectedAttribute?.attribute_display_type
                                ))
                                ? 'block'
                                : 'none',
                          }}
                        >
                          {selectedAttribute?.attribute_display_type &&
                          [TEXT, LINK, NUMBER].includes(
                            selectedAttribute?.attribute_display_type
                          ) ? (
                            <FormGroupCoustom
                              identifier={key}
                              type={
                                selectedAttribute?.attribute_display_type ===
                                NUMBER
                                  ? 'number'
                                  : 'text'
                              }
                              errors={errors}
                              touched={touched}
                              value={values[key]}
                              onChange={(e) => {
                                setFieldValue(key, e.target.value);
                              }}
                              onKeyPress={(e) => {
                                if (e.key === ConversationEnums.ENTER) {
                                  handleSearchIconClick(values[key], key);
                                }
                              }}
                              append={
                                <Button
                                  type="button"
                                  color="primary"
                                  className="btn btn-primary px-2 rounded-0"
                                  onClick={() => {
                                    if (!isValid || !touched[key]) {
                                      setTouched({ ...touched, [key]: true });
                                      return;
                                    }
                                    handleSearchIconClick(values[key], key);
                                  }}
                                >
                                  <i className="iconsminds-yes" />
                                </Button>
                              }
                            ></FormGroupCoustom>
                          ) : null}
                          {selectedAttribute?.attribute_display_type ===
                          LIST ? (
                            <FormGroupCoustom
                              identifier={key}
                              noLable
                              type="select"
                              options={dropdownOptions}
                              errors={errors}
                              touched={touched}
                              value={values[key] || ''}
                              onChange={(e) => {
                                setFieldValue(key, e.target.value);
                                if (e.target.value) {
                                  handleSearchIconClick(e.target.value, key);
                                }
                              }}
                            ></FormGroupCoustom>
                          ) : null}
                          {selectedAttribute?.attribute_display_type ===
                          CHECKBOX ? (
                            <>
                              <div className="py-2 d-flex w-100 align-content-center">
                                <CustomInput
                                  className="flex-grow-1"
                                  type="checkbox"
                                  name={key}
                                  onChange={(e) => {
                                    setFieldValue(key, e.target.checked);
                                    handleSearchIconClick(
                                      e.target.checked,
                                      key
                                    );
                                  }}
                                  checked={values[key]}
                                  label={
                                    selectedAttribute?.attribute_display_name
                                  }
                                />
                                <div className="p-1">
                                  <span
                                    className="badge de-badge-primary p-1"
                                    tabIndex="0"
                                    role="button"
                                    onClick={() => handleDeleteIconClick(key)}
                                  >
                                    <i className="simple-icon-trash" />
                                  </span>
                                </div>
                              </div>
                            </>
                          ) : null}
                          {selectedAttribute?.attribute_display_type ===
                          DATE ? (
                            <>
                              <div className="d-flex w-100 align-content-center">
                                <FormGroup
                                  className="form-group input-group flex-nowrap"
                                  id={key}
                                >
                                  <Datetime
                                    dateFormat={
                                      DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY
                                    }
                                    initialValue={
                                      customAttributes?.[key]
                                        ? moment(
                                            customAttributes?.[key]
                                          ).format(
                                            DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY
                                          )
                                        : moment().format(
                                            DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY
                                          )
                                    }
                                    timeFormat={false}
                                    onChange={(date) => {
                                      if (
                                        moment(date).format() === 'Invalid date'
                                      ) {
                                        setFieldValue(key, '');
                                      } else {
                                        const formatedDate = moment(
                                          date
                                        ).format(DATE_FORMAT_WITHOUT_TIME);
                                        setFieldValue(key, formatedDate);
                                      }
                                    }}
                                    closeOnSelect
                                  />
                                  <InputGroupAddon addonType="append">
                                    {
                                      <Button
                                        type="button"
                                        color="primary"
                                        className="btn btn-primary px-2 py-1 rounded-0"
                                        onClick={() => {
                                          if (!isValid) {
                                            setTouched({
                                              ...touched,
                                              [key]: true,
                                            });
                                            return;
                                          }
                                          handleSearchIconClick(
                                            values[key] ||
                                              moment().format(
                                                DATE_FORMAT_WITHOUT_TIME
                                              ),
                                            key
                                          );
                                        }}
                                      >
                                        <i className="iconsminds-yes" />
                                      </Button>
                                    }
                                  </InputGroupAddon>
                                  {errors?.[key] && (
                                    <div className="invalid-feedback d-block w-30">
                                      <span>{errors[key]}</span>
                                    </div>
                                  )}
                                </FormGroup>
                              </div>
                            </>
                          ) : null}
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </CardBody>
      {copied && (
        <Alert className="alert-style">
          <IntlMessages id="COMMON_ALERTS.COPIED_TO_CLIPBOARD" />
        </Alert>
      )}
    </>
  ) : (
    <div className="loading" />
  );
};

const mapStateToProps = ({ contactsApp, inboxApp }) => {
  const {
    loadedAttributes,
    attributes,
    successAttributes,
    errorAttributes,
    loadingAttributes,
    successAttributesDelete,
  } = contactsApp;
  const {
    errorConversationAttributes,
    successConversationAttributes,
    loadingConversationAttributes,
  } = inboxApp;

  return {
    loaded: loadedAttributes,
    attributes,
    formSuccess: successAttributes,
    formError: errorAttributes,
    formLoading: loadingAttributes,
    formSuccessDelete: successAttributesDelete,
    errorConversationAttributes,
    successConversationAttributes,
    loadingConversationAttributes,
  };
};
export default connect(mapStateToProps, {
  getAttributesContactItemAction: getAttributesContactItem,
  addAttributesContactItemAction: addAttributesContactItem,
  addAttributesContactItemCleanAction: addAttributesContactItemClean,
  deleteAttributesContactItemAction: deleteAttributesContactItem,
  deleteAttributesContactItemCleanAction: deleteAttributesContactItemClean,
  addAttributesConversationItemAction: addAttributesConversationItem,
  addAttributesConversationItemCleanAction: addAttributesConversationItemClean,
})(injectIntl(ContactAttributes));
