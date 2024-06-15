import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  addCampaignCreateType,
  clearCampaignOnTypeChange,
  updateStepIndex,
} from 'redux/actions';
import { connect } from 'react-redux';
import { userCountFilterSegmentReset } from 'redux/segmentation/actions';
import { useParams } from 'react-router-dom';
import CampaignCardType from './CampaignCardType';
import StepperNavigationButtons from './StepperNavigationButtons';
import '../../assets/css/sass/views/campaign.scss';
import { setCampaignChannelId } from 'redux/campaigns/actions';
import CommonEnums from 'enums/commonEnums';

const outBoundChannelList = [
  {
    type: 'sms',
    label: <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.MENU.SMS" />,
    icon: 'iconsminds-speach-bubble-dialog',
  },
  {
    type: 'whatsapp',
    label: <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.MENU.WHATSAPP" />,
    icon: 'simple-icon-bubbles',
  },
  {
    type: 'email',
    label: <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.MENU.EMAIL" />,
    icon: 'iconsminds-envelope',
  },
  {
    type: 'inApp',
    label: <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.MENU.IN_APP" />,
    icon: 'iconsminds-project',
  },
  // commented this as we are not using this feature now
  // {
  //   type: 'push',
  //   label: <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.MENU.PUSH" />,
  //   icon: 'iconsminds-smartphone-4',
  // },
];

function DiscardChangesModal({ open, onClose, onContinueClick }) {
  return (
    <>
      <Modal isOpen={open} onClosed={onClose}>
        <ModalHeader toggle={onClose}>
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.DISCARD_MODAL.MODAL_HEADER" />
        </ModalHeader>
        <ModalBody>
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.DISCARD_MODAL.MODAL_BODY" />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onContinueClick}>
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.DISCARD_MODAL.MODAL_FOOTER_YES" />
          </Button>{' '}
          <Button color="secondary" onClick={onClose}>
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.DISCARD_MODAL.MODAL_FOOTER_NO" />
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

const SelectChannelType = ({
  formRef,
  next,
  channelType,
  addChannelType,
  stepIndex,
  updateStepIndexAction,
  setCampaignChannelIdAction,
  clearOnChannelTypeChange,
  clearUserCount,
  push,
  stepId,
  steps,
  reschedule,
}) => {
  const initialValues = {
    channelType: channelType ?? '',
  };
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState(null);
  const { campaignID } = useParams();

  const handleSubmit = (values) => {
    if (channelType && channelType !== values.channelType) {
      setSelectedValues(values);
      setDiscardModalOpen(true);
    } else {
      addChannelType({ ...values, stepIndex: values.stepIndex + 1 });
      updateStepIndexAction(stepIndex + 1);
      next();
    }
    if (values.channelType === CommonEnums.SMS) {
      setCampaignChannelIdAction({
        channelType: CommonEnums.TATA_SMSC,
      });
    } else {
      setCampaignChannelIdAction({
        channelType: values.channelType,
      });
    }
  };

  useEffect(() => {
    if (steps?.[stepIndex]?.id) {
      push(steps[stepIndex].id);
    }
  }, [stepId]);

  const makeSchema = Yup.object({
    channelType: Yup.string().required(),
  });

  const toggleDiscardModal = () => {
    setDiscardModalOpen(false);
    setSelectedValues(null);
  };

  const onContinueDiscardChanges = () => {
    addChannelType({
      ...selectedValues,
      stepIndex: selectedValues.stepIndex + 1,
    });
    clearOnChannelTypeChange({ channelType: selectedValues.channelType });
    clearUserCount();
    updateStepIndexAction(stepIndex + 1);
    next();
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        innerRef={formRef}
        validationSchema={makeSchema}
        validateOnBlur
        validateOnChange
        enableReinitialize
        isValidating
        onSubmit={handleSubmit}
        validateOnMount
      >
        {(form) => (
          <Form>
            <Row>
              <Colxx xxs="12">
                <h2 className="p-2 font-weight-bold">
                  {' '}
                  <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CHANNEL_TYPE.SELECT_CHANNEL_TYPE" />
                </h2>
              </Colxx>
            </Row>
            <Colxx xxs="12" className="pl-3 pr-3">
              <CampaignCardType
                cardsList={outBoundChannelList}
                form={form}
                identifier="channelType"
                className="select-channel"
              />
            </Colxx>
            <StepperNavigationButtons
              className="m-2"
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
      <DiscardChangesModal
        open={discardModalOpen}
        onClose={toggleDiscardModal}
        onContinueClick={onContinueDiscardChanges}
      />
    </>
  );
};

const mapStateToProps = ({ campaignsApp }) => {
  const {
    successAdd,
    errorAdd,
    loadingAdd,
    createCampaign: {
      selectAudience: { channelType },
    },
    stepIndex,
    stepId,
  } = campaignsApp;
  return {
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
    channelType,
    stepIndex,
    stepId,
  };
};

export default connect(mapStateToProps, {
  addChannelType: addCampaignCreateType,
  updateStepIndexAction: updateStepIndex,
  clearOnChannelTypeChange: clearCampaignOnTypeChange,
  clearUserCount: userCountFilterSegmentReset,
  setCampaignChannelIdAction: setCampaignChannelId,
})(SelectChannelType);
