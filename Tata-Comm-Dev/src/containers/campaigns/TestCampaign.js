import React, { useEffect } from 'react';
import { Button, Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { connect } from 'react-redux';
import { getCustomSegmentList } from 'redux/segmentation/actions';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import IntlMessages from 'helpers/IntlMessages';
import CommonEnums from 'enums/commonEnums';
import {
  testEmailCampaignOptions,
  testSmsCampaignOptions,
} from '../../data/createCampaignData';
import '../../assets/css/sass/views/campaign.scss';
import ConversationEnums from 'enums/conversations/conversationEnums';
import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';
import { checkType, buttonTypeFlows } from 'helpers/campaignHelper';

function TestCampaign({
  channelType,
  convertedPersonalizedMsg,
  customSegmentationlist,
  getCustomSegmentListAction,
  convertedMsg,
  form,
  handleOnChangeUserAttribute,
  testCampaign,
  testEmailCampaignAction,
  subject,
  emailConnector,
  selectAudience,
  senderName,
  fromEmailAddress,
  replyToEmailAddress,
  emailTemplate,
  getWAActionButton,
}) {
  const getPlaceholders = (forms) => {
    const userAttribute = forms.values.testUserAttribute;
    if (userAttribute === CommonEnums.TEST_CAMPAIGN.MOBILE_NUMBER)
      return 'CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.PLACEHOLDER.MOBILE_NUMBER';
    if (userAttribute === CommonEnums.TEST_CAMPAIGN.EMAIL_ID)
      return 'CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.PLACEHOLDER.EMAIL_ID';
    if (userAttribute === CommonEnums.TEST_CAMPAIGN.CUSTOM_SEGMENT)
      return 'CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.PLACEHOLDER.CUSTOM_SEGMENT';

    return 'CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.PLACEHOLDER.UNIQUE_ID';
  };

  const smsTestCampaign = (forms, type) => {
    const { values } = forms;
    let params;
    if (type === CommonEnums.SMS) {
      params = {
        template_id: values.templateId,
        message: convertedMsg,
        sender_id: values.smsSender,
        personalise_mapping_attribute: convertedPersonalizedMsg
          ?.personalize_message?.length
          ? convertedPersonalizedMsg.personalise_mapping_attribute
          : {},
      };
    } else {
      params = {
        template_name: values.templateRecordId,
        message: convertedMsg,
        from_phone_number: values.smsSender,
        campaign_type: CommonEnums.WHATSAPP,
      };

      if (
        convertedPersonalizedMsg?.personalize_message?.length &&
        values.category === ContentConfigurationEnums.WITH_MEDIA
      ) {
        params['personalise_mapping_attribute'] = {
          ...convertedPersonalizedMsg.personalise_mapping_attribute,
          media_attribute: {
            type: ConversationEnums.HEADER,
            parameters: [
              {
                type: checkType(values.mediaLink),
                [checkType(values.mediaLink)]: {
                  link: values.mediaLink,
                },
              },
            ],
          },
        };
      } else if (convertedPersonalizedMsg?.personalize_message?.length) {
        params['personalise_mapping_attribute'] =
          convertedPersonalizedMsg.personalise_mapping_attribute;
      } else if (values.category === ContentConfigurationEnums.WITH_MEDIA) {
        params['personalise_mapping_attribute'] = {
          media_attribute: {
            type: ConversationEnums.HEADER,
            parameters: [
              {
                type: checkType(values.mediaLink),
                [checkType(values.mediaLink)]: {
                  link: values.mediaLink,
                },
              },
            ],
          },
        };
      } else {
        params['personalise_mapping_attribute'] = {};
      }

      if (buttonTypeFlows(getWAActionButton)) {
        params['personalise_mapping_attribute'] = {
          ...params['personalise_mapping_attribute'],
          flow_button: {
            type: 'button',
            sub_type: 'flow',
            index: '0',
          },
        };
      }
    }

    if (values.testUserAttribute === CommonEnums.TEST_CAMPAIGN.MOBILE_NUMBER) {
      params.selected_option =
        CommonEnums.TEST_CAMPAIGN.SELECTED_OPTIONS.MOBILE_NUMBER;
      params.phone_number = values.testUserValue;
    } else if (
      values.testUserAttribute === CommonEnums.TEST_CAMPAIGN.EMAIL_ID
    ) {
      params.selected_option =
        CommonEnums.TEST_CAMPAIGN.SELECTED_OPTIONS.EMAIL_ID;
      params.email = values.testUserValue;
    } else if (
      values.testUserAttribute === CommonEnums.TEST_CAMPAIGN.CUSTOM_SEGMENT
    ) {
      params.selected_option =
        CommonEnums.TEST_CAMPAIGN.SELECTED_OPTIONS.CUSTOM_SEGMENT;
      params.segment_id = values.testUserValue;
    } else {
      params.selected_option =
        CommonEnums.TEST_CAMPAIGN.SELECTED_OPTIONS.UNIQUE_ID;
      params.unique_id_value = values.testUserValue;
    }
    testCampaign(params);
  };

  const getDropDownValuesForCustomSegment = () => {
    const list = [];
    if (customSegmentationlist[0]?.length > 0) {
      list.unshift({
        id: '',
        value: '',
      });
      customSegmentationlist[0].forEach((element) => {
        list.push({
          id: element.id,
          value: element.name,
        });
      });
    }
    return list;
  };

  const covertEmailsToArray = (emailInput) => {
    const emailArray = emailInput.split(',').map((email) => email.trim());
    return emailArray;
  };

  const emailTestCampaign = (forms) => {
    const { values } = forms;
    let params;
    if (values.testUserAttribute === CommonEnums.TEST_CAMPAIGN.EMAIL_ID) {
      params = {
        subject,
        channel_email_id: parseInt(emailConnector, 10),
        sender_name: senderName,
        from_email_address: fromEmailAddress,
        reply_to_email_address: replyToEmailAddress,
        template_id: emailTemplate.id,
        selected_option: values?.testUserAttribute,
        emails: covertEmailsToArray(values.testUserValue),
        selected_contact_attribute: selectAudience.selectedUserAttribute,
      };
    } else if (
      values.testUserAttribute === CommonEnums.TEST_CAMPAIGN.CUSTOM_SEGMENT
    ) {
      params = {
        subject,
        channel_email_id: parseInt(emailConnector, 10),
        sender_name: senderName,
        from_email_address: fromEmailAddress,
        reply_to_email_address: replyToEmailAddress,
        template_id: emailTemplate.id,
        selected_option: values?.testUserAttribute,
        segment_id: values.testUserValue,
        selected_contact_attribute: selectAudience.selectedUserAttribute,
      };
    }
    testEmailCampaignAction(params);
  };

  const getOption = () => {
    let list = [];
    switch (channelType) {
      case CommonEnums.SMS:
        list = testSmsCampaignOptions;
        break;
      case CommonEnums.WHATSAPP:
        list = testSmsCampaignOptions;
        break;
      case CommonEnums.EMAIL:
        list = testEmailCampaignOptions;
        break;
      default:
        break;
    }
    return list;
  };

  useEffect(() => {
    getCustomSegmentListAction();
  }, []);

  const testCampaignSwitch = (forms) => {
    switch (channelType) {
      case CommonEnums.SMS:
        smsTestCampaign(forms, channelType);
        break;
      case CommonEnums.WHATSAPP:
        smsTestCampaign(forms, channelType);
        break;
      case CommonEnums.EMAIL:
        emailTestCampaign(forms);
        break;
      default:
        smsTestCampaign(forms);
        break;
    }
  };

  return (
    <>
      <Row className="pl-3 pr-3">
        <Colxx xxs="12">
          <h2 className="font-weight-bold">
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.LABEL.TEST_CAMPAIGN" />
          </h2>
        </Colxx>
      </Row>
      <Row className="p-3 gx-5">
        <Colxx xxs="4">
          <FormGroupCoustom
            dataTestId="test-custom-attribute"
            identifier="testUserAttribute"
            noLable
            type="select"
            options={getOption()}
            errors={form.errors}
            touched={form.touched}
            onChange={(event) => handleOnChangeUserAttribute(event, form)}
          />
        </Colxx>
        <Colxx xxs="4">
          <FormGroupCoustom
            identifier="testUserValue"
            noLable
            type={
              form.values.testUserAttribute ===
              CommonEnums.TEST_CAMPAIGN.SELECTED_OPTIONS.CUSTOM_SEGMENT
                ? 'select'
                : 'input'
            }
            options={getDropDownValuesForCustomSegment()}
            placeholder={getPlaceholders(form)}
            errors={form.errors}
            touched={form.touched}
            dataTestId="test-user-value"
          />
        </Colxx>
        <Colxx xxs="4">
          <Button
            name="test"
            type="button"
            color="primary"
            disabled={!form.isValid || !form.values.testUserValue}
            onClick={() => {
              testCampaignSwitch(form);
            }}
            data-testid="testBtn"
          >
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.BUTTON.TEST" />
          </Button>
        </Colxx>
      </Row>
    </>
  );
}

const mapStateToProps = ({ campaignsApp, segmentationApp }) => {
  const {
    createCampaign: { selectAudience },
    formEmailCreation: {
      subject,
      emailConnector,
      senderName,
      fromEmailAddress,
      replyToEmailAddress,
    },
    emailTemplate,
  } = campaignsApp;

  const { customSegmentationlist } = segmentationApp;
  return {
    selectAudience,
    customSegmentationlist,
    subject,
    emailConnector,
    senderName,
    fromEmailAddress,
    replyToEmailAddress,
    emailTemplate,
  };
};

export default connect(mapStateToProps, {
  getCustomSegmentListAction: getCustomSegmentList,
})(TestCampaign);
