import React from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Row } from 'reactstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { addCampaignCreateType, updateStepIndex } from 'redux/actions';
import { connect } from 'react-redux';
import CampaignCardType from './CampaignCardType';
import StepperNavigationButtons from './StepperNavigationButtons';

const campaignTypesList = [
  {
    type: 'one_time',
    label: <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.TYPES.ONE_TIME" />,
    icon: 'iconsminds-basket-coins',
  },
  {
    type: 'periodic',
    label: <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.TYPES.PERIODIC" />,
    icon: 'iconsminds-clock',
  },
  {
    type: 'event_trigger',
    label: <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.TYPES.EVENT_TRIGGERED" />,
    icon: 'simple-icon-event',
  },
];

const CampaignType = ({
  formRef,
  next,
  addCampaignType,
  campaignType,
  previous,
  stepIndex,
  updateStepIndexAction,
}) => {
  const initialValues = {
    campaignType: campaignType ?? '',
  };

  const validationSchema = Yup.object().shape({
    campaignType: Yup.string().required(),
  });

  const handlePreviousBtnClick = () => {
    updateStepIndexAction(stepIndex - 1);
    previous();
  };

  const handleSubmit = (values) => {
    addCampaignType({ ...values, stepIndex: stepIndex + 1 });
    updateStepIndexAction(stepIndex + 1);
    next();
  };
  return (
    <Formik
      initialValues={initialValues}
      innerRef={formRef}
      validationSchema={validationSchema}
      validateOnBlur
      validateOnChange
      validateOnMount
      onSubmit={handleSubmit}
    >
      {(form) => (
        <Form>
          <Row>
            <Colxx xxs="12">
              <h2 className="p-2 font-weight-bold">
                <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CAMPAIGN_TYPE.SELECT_CAMPAIGN_TYPE" />
              </h2>
            </Colxx>
          </Row>
          <Colxx xxs="12" className="pl-3 pr-3">
            {' '}
            <CampaignCardType
              cardsList={campaignTypesList}
              form={form}
              identifier="campaignType"
              className="campaign-type"
            />
          </Colxx>
          <StepperNavigationButtons
            className="m-2"
            leftBtnLabel={
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.PREVIOUS" />
            }
            handleLeftBtnClick={handlePreviousBtnClick}
            rightBtnLabel={
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.NEXT" />
            }
            handleRightBtnClick={form.handleSubmit}
            rightBtnLabelDisable={
              !form.isValid && !(Object.keys(form.errors) > 0)
            }
          />
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = ({ campaignsApp }) => {
  const {
    createCampaign: {
      selectAudience: { campaignType },
    },
    stepIndex,
  } = campaignsApp;
  return { campaignType, stepIndex };
};

export default connect(mapStateToProps, {
  addCampaignType: addCampaignCreateType,
  updateStepIndexAction: updateStepIndex,
})(CampaignType);
