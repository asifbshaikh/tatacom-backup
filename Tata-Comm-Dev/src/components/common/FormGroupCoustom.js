import React from 'react';
import { injectIntl } from 'react-intl';
import 'react-tagsinput/react-tagsinput.css';
import Datetime from 'react-datetime';

import {
  Label,
  FormText,
  FormGroup,
  InputGroupAddon,
  Input,
  CustomInput,
} from 'reactstrap';

import { Field } from 'formik';

import IntlMessages from 'helpers/IntlMessages';
import { TagsInput } from 'react-tag-input-component';
import CommonEnums from 'enums/commonEnums';

const FormGroupCoustom = ({
  className,
  identifier,
  identifierLabel,
  identifierIP,
  errors,
  touched,
  type,
  help,
  value,
  append,
  prepend,
  onChange,
  onKeyPress,
  onKeyUp,
  onBlur,
  onFocus,
  radioMultiOptions,
  intl,
  lablePre,
  noLable,
  placeholder,
  dataTestId,
  options,
  disabled,
  fieldWithoutGroup,
  minNumberValue = '',
  required = false,
  customPlaceholder = '',
}) => {
  const { messages: messagesIntl } = intl;

  const identifierPrefixVal = lablePre ? `${lablePre}.` : 'contacts.';
  const identifierLabelIntl =
    identifierLabel || `${identifierPrefixVal}${identifier}`;
  const identifierIPName = identifierIP || identifier;
  const extraParams = {
    name: identifierIPName,
    placeholder: customPlaceholder
      ? customPlaceholder
      : placeholder
      ? messagesIntl[placeholder]
      : '',
    disabled,
  };
  if (value) {
    extraParams.value = value;
  }
  if (onChange) {
    extraParams.onChange = onChange;
  }
  if (onKeyPress) {
    extraParams.onKeyPress = onKeyPress;
  }
  if (onKeyUp) {
    extraParams.onKeyDown = onKeyUp;
  }
  if (onFocus) {
    extraParams.onFocus = onFocus;
  }
  if (onBlur) {
    extraParams.onBlur = onBlur;
  }
  let normalField = true;
  let handleChange = () => {};
  if (type) {
    extraParams.type = type;
    if (type === CommonEnums.FORM_GROUP_CUSTOM.TEXTAREA) {
      extraParams.as = type;
      extraParams.value = value;
    }
    if (type === CommonEnums.FORM_GROUP_CUSTOM.SELECT) {
      extraParams.as = type;
      normalField = false;
    }
    if (
      type === CommonEnums.FORM_GROUP_CUSTOM.RADIO_MULTI ||
      type === CommonEnums.FORM_GROUP_CUSTOM.CHECKBOX_MULTI
    ) {
      normalField = false;
    }
    if (type === CommonEnums.FORM_GROUP_CUSTOM.FILE) {
      normalField = false;
    }
    if (type === CommonEnums.FORM_GROUP_CUSTOM.IMAGE) {
      normalField = false;
    }
    if (type === CommonEnums.FORM_GROUP_CUSTOM.DATE) {
      normalField = false;
    }
    if (type === CommonEnums.FORM_GROUP_CUSTOM.TAG) {
      normalField = false;
      handleChange = (val) => {
        onBlur(identifierIPName, true);
        onChange(identifierIPName, val);
      };
    }
    if (type === CommonEnums.FORM_GROUP_CUSTOM.NUMBER) {
      extraParams.min = minNumberValue;
    }
  }
  let floatLblClass = 'has-float-label';
  if (
    type === CommonEnums.FORM_GROUP_CUSTOM.RADIO_MULTI ||
    type === CommonEnums.FORM_GROUP_CUSTOM.CHECKBOX_MULTI
  ) {
    floatLblClass = '';
  }

  if (fieldWithoutGroup && normalField) {
    return (
      <Input className={className} data-testid={dataTestId} {...extraParams} />
    );
  }

  return (
    <FormGroup
      className={`form-group ${
        !prepend && !append ? floatLblClass : 'mb3 input-group'
      } ${className}`}
    >
      {!prepend && !append && !noLable && (
        <Label>
          <IntlMessages id={identifierLabelIntl} />
          {required && <span className="required-star-mark">{`*`}</span>}
        </Label>
      )}
      {prepend && (
        <InputGroupAddon addonType="prepend">{prepend}</InputGroupAddon>
      )}
      {type === CommonEnums.FORM_GROUP_CUSTOM.FILE && (
        <Input name={identifierIPName} type="file" onChange={onChange} />
      )}
      {type === CommonEnums.FORM_GROUP_CUSTOM.IMAGE && (
        <Input
          name={identifierIPName}
          accept="image/*"
          type="file"
          onChange={onChange}
        />
      )}
      {(type === CommonEnums.FORM_GROUP_CUSTOM.RADIO_MULTI ||
        type === CommonEnums.FORM_GROUP_CUSTOM.CHECKBOX_MULTI) &&
        radioMultiOptions &&
        radioMultiOptions.map((option) => {
          const checkdValueObj = { checked: false };
          if (value) {
            if (typeof value === 'object') {
              if (
                value.indexOf(option.id) > -1 ||
                value.indexOf(option.value) > -1
              ) {
                checkdValueObj.checked = true;
              }
            } else if (value === option.value) {
              checkdValueObj.checked = true;
            }
          }
          return (
            <CustomInput
              key={`option_${option.id}`}
              data-testid={option.id}
              type={
                type === CommonEnums.FORM_GROUP_CUSTOM.RADIO_MULTI
                  ? 'radio'
                  : 'checkbox'
              }
              id={option.id}
              name={identifier}
              label={messagesIntl[option.label] || option.label}
              value={option.value}
              onChange={onChange}
              {...checkdValueObj}
            />
          );
        })}
      {type === CommonEnums.FORM_GROUP_CUSTOM.TAG && (
        <TagsInput
          name={identifierIPName}
          value={value}
          onChange={handleChange}
          placeHolder={extraParams?.placeholder || ''}
        />
      )}
      {type === CommonEnums.FORM_GROUP_CUSTOM.SELECT && (
        <Field
          className="form-control"
          data-testid={dataTestId}
          {...extraParams}
        >
          {options.map((option) => {
            const extraParamsOpt = {};
            if (value) {
              if (value === option.value) {
                extraParamsOpt.selected = true;
              }
            }
            return (
              <option
                key={`option_id_${option.id}`}
                disabled={option.disabled ?? false}
                value={option.id}
                id={option.value}
                {...extraParamsOpt}
              >
                {!option.value && option.option}
                {typeof messagesIntl[option.value] !== 'undefined'
                  ? messagesIntl[option.value]
                  : option.value}
              </option>
            );
          })}
        </Field>
      )}
      {type === CommonEnums.FORM_GROUP_CUSTOM.DATE && (
        <Datetime
          name={identifierIPName}
          value={value}
          dateFormat
          input
          data-testid={dataTestId}
          onChange={handleChange}
          timeFormat={false}
          placeholder={<IntlMessages id={placeholder} />}
          closeOnSelect
          {...extraParams}
        />
      )}
      {normalField && (
        <Field
          className="form-control"
          // validate={true}
          data-testid={dataTestId}
          {...extraParams}
        />
      )}
      {append && <InputGroupAddon addonType="append">{append}</InputGroupAddon>}
      {help && (
        <FormText color="muted">
          <IntlMessages id={help} />
        </FormText>
      )}
      {errors && errors[identifierIPName] && touched[identifierIPName] && (
        <div className="invalid-feedback d-block">
          {errors[identifierIPName]}
        </div>
      )}
    </FormGroup>
  );
};
export default injectIntl(FormGroupCoustom);
