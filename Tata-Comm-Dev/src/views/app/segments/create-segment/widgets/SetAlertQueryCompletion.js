import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import IntlMessages from 'helpers/IntlMessages';
import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { segmentQueryRunAlert } from 'redux/segmentation/actions';
import { connect } from 'react-redux';

function SetAlertQueryCompletion({
  showAlert,
  setShowAlert,
  queryId,
  segmentQueryAlertAction,
  successAdd,
}) {
  const inputToggle = () => setShowAlert(!showAlert);
  const closeBtnForCustomSegment = (
    <button className="close" onClick={inputToggle} type="button">
      &times;
    </button>
  );
  const initialValues = {
    email: '',
  };
  const alertUserSchema = Yup.object().shape({
    email: Yup.string().email().required(),
  });

  const sendEmail = (values) => {
    const payload = {
      email: values.email,
      queryId,
    };
    segmentQueryAlertAction(payload);
    return true;
  };
  if (successAdd) {
    inputToggle();
  }
  return (
    <div>
      <Modal isOpen={showAlert} toggle={inputToggle}>
        <ModalHeader toggle={inputToggle} close={closeBtnForCustomSegment}>
          <IntlMessages id="CREATE_SEGMENT.EMAIL_ALERT" />
        </ModalHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={alertUserSchema}
          onSubmit={sendEmail}
        >
          {({ errors, touched }) => (
            <Form>
              <ModalBody>
                <FormGroupCoustom
                  identifier="email"
                  identifierLabel="CREATE_SEGMENT.EMAIL_ALERT_LABEL"
                  placeholder="CREATE_SEGMENT.EMAIL_ALERT_LABEL"
                  errors={errors}
                  touched={touched}
                  required={true}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit">
                  <IntlMessages id="CREATE_SEGMENT.BUTTONS.SEND_MAIL" />
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
    </div>
  );
}

const mapStateToProps = ({ segmentationApp }) => {
  const { successAdd } = segmentationApp;
  return { successAdd };
};
export default connect(mapStateToProps, {
  segmentQueryAlertAction: segmentQueryRunAlert,
})(SetAlertQueryCompletion);
