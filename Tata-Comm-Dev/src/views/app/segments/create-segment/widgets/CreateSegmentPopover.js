import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import IntlMessages from 'helpers/IntlMessages';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
  userCountFilter,
  userCountFilterSegmentReset,
} from 'redux/segmentation/actions';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import {
  isExcludeUserSelected,
  removeEmptyPropertyFromJson,
} from 'data/segments/createSegmentFilterData';

const CreateSegmentPopover = ({
  createSegment,
  form,
  userCountFilterMethod,
  hideCreateButton = false,
  usersCount,
  type,
  segmentName,
  isFiltersValid,
  clearUserCount,
}) => {
  const [inputModal, setInputModal] = useState(false);
  const inputToggle = () => {
    setInputModal(!inputModal);
  };

  const closeBtnForCustomSegment = (
    <button className="close" onClick={inputToggle} type="button">
      &times;
    </button>
  );

  useEffect(() => {
    clearUserCount();
  }, []);

  const handleOnShowCountBtn = () => {
    let payload = {};
    if (form.values?.segmentId && segmentName) {
      payload = {
        segment_id: form.values?.segmentId,
        segment_name: segmentName,
        excluded_filters: form.values.exclude_users
          ? removeEmptyPropertyFromJson(form.values.excluded_filters)
          : {},
      };
    } else {
      payload = isExcludeUserSelected(form.values);
    }
    userCountFilterMethod(payload, () => {}, !hideCreateButton);
  };

  const initialValues = {
    campaignName:
      segmentName && type
        ? `${segmentName}  ${type === 'Duplicate' ? '-copy' : ''}` ?? ''
        : '',
  };
  const getFieldRequiredMessage = (message) => {
    return <IntlMessages id={message} />;
  };
  const segmentNameSchema = Yup.object().shape({
    campaignName: Yup.string()
      .required(getFieldRequiredMessage('forms.required-message'))
      .matches(
        /^[^*%]*$/,
        getFieldRequiredMessage('forms.required-message-name')
      ),
  });

  const submitSegment = (values) => {
    createSegment(values.campaignName, form);
    inputToggle();
    return true;
  };

  return (
    <div>
      {!hideCreateButton && (
        <>
          <Modal isOpen={inputModal} toggle={inputToggle}>
            <ModalHeader toggle={inputToggle} close={closeBtnForCustomSegment}>
              <IntlMessages id="CREATE_SEGMENT.LIST.CREATE_SEGMENT_HEADER" />
            </ModalHeader>
            <Formik
              initialValues={initialValues}
              validationSchema={segmentNameSchema}
              onSubmit={submitSegment}
            >
              {({ errors, touched }) => (
                <Form>
                  <ModalBody>
                    <div>
                      <FormGroupCoustom
                        dataTestId="enterSegmentName"
                        identifier="campaignName"
                        identifierLabel="CREATE_SEGMENT.ENTER_SEGMENT_NAME"
                        placeholder="CREATE_SEGMENT.ENTER_SEGMENT_NAME"
                        errors={errors}
                        touched={touched}
                        required={true}
                      />
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      data-testid="createFormSubmitBtn"
                      color="primary"
                      type="submit"
                    >
                      <span className="label">
                        {type === 'Edit' ? (
                          <IntlMessages id="CREATE_SEGMENT.BUTTONS.UPDATE_SEGMENT" />
                        ) : (
                          <IntlMessages id="CREATE_SEGMENT.BUTTONS.CREATE_SEGMENT" />
                        )}
                      </span>
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => {
                        inputToggle();
                      }}
                    >
                      <IntlMessages id="CREATE_SEGMENT.BUTTONS.CANCEL" />
                    </Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </Modal>
        </>
      )}
      <section className="d-flex align-items-center">
        {hideCreateButton && typeof usersCount === 'number' && (
          <h6 className="font-weight-bold mr-2">
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.CONTENT_CONFIG.LABEL.USERS_COUNT" />
            : {usersCount}
          </h6>
        )}
        {!hideCreateButton && (
          <Button
            data-testid="createSegmentPopUpBtn"
            onClick={inputToggle}
            className="dropdown-button mr-1"
          >
            {type === 'Duplicate' && (
              <IntlMessages id="CREATE_SEGMENT.BUTTONS.DUPLICATE_SEGMENT" />
            )}
            {type === 'Edit' && (
              <IntlMessages id="CREATE_SEGMENT.BUTTONS.UPDATE_SEGMENT" />
            )}
            {type !== 'Edit' && type !== 'Duplicate' && (
              <IntlMessages id="CREATE_SEGMENT.BUTTONS.CREATE_SEGMENT" />
            )}
          </Button>
        )}

        <Button
          className="count-button"
          onClick={handleOnShowCountBtn}
          type="button"
          disabled={isFiltersValid}
        >
          <IntlMessages id="CREATE_SEGMENT.BUTTONS.SHOW_COUNT" />
        </Button>
      </section>
    </div>
  );
};

const mapStateToProps = ({ segmentationApp }) => {
  const { listQueryResult, loadedSegmentation, successSegmentAdd, usersCount } =
    segmentationApp;
  return {
    listQueryResult,
    loadedSegmentation,
    successSegmentAdd,
    usersCount,
  };
};
export default connect(mapStateToProps, {
  userCountFilterMethod: userCountFilter,
  clearUserCount: userCountFilterSegmentReset,
})(CreateSegmentPopover);
