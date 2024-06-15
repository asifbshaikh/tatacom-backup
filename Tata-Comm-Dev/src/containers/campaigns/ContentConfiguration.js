import React from 'react';
import IntlMessages from 'helpers/IntlMessages';
import { Row, CustomInput, Label } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';
import '../../assets/css/sass/views/campaign.scss';
import {
  checkPersonalizeMsg,
  convertTinyUrl,
  previewTinyUrl,
} from 'helpers/campaignHelper';
import CommonEnums from 'enums/commonEnums';
import PreviewContent from './PreviewContent';
import GroupedOptionsSelect from 'components/create-segment/GroupedOptionsSelect';
import colors from 'react-multi-date-picker/plugins/colors';

function ContentConfiguration({
  forms,
  channelType,
  getDropDownValuesForTemplates,
  handleOnChangeTemplateID,
  getPersonalizedMsgResetAction,
  setConvertedMsg,
  toggleModal,
  setPersoalizeFieldsArray,
  getTinyUrl,
  convertedTinyUrls,
  convertedPersonalizedMsg,
  senderLabelType,
  senderType,
  getDropDownValuesForSender,
  handleOnChangeSender,
  handleOnChangeMediaLink,
  setDefaultBtn,
  defaultBtn,
  getWAActionButton,
  msgFormat = [],
  campaignInfo,
  previewMessage,
}) {
  const handleOnchangeMessage = (event, form) => {
    form.setFieldValue('personalize', false);
    setDefaultBtn(true);
    form.setFieldValue('message', event.target.value);
    if (event.target.value?.length === 0) {
      form.setFieldValue('personalize', false);
      form.setFieldValue('tinyUrlConversion', false);
    }
    if (form.values?.message === event.target.value) {
      form.setFieldValue('templateCustomized', false);
    } else {
      form.setFieldValue('templateCustomized', true);
    }
  };

  const handleOnTinyUrlConversion = (event, form) => {
    form.setFieldValue('tinyUrlConversion', event.target.checked);
    form.setFieldValue('templateCustomized', true);
    if (event.target.checked) {
      convertTinyUrl(form.values?.message, getTinyUrl);
    }
  };
  const checkIfMsgPresent = (form) => {
    let msg = form.values.message;
    if (defaultBtn) {
      if (form.values.message?.length > 0) {
        if (form.values.tinyUrlConversion) {
          msg = previewTinyUrl(
            form.values.tinyUrlConversion,
            form.values.message,
            convertedTinyUrls
          );
        } else {
          msg = form.values.message;
        }
      } else {
        getPersonalizedMsgResetAction();
        msg = ContentConfigurationEnums.PREVIEW_MESSAGE;
      }
    } else {
      if (form.values.tinyUrlConversion) {
        msg = previewTinyUrl(
          form.values.tinyUrlConversion,
          form.values.message,
          convertedTinyUrls
        );
      }
      if (form.values.personalize) {
        msg = convertedPersonalizedMsg?.personalize_message?.length
          ? convertedPersonalizedMsg.personalize_message
          : msg;
        if (form.values.tinyUrlConversion) {
          msg = previewTinyUrl(
            form.values.tinyUrlConversion,
            msg,
            convertedTinyUrls
          );
        }
      }
      if (form.values.message?.length === 0) {
        msg = ContentConfigurationEnums.PREVIEW_MESSAGE;
      }
    }
    setConvertedMsg(
      previewTinyUrl(
        form.values.tinyUrlConversion,
        form.values.message,
        convertedTinyUrls
      )
    );
    return msg;
  };

  return (
    <>
      <Row className="pl-3 pr-3">
        <Colxx xxs="12">
          <h2 className="font-weight-bold">
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.LABEL.CONFIGURE_CONTENT" />
          </h2>
        </Colxx>
      </Row>
      <Row className="p-3 gx-5">
        <Colxx xxs="12" md="6">
          <Row>
            <Colxx xxs="12">
              <FormGroupCoustom
                dataTestId="sms-select-sender"
                identifierLabel={`CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.LABEL.${senderLabelType}`}
                placeholder={`CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.PLACEHOLDER.${senderLabelType}`}
                identifier="smsSender"
                type="select"
                value={forms.values[senderType]}
                options={getDropDownValuesForSender()}
                onChange={(event) => handleOnChangeSender(event, forms)}
                errors={forms.errors}
                touched={forms.touched}
                required={true}
              />
              {channelType === CommonEnums.WHATSAPP ? (
                <div className="has-float-label mb-3">
                  <Label htmlFor="templateRecordId">
                    <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.PLACEHOLDER.TEMPLATE" />
                    <span className="required-star-mark">{`*`}</span>
                  </Label>

                  <GroupedOptionsSelect
                    ariaLabel="templateList"
                    data={getDropDownValuesForTemplates.flat()}
                    optionIdentifier={{
                      label: 'label',
                      value: 'value',
                    }}
                    fieldLabel="templateRecordId"
                    groupedOptionsValue={forms.values}
                    handleOnChangeDropDown={(event) => {
                      handleOnChangeTemplateID(event, forms);
                    }}
                    handleOnBlur={() =>
                      forms.setFieldTouched('templateRecordId', true, false)
                    }
                  />
                </div>
              ) : (
                <FormGroupCoustom
                  dataTestId="sms-select-template"
                  identifierLabel="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.PLACEHOLDER.TEMPLATE"
                  placeholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.PLACEHOLDER.TEMPLATE"
                  identifier="templateRecordId"
                  type="select"
                  values={forms.values?.templateRecordId}
                  options={getDropDownValuesForTemplates()}
                  onChange={(event) => handleOnChangeTemplateID(event, forms)}
                  errors={forms.errors}
                  touched={forms.touched}
                  required={true}
                />
              )}
              {forms.values.category === ContentConfigurationEnums.WITH_MEDIA &&
                channelType === CommonEnums.WHATSAPP && (
                  <FormGroupCoustom
                    dataTestId="campaignNameField"
                    identifierLabel="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.PLACEHOLDER.MEDIA_LINK"
                    placeholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.PLACEHOLDER.MEDIA_LINK"
                    identifier="mediaLink"
                    className="rounded-3"
                    errors={forms.errors}
                    touched={forms.touched}
                    onChange={(event) => handleOnChangeMediaLink(event, forms)}
                    value={forms.values?.mediaLink}
                    required={true}
                  />
                )}
              <div>
                <FormGroupCoustom
                  dataTestId="sms-texarea"
                  identifier="message"
                  type="textarea"
                  value={forms.values?.message}
                  identifierLabel="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.LABEL.MESSAGE"
                  placeholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.PLACEHOLDER.MESSAGE"
                  onChange={(event) => {
                    handleOnchangeMessage(event, forms);
                  }}
                  errors={forms.errors}
                  touched={() => {
                    setDefaultBtn(true);
                    return forms.touched;
                  }}
                  className="content-message"
                  required={true}
                />
                <Row>
                  <Colxx xxs="12" md="6">
                    <CustomInput
                      type="checkbox"
                      id="personalize"
                      data-testid="personalize"
                      checked={forms.values?.personalize}
                      onChange={(event) => {
                        forms.setFieldValue(
                          'personalize',
                          event.target.checked
                        );
                        if (event.target.checked) {
                          checkPersonalizeMsg(
                            forms,
                            forms.values?.message,
                            setPersoalizeFieldsArray,
                            toggleModal,
                            channelType,
                            msgFormat
                          );
                        }
                      }}
                      label={
                        <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.LABEL.PERSONALISE" />
                      }
                    />
                    {forms.values.channelType === CommonEnums.WHATSAPP &&
                      forms.errors.personalize && (
                        <div className="text-color">
                          {forms.errors.personalize}
                        </div>
                      )}
                  </Colxx>
                  <Colxx xxs="12" md="6">
                    {channelType === CommonEnums.SMS ? (
                      <div className="text-right">{`${
                        forms.values?.message?.length
                      } character(s) ${
                        forms.values?.message?.length >
                        ContentConfigurationEnums.LIMIT_PER_MESSAGE
                          ? `${Math.ceil(
                              forms.values?.message?.length /
                                ContentConfigurationEnums.LIMIT_PER_MESSAGE
                            )} SMS`
                          : '1 SMS'
                      } `}</div>
                    ) : (
                      <div className="text-right">
                        {`${forms.values?.message?.length} `}
                        <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.CHARACTERS" />
                      </div>
                    )}
                  </Colxx>
                </Row>
              </div>
              {channelType === CommonEnums.SMS && (
                <div className="pt-4">
                  <CustomInput
                    type="checkbox"
                    id="tinyUrlConversion"
                    data-testid="tinyUrlConversion"
                    checked={forms.values?.tinyUrlConversion}
                    onChange={(event) =>
                      handleOnTinyUrlConversion(event, forms)
                    }
                    label={
                      <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.LABEL.TINY_URL" />
                    }
                  />
                  <div>
                    <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.DESC.SHORTEN_URL" />
                  </div>
                  <div className="tiny-url-desc">
                    <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.DESC.TINY_URL" />
                  </div>
                </div>
              )}
            </Colxx>
          </Row>
        </Colxx>

        <Colxx xxs="12" md="6" className="pl-5">
          <PreviewContent
            channelType={channelType}
            defaultBtn={defaultBtn}
            checkIfMsgPresent={checkIfMsgPresent}
            setDefaultBtn={setDefaultBtn}
            form={forms}
            actionButtons={getWAActionButton}
            campaignInfo={campaignInfo}
            previewMessage={previewMessage}
          />
        </Colxx>
      </Row>
    </>
  );
}

export default ContentConfiguration;
