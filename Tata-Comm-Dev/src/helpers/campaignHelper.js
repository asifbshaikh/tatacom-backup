import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import CommonEnums from 'enums/commonEnums';
import moment from 'moment';

export function getSendCampaignTimeValue(form, campaignType) {
  let label = '';
  if (
    form.values[campaignType].sendCampaignTime ===
    ScheduleAndGoalsEnums.AT_FIXED_TIME
  ) {
    label = ScheduleAndGoalsEnums.OBJECT_KEY_AT_FIXED_TIME;
  } else if (
    form.values[campaignType].sendCampaignTime ===
    ScheduleAndGoalsEnums.SEND_IN_USER_TIME_ZONE
  ) {
    label = ScheduleAndGoalsEnums.OBJECT_KEY_SEND_IN_USER_TIME_ZONE;
  } else {
    label = ScheduleAndGoalsEnums.OBJECT_KEY_BEST_TIME_FOR_USER;
  }
  return label;
}

export function getSendCampaignTimeValueBasedOnEvent(value) {
  let label = '';
  if (value === ScheduleAndGoalsEnums.AT_FIXED_TIME) {
    label = ScheduleAndGoalsEnums.OBJECT_KEY_AT_FIXED_TIME;
  } else if (value === ScheduleAndGoalsEnums.SEND_IN_USER_TIME_ZONE) {
    label = ScheduleAndGoalsEnums.OBJECT_KEY_SEND_IN_USER_TIME_ZONE;
  } else {
    label = ScheduleAndGoalsEnums.OBJECT_KEY_BEST_TIME_FOR_USER;
  }
  return label;
}

export function getOcurrenceType(form, campaignType) {
  let ocurrenceType = '';
  if (
    form.values[campaignType].sendCampaignType === ScheduleAndGoalsEnums.DAILY
  ) {
    ocurrenceType = ScheduleAndGoalsEnums.DAY;
  } else if (
    form.values[campaignType].sendCampaignType === ScheduleAndGoalsEnums.WEEKLY
  ) {
    ocurrenceType = ScheduleAndGoalsEnums.WEEK;
  } else {
    ocurrenceType = ScheduleAndGoalsEnums.MONTH;
  }
  return ocurrenceType;
}

export function getEndsFieldType(form, campaignType) {
  let field = '';
  if (
    form?.values[campaignType]?.[getSendCampaignTimeValue(form, campaignType)]
      ?.ends === ScheduleAndGoalsEnums.ON
  ) {
    field = ScheduleAndGoalsEnums.OBJECT_KEY_On;
  } else if (
    form?.values[campaignType]?.[getSendCampaignTimeValue(form, campaignType)]
      ?.ends === ScheduleAndGoalsEnums.AFTER
  ) {
    field = ScheduleAndGoalsEnums.OBJECT_KEY_After;
  } else {
    field = ScheduleAndGoalsEnums.NEVER;
  }
  return field;
}

export function getSendType(values, campaignType) {
  let sendCampaignType = '';
  if (
    values[campaignType].sendCampaignTime ===
    ScheduleAndGoalsEnums.AT_FIXED_TIME
  ) {
    sendCampaignType = ScheduleAndGoalsEnums.OBJECT_KEY_AT_FIXED_TIME;
  } else if (
    values[campaignType].sendCampaignTime ===
    ScheduleAndGoalsEnums.BEST_TIME_FOR_USER
  ) {
    sendCampaignType = ScheduleAndGoalsEnums.OBJECT_KEY_BEST_TIME_FOR_USER;
  } else {
    sendCampaignType = ScheduleAndGoalsEnums.OBJECT_KEY_SEND_IN_USER_TIME_ZONE;
  }
  return sendCampaignType;
}

export function getConvertedStringWithHyphen(text) {
  return text.replace(/_/g, '-').replace(/\b\w/g, (c) => c.toUpperCase());
}
export function getConvertedStringWithSpace(text) {
  return text
    ? text.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : '';
}

export function previewTinyUrl(
  tinyUrlConversionIsChecked,
  msg,
  convertedTinyUrls
) {
  let convertedMessage = msg;
  if (tinyUrlConversionIsChecked && Array.isArray(convertedTinyUrls)) {
    convertedTinyUrls.forEach((convertedUrl) => {
      convertedMessage = convertedMessage?.replace(
        convertedUrl.initialURL,
        convertedUrl.tinyUrl
      );
    });
  }
  return convertedMessage;
}

