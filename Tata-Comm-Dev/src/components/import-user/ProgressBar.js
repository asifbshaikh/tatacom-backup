/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { Wizard, Steps, Step } from 'react-albus';
import { connect } from 'react-redux';
import IntlMessages from 'helpers/IntlMessages';
import TopNavigation from 'components/wizard/TopNavigation';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { adminRoot } from 'constants/defaultValues';
import {
  uploadImportUserCSVFile,
  uploadImportUserCSVFileClean,
  setSelectUser,
  getImportUsersUploadData,
} from 'redux/actions';
import ImportUserEnums from 'enums/importUser/importUserEnums';
import { NotificationManager } from 'components/common/react-notifications';
import {
  currentUserID,
  convertCSVFileDataToArray,
  checkForIdentifier,
} from 'helpers/Utils';
import MapUsers from './MapUsers';
import UploadCSV from './UploadCSV';
import SelectUserType from './SelectUserType';

function ProgressModal({ modal, toggle, handleBack }) {
  return (
    <>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          <IntlMessages id="IMPORT_USERS.MODAL.MODAL_HEADER" />
        </ModalHeader>
        <ModalBody>
          <IntlMessages id="IMPORT_USERS.MODAL.MODAL_BODY" />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleBack}>
            <IntlMessages id="IMPORT_USERS.MODAL.MODAL_FOOTER_BUTTON" />
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            <IntlMessages id="IMPORT_USERS.MODAL.MODAL_FOOTER_CANCEL" />
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

const ProgressBar = ({
  uploadImportUserCSVFileAction,
  uploadImportUserCSVFileCleanAction,
  setSelectUserAction,
  selectUser,
  skippedColumns,
  segmentName,
  updateExistingUsers,
  firstRowHeaders,
  colAttributeWithType,
  errorUpload,
  successUpload,
  loadingUpload,
  customAttributeName,
  getImportUsersUploadDataAction,
}) => {
  const [uploadedFile, setUploadedFile] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [modal, setModal] = useState(false);
  const headerKeys = Object.keys(Object.assign({}, ...csvData));
  const userDetails = csvData.slice(0, 3);
  const [invalid, setInvalid] = useState(false);
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(1);
  const [hasRequiredIdentifier, setHasRequiredIdentifier] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };

  const handleBack = (previous) => {
    switch (currentStep) {
      case 2:
        setUploadedFile([]);
        getImportUsersUploadDataAction({
          updateExistingUsers: false,
        });
        break;
      case 3:
        headerKeys.forEach(() => {
          getImportUsersUploadDataAction({
            checkColumnAttributes: {},
            skippedColumns: [],
            showSegmentName: '',
            segmentName: '',
          });
        });
        break;

      default:
        break;
    }
    setCurrentStep(currentStep - 1);
    previous();
    toggle();
  };

  const handleNextClick = (next) => {
    setCurrentStep(currentStep + 1);
    next();
  };

  const getCVSFile = (data) => {
    setUploadedFile(data);
  };

  useEffect(() => {
    if (uploadedFile[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const text = event.target;
        const fileData = convertCSVFileDataToArray(text.result);
        const filteredRows = fileData.filter((item) => {
          let valueExists = false;
          for (let iKey in item) {
            if (item[iKey]) {
              valueExists = true;
            }
          }
          return valueExists;
        });
        setCSVData(filteredRows);
      };

      fileReader.readAsText(uploadedFile[0]);
    }
  }, [uploadedFile[0]]);

  const createErrorNotification = ({ type, messageId }) => {
    NotificationManager.error(
      <IntlMessages id={messageId} />,
      type,
      6000,
      null,
      null,
      ''
    );
  };

  const handleFinishOnClick = () => {
    if (loadingUpload) {
      return;
    }

    const skippedColLength = skippedColumns.length;
    const colAttributeWithTypeKeys = Object.keys(colAttributeWithType).length;
    const headerKeysLength = headerKeys.length;

    if (
      (selectUser === ImportUserEnums.REGISTERED &&
        headerKeysLength !== skippedColLength + colAttributeWithTypeKeys) ||
      (selectUser === ImportUserEnums.ANONYMOUS &&
        headerKeysLength !== skippedColLength + colAttributeWithTypeKeys + 2)
    ) {
      createErrorNotification({
        type: 'Error',
        messageId: 'IMPORT_USERS.ERROR_MSG.VALIDATE_ATTRIBUTE_MAPPING',
      });
      return;
    }

    const payloadData = {
      user_type: selectUser.toLowerCase(),
      user_id: currentUserID(),
      file_name: uploadedFile[0].name,
      skipped_col: skippedColumns,
      custom_segment: segmentName,
      custom_attribute_name: customAttributeName,
      update_existing_user: updateExistingUsers,
      has_header: firstRowHeaders,
      identifier:
        selectUser === ImportUserEnums.REGISTERED
          ? 'customer_id'
          : 'email&phone_number',
      col_types: colAttributeWithType,
    };
    if (selectUser === ImportUserEnums.ANONYMOUS) {
      payloadData.col_types = {
        ...payloadData.col_types,
        0: { email: 'string' },
        1: { phone_number: 'string' },
      };
    }
    const params = { file: uploadedFile[0], import_user: payloadData };
    uploadImportUserCSVFileAction(params);
  };

  useEffect(() => {
    if (successUpload) {
      const successMsg = 'IMPORT_USERS.API_UPLOAD_MESSAGE.SUCCESS_MESSAGE';
      NotificationManager.success(
        <IntlMessages id={successMsg} />,
        'Success',
        6000,
        null,
        null,
        ''
      );
      uploadImportUserCSVFileCleanAction({});
      history.push(`${adminRoot}/segments/import-users/list`);
    }
  }, [successUpload]);

  useEffect(() => {
    if (errorUpload && errorUpload.errorMsg) {
      NotificationManager.error(
        <IntlMessages id={errorUpload.errorMsg} />,
        'Error',
        6000,
        null,
        null,
        ''
      );
    }
  }, [errorUpload]);

  useEffect(() => {
    if (
      uploadedFile.length > 0 &&
      firstRowHeaders &&
      headerKeys &&
      Object.keys(headerKeys).length > 0
    ) {
      let valid = false;
      if (selectUser === ImportUserEnums.REGISTERED) {
        valid =
          checkForIdentifier(['customer id', 'customer_id'], headerKeys) &&
          ['customer id', 'customer_id'].includes(
            headerKeys[0].toLocaleLowerCase()
          );
        if (!valid) {
          createErrorNotification({
            type: 'Error',
            messageId: 'IMPORT_USERS.ERROR_MSG.COLUMN_REQUIRED_CUSTOMER_ID',
          });
        }
      }
      if (selectUser === ImportUserEnums.ANONYMOUS) {
        valid =
          checkForIdentifier(['email'], headerKeys) &&
          checkForIdentifier(['phone number', 'phone_number'], headerKeys) &&
          ['email'].includes(headerKeys[0].toLocaleLowerCase()) &&
          ['phone number', 'phone_number'].includes(
            headerKeys[1].toLocaleLowerCase()
          );
        if (!valid) {
          createErrorNotification({
            type: 'Error',
            messageId: 'IMPORT_USERS.ERROR_MSG.COLUMN_REQUIRED_EMAIL_PHONE',
          });
        }
      }
      setHasRequiredIdentifier(valid);
    }
  }, [csvData]);

  return (
    <Card>
      <CardBody className="wizard wizard-default">
        <Wizard>
          <TopNavigation
            className="justify-content-center"
            disableNav={false}
          />
          <Steps>
            <Step
              id="1"
              name={<IntlMessages id="IMPORT_USERS.WIZARD.STEP-1" />}
            >
              {({ next }) => (
                <div className="wizard-basic-step">
                  <SelectUserType
                    selectUser={selectUser}
                    setSelectUser={setSelectUserAction}
                  />
                  <div className="wizard-buttons">
                    <Button
                      color="secondary"
                      onClick={() =>
                        history.push(`${adminRoot}/segments/import-users/list`)
                      }
                    >
                      <IntlMessages id="IMPORT_USERS.BUTTONS.PREVIOUS" />
                    </Button>
                    <Button
                      className="next-button"
                      onClick={() => handleNextClick(next)}
                      disabled={!selectUser}
                      color="primary"
                    >
                      <IntlMessages id="IMPORT_USERS.BUTTONS.NEXT" />
                    </Button>
                  </div>
                </div>
              )}
            </Step>
            <Step
              id="2"
              name={<IntlMessages id="IMPORT_USERS.WIZARD.STEP-2" />}
            >
              {({ next, previous }) => (
                <div className="wizard-basic-step">
                  <UploadCSV
                    getCVSFile={getCVSFile}
                    uploadedFile={uploadedFile}
                    headerKeys={headerKeys}
                  />
                  <div className="wizard-buttons">
                    <Button className="back-button" onClick={toggle}>
                      <IntlMessages id="IMPORT_USERS.BUTTONS.PREVIOUS" />
                    </Button>
                    <ProgressModal
                      modal={modal}
                      toggle={toggle}
                      handleBack={() => handleBack(previous)}
                    />
                    <Button
                      className="next-button"
                      onClick={() => handleNextClick(next)}
                      disabled={
                        uploadedFile.length === 0 ||
                        (!hasRequiredIdentifier && firstRowHeaders)
                      }
                      color="primary"
                    >
                      <IntlMessages id="IMPORT_USERS.BUTTONS.NEXT" />
                    </Button>
                  </div>
                </div>
              )}
            </Step>
            <Step
              id="3"
              name={<IntlMessages id="IMPORT_USERS.WIZARD.STEP-3" />}
            >
              {({ previous }) => (
                <div className="wizard-basic-step">
                  <MapUsers
                    headerKeys={headerKeys}
                    userDetails={userDetails}
                    selectUser={selectUser}
                    invalid={invalid}
                    setInvalid={setInvalid}
                  />
                  <div className="wizard-buttons">
                    <Button className="back-button" onClick={toggle}>
                      <IntlMessages id="IMPORT_USERS.BUTTONS.PREVIOUS" />
                    </Button>
                    <ProgressModal
                      modal={modal}
                      toggle={toggle}
                      handleBack={() => handleBack(previous)}
                    />
                    <Button
                      className="next-button"
                      onClick={handleFinishOnClick}
                      disabled={uploadedFile.length === 0 || invalid}
                      color="primary"
                    >
                      <IntlMessages id="IMPORT_USERS.BUTTONS.FINISH" />
                    </Button>
                  </div>
                </div>
              )}
            </Step>
          </Steps>
        </Wizard>
      </CardBody>
    </Card>
  );
};

const mapStateToProps = ({ importusersApp }) => {
  const {
    selectUser,
    skippedColumns,
    segmentName,
    updateExistingUsers,
    firstRowHeaders,
    colAttributeWithType,
    newCustomAttributes,
    errorUpload,
    successUpload,
    loadingUpload,
    customAttributeName,
  } = importusersApp;
  return {
    selectUser,
    skippedColumns,
    segmentName,
    updateExistingUsers,
    firstRowHeaders,
    colAttributeWithType,
    newCustomAttributes,
    errorUpload,
    successUpload,
    loadingUpload,
    customAttributeName,
  };
};

export default connect(mapStateToProps, {
  uploadImportUserCSVFileAction: uploadImportUserCSVFile,
  uploadImportUserCSVFileCleanAction: uploadImportUserCSVFileClean,
  setSelectUserAction: setSelectUser,
  getImportUsersUploadDataAction: getImportUsersUploadData,
})(ProgressBar);
