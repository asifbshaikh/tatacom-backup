import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import React from 'react';
import { Row } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import { getColAttributesDropDownValues } from 'helpers/campaignHelper';
// import Select from 'react-select';

// Code is commented as per requirement, we need this in future

const CampaignDetails = ({
  form,
  // campaignTagsOptions,
  setCampaignName,
  colAttributesList,
}) => {
  // const getDropDownValuesForCampaignTags = () => {
  //   const list = [];
  //   if (campaignTagsOptions.length > 0) {
  //     campaignTagsOptions.forEach((element) => {
  //       list.push({
  //         value: element.id,
  //         label: element.name,
  //       });
  //     });
  //   }
  //   return list;
  // };

  const hanldeCampaignNameOnChange = (event) => {
    setCampaignName(event.target.value);
    form.setFieldValue('campaignName', event.target.value);
  };

  const handleOnChangeUserAttributes = (event) => {
    form.setFieldValue('selectedUserAttribute', event.target.value);
  };

  return (
    <>
      <Row className="pl-3 pr-3">
        <Colxx xxs="12">
          <h2 className="font-weight-bold">
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.CAMPAIGN_INFO" />
          </h2>
        </Colxx>
      </Row>
      <Row className="p-4">
        <Colxx xxs="12" md="4">
          <FormGroupCoustom
            dataTestId="campaignNameField"
            identifierLabel="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.CAMPAIGN_NAME"
            placeholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.PLACEHOLDER.CAMPAIGN_NAME"
            identifier="campaignName"
            className="rounded-3"
            errors={form.errors}
            touched={form.touched}
            onChange={hanldeCampaignNameOnChange}
            value={form.values.campaignName}
            required={true}
          />
        </Colxx>
      </Row>

      <Row className="pl-4 pr-4">
        <Colxx xxs="12" md="4">
          <FormGroupCoustom
            dataTestId="userAttributeField"
            identifierLabel="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.USER_ATTRIBUTES"
            placeholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.PLACEHOLDER.USER_ATTRIBUTES"
            identifier="selectedUserAttribute"
            type="select"
            value={form.values.selectedUserAttribute}
            options={getColAttributesDropDownValues(colAttributesList)}
            onChange={handleOnChangeUserAttributes}
            errors={form.errors}
            touched={form.touched}
            required={true}
          />
        </Colxx>
      </Row>
      {/* <Row className='pl-4 pr-4'>
        <Colxx xxs="12" md="4">
          <FormGroup className="has-float-label">
            <Label htmlFor="campaignTags">
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.PLACEHOLDER.CAMPAIGN_TAGS" />
            </Label>
            <Select
              placeholder={<IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.PLACEHOLDER.CAMPAIGN_TAGS" />}
              onChange={(tags)=>form.setFieldValue("campaignTags",tags)}
              defaultValue={form.values.campaignTags}
              options={getDropDownValuesForCampaignTags()}
              isMulti
            />
          </FormGroup>
        </Colxx>
      </Row> */}
    </>
  );
};

export default injectIntl(CampaignDetails);