export function checkPersonalizeMsg(
  form,
  message,
  setPersoalizeFieldsArray,
  toggleModal,
  channelType = CommonEnums.SMS,
  msgBody = []
) {
  if (channelType === CommonEnums.WHATSAPP) {
    const fileds = msgBody.map((bodyType) => {
      const regex = /\{\{([^{}]+)\}\}/g;
      const personalizeFields = bodyType?.text?.match(regex);
      return personalizeFields?.length
        ? personalizeFields?.map((field) => {
            return {
              key: field.replace('{', '').replace('}', ''),
              type: bodyType.type.toLowerCase(),
              value: '',
              isAccepted: true,
              text: bodyType?.text,
            };
          })
        : [];
    });
    form.setFieldValue('personalisedParam', {
      fieldsArray: fileds.flat(),
    });
    toggleModal(true);
  } else {
    const regex = /\{\{([^{}]+)\}\}/g;
    const personalizeFields = message.match(regex);
    if (personalizeFields?.length) {
      let allFields = [];
      setPersoalizeFieldsArray(personalizeFields);
      allFields = personalizeFields.map((field) => {
        return {
          key: field.replace('{', '').replace('}', ''),
          value: '',
          isAccepted: true,
        };
      });
      form.setFieldValue('personalisedParam', {
        fieldsArray: allFields,
      });
      toggleModal(true);
    }
  }
}

export function convertTinyUrl(msg, getTinyUrl) {
  let urlArray = [];
  const regex = /https?:\/\/\S+(?:\s|$)/g;
  const matches = msg.match(regex);

  urlArray = matches ? matches.map((match) => match.trim()) : [];
  urlArray.forEach((url) => getTinyUrl(url));
}

export function getNumericValues(numericValue, initialValEmpty) {
  const options = [{ id: '', value: '', disabled: true }];
  for (let i = 1; i <= numericValue; i += 1) {
    options.push({ id: i, value: i });
  }
  if (initialValEmpty) {
    options.shift();
  }

  return options;
}

export function getCurrentGMTTimeZone(timeZoneString) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timeZoneString,
    timeZoneName: 'shortOffset',
  });
  return `(${formatter.format().slice(12, 21)})`;
}

export function getWhatsAppMessageFormat(component) {
  let constructMessage = '';
  if (component) {
    const header =
      component.find(
        (e) => e.type === ContentConfigurationEnums.WHATSAPP_HEADER
      ) ?? '';
    const body =
      component.find(
        (e) => e.type === ContentConfigurationEnums.WHATSAPP_BODY
      ) ?? '';
    const footer =
      component.find(
        (e) => e.type === ContentConfigurationEnums.WHATSAPP_FOOTER
      ) ?? '';
    constructMessage = `${header.text ?? ''} \n ${body.text ?? ''} \n ${
      footer.text ?? ''
    } `;
  }
  return constructMessage;
}

export function getColAttributesDropDownValues(colAttributesList) {
  const arr = [];
  arr.unshift({
    id: '',
    label: '',
    value: '',
    isdisabled: false,
  });
  Object.keys(colAttributesList).map((data) => {
    return arr.push({
      id: data,
      label: colAttributesList[data].name,
      value: data,
      isdisabled: false,
      type:
        colAttributesList[data].type !== ContentConfigurationEnums.INTEGER
          ? colAttributesList[data].type
          : ContentConfigurationEnums.NUMBER,
    });
  });
  return arr;
}

export const isFiltersValidForCampaign = (errors) => {
  return [
    createSegementEnums.INITIALVALUES.INCLUDED_FILTERS,
    createSegementEnums.INITIALVALUES.EXCLUDED_FILTERS,
  ].some((filter) => Object.keys(errors).includes(filter));
};

export function validateStartEndDate(startDate, endDate) {
  if (startDate && endDate) {
    return moment(startDate).unix() <= moment(endDate).unix();
  } else {
    return false;
  }
}

export function validateSelectedAndCurrentDateTime(date, time) {
  const current = new Date(moment().format('ddd MMM D YYYY HH:mm'));
  const selected = new Date(`${date} ${time}`);
  return moment(current).unix() <= moment(selected).unix();
}

export function checkType(link) {
  if (
    link?.endsWith('.png') ||
    link?.endsWith('.jpg') ||
    link?.endsWith('.jpeg')
  ) {
    return 'image';
  } else if (link?.endsWith('.pdf')) {
    return 'document';
  } else {
    return 'video';
  }
}

export function buttonTypeFlows(buttonList) {
  const flowBtnList = buttonList.filter(
    (btn) => btn.type === ContentConfigurationEnums.WHATSAPP_FLOW_BUTTONS
  );

  if (flowBtnList?.length > 0) {
    return true;
  } else {
    return false;
  }
}
