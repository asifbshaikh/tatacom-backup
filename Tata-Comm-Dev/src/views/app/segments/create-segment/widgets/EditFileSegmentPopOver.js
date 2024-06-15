import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import IntlMessages from 'helpers/IntlMessages';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Alert,
  Button,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { getCategoryDropdownList } from 'redux/actions';
import {
  clearEditSegmentData,
  editFileSegment,
  getViewSegData,
} from 'redux/segmentation/actions';
import { injectIntl } from 'react-intl';
import { NotificationManager } from 'components/common/react-notifications';
import { useDropzone } from 'react-dropzone';
import SegmentationEnums from 'enums/segmentation/segmentationEnums';
import { currentUserID } from 'helpers/Utils';
import { IMPORTUSER_UPLOAD_FILE_CHARACTER_LENGTH } from 'constants/appConstant';

const EditFileSegmentPopOver = ({
  showEditFileSegment,
  setShowEditFileSegment,
  segmentId,
  getCategoryDropdownListAction,
  getViewSegDataAction,
  editFileSegmentAction,
  clearEditSegmentDataAction,
  loading,
  intl,
  errorMessage,
  formSuccess,
  successMessage,
  viewSegmentAllData,
  editSegmentErrorMessage,
}) => {
  const [showFile, setShowFile] = useState(true);
  const [csvFile, setCSVFile] = useState([]);
  const [csvFileError, setCSVFileError] = useState(false);
  const [editFileSegmentAlert, setEditFileSegmentAlert] = useState(false);
  const [isValidFileName, setIsValidFileName] = useState(true);
  const [isValidFileSize, setIsValidFileSize] = useState(true);

  const inputToggle = () => setShowEditFileSegment(!showEditFileSegment);
  const closeBtnForCustomSegment = (
    <button className="close" onClick={inputToggle} type="button">
      &times;
    </button>
  );

  const { messages } = intl;
  useEffect(() => {
    getCategoryDropdownListAction();
    getViewSegDataAction({ id: segmentId });
  }, []);

  const initialValues = {
    action: 'add_users',
    emailAddress: '',
    attribute: '',
    uploadOption: 'uploadFile',
  };

  const fileEditSegmentSchema = Yup.object().shape({
    emailAddress: Yup.string()
      .required(
        messages['ALL_SEGMENTS.EDIT_FILE_SEGMENT.VALIDATION.EMAIL_VALIDATION']
      )
      .test(
        messages['ALL_SEGMENTS.EDIT_FILE_SEGMENT.VALIDATION.VALID_EMAIL'],
        messages['ALL_SEGMENTS.EDIT_FILE_SEGMENT.VALIDATION.INVALID_EMAIL'],
        (value) => {
          if (typeof value === 'string') {
            const emailArray = value.split(',').map((email) => email.trim());
            return emailArray.every((email) =>
              Yup.string().email().isValidSync(email)
            );
          }
          return false;
        }
      ),
  });
  const onEditFileSegment = (values) => {
    const payload = {
      segment_id: segmentId,
      event_type: values.action,
      emails: values.emailAddress.split(','),
      account_user_id: currentUserID(),
    };
    const params = { file: csvFile[0], edit_file_data: payload };
    editFileSegmentAction(params);
    setEditFileSegmentAlert(true);
    return true;
  };

  useEffect(() => {
    if (editFileSegmentAlert) {
      if (formSuccess) {
        inputToggle();
        NotificationManager.success(
          successMessage,
          'Success',
          6000,
          null,
          null,
          ''
        );
      }
    }
  }, [formSuccess, editFileSegmentAlert]);

  if (errorMessage) {
    NotificationManager.error(
      editSegmentErrorMessage,
      'Error',
      6000,
      null,
      null,
      ''
    );
    clearEditSegmentDataAction({ editSegmentError: false });
  }

  const onDrop = (acceptedFiles) => {
    setCSVFile([...csvFile, ...acceptedFiles]);
    if (acceptedFiles.length !== 0) {
      setShowFile(false);
    }
  };

  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
  });

  const removeFile = () => {
    setCSVFile([]);
    setShowFile(true);
  };

  const files = csvFile.map((file) => (
    <div key={file.path}>
      {file.path} - {file.size} bytes{' '}
    </div>
  ));

  const rejectFile = fileRejections.map(({ file, errors }) => (
    <div key={file.path}>
      {errors.map((e) =>
        e.code === SegmentationEnums.FILE_INVALID_TYPE ? (
          <div key={e.code}>
            <IntlMessages id="ALL_SEGMENTS.EDIT_FILE_SEGMENT.TITLE.FILE_TYPE_ERROR" />
          </div>
        ) : (
          <div key={e.code}>{e.message}</div>
        )
      )}
    </div>
  ));

  useEffect(() => {
    if (rejectFile.length > 0) {
      setCSVFileError(true);
      setTimeout(() => {
        setCSVFileError(false);
      }, 4000);
    }
    if (csvFile.length > 0) {
      const fileName = csvFile[0].name;
      const specials = /[^A-Za-z 0-9)( ._-]/g;
      const res = specials.test(fileName);
      const fileNameLen =
        fileName.length > IMPORTUSER_UPLOAD_FILE_CHARACTER_LENGTH;
      if (csvFile.length >= 2) {
        setCSVFileError(false);
        setShowFile(true);
        removeFile();
      } else {
        setShowFile(false);
        if (fileNameLen) {
          setIsValidFileSize(false);
          removeFile();
        } else {
          setIsValidFileSize(true);
        }
        if (res) {
          setIsValidFileName(false);
          removeFile();
        } else {
          setIsValidFileName(true);
        }
      }
    }
  }, [csvFile]);

  const selectActions = [
    {
      id: 'add_users',
      value: 'ALL_SEGMENTS.EDIT_FILE_SEGMENT.SELECT_ACTION.ADD_USERS',
    },
    {
      id: 'remove_users',
      value: 'ALL_SEGMENTS.EDIT_FILE_SEGMENT.SELECT_ACTION.REMOVE_USERS',
    },
    {
      id: 'replace_users',
      value: 'ALL_SEGMENTS.EDIT_FILE_SEGMENT.SELECT_ACTION.REPLACE_USERS',
    },
  ];

  const selectUploadOption = [
    {
      id: 'uploadFile',
      label: 'ALL_SEGMENTS.EDIT_FILE_SEGMENT.TITLE.UPLOAD_FILE',
      value: 'uploadFile',
    },
  ];

  return (
    <div>
      <Modal isOpen={showEditFileSegment} toggle={inputToggle}>
        <ModalHeader toggle={inputToggle} close={closeBtnForCustomSegment}>
          <IntlMessages id="ALL_SEGMENTS.EDIT_FILE_SEGMENT.TITLE.EDIT_FILE" />
        </ModalHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={fileEditSegmentSchema}
          onSubmit={onEditFileSegment}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form>
              <ModalBody>
                <FormGroupCoustom
                  identifierLabel="ALL_SEGMENTS.EDIT_FILE_SEGMENT.TITLE.SELECT_ACTION"
                  identifier="action"
                  dataTestId="selectActionType"
                  type="select"
                  defaultValue="add_users"
                  value={values.action}
                  options={selectActions}
                  errors={errors}
                  touched={touched}
                />
                <FormGroup>
                  <Label htmlFor="attribute">
                    <IntlMessages id="ALL_SEGMENTS.EDIT_FILE_SEGMENT.TITLE.CSV_FILE" />
                    <span className="required-star-mark">{`*`}</span>
                  </Label>
                  <FormGroupCoustom
                    onChange={(event) =>
                      setFieldValue('uploadOption', event.target.value)
                    }
                    noLable
                    type="radioMulti"
                    radioMultiOptions={selectUploadOption}
                    value={values.uploadOption}
                    identifier="uploadOption"
                    className="select-audience"
                  />
                </FormGroup>

                <div className="upload-sections">
                  <div {...getRootProps()}>
                    <input
                      name="dropzone-upload-file"
                      data-testid="updoadCsvFile"
                      {...getInputProps()}
                    />
                    {showFile && (
                      <div className="drag-and-drop-edit-file">
                        <IntlMessages id="ALL_SEGMENTS.EDIT_FILE_SEGMENT.TITLE.DRAG_AND_DROP_CSV" />
                      </div>
                    )}
                  </div>

                  {!showFile && (
                    <div data-testid="files" className="file-name-edit-file">
                      {files}
                      <div
                        aria-hidden
                        className="remove"
                        onClick={removeFile}
                        data-testid="removeBtn"
                      >
                        (<i className="simple-icon-trash" />
                        <IntlMessages id="ALL_SEGMENTS.EDIT_FILE_SEGMENT.TITLE.REMOVE_CSV" />
                        )
                      </div>
                    </div>
                  )}
                </div>
                <div className="download-file">
                  <IntlMessages id="ALL_SEGMENTS.EDIT_FILE_SEGMENT.TITLE.DOWNLOAD_SAMPLE_FILE_NOTE" />
                  <a
                    className="download-file-link"
                    href={viewSegmentAllData.import_file_url}
                    download
                  >
                    &nbsp;
                    <IntlMessages id="ALL_SEGMENTS.EDIT_FILE_SEGMENT.TITLE.DOWNLOAD" />
                  </a>
                  <p>
                    <IntlMessages id="ALL_SEGMENTS.EDIT_FILE_SEGMENT.EDIT_NOTE.NOTE" />
                  </p>
                </div>
                {!isValidFileName && isValidFileSize && (
                  <Alert color="danger" className="rounded">
                    <IntlMessages id="IMPORT_USERS.ALERTS.INVALID_FILE_NAME" />
                  </Alert>
                )}
                {!isValidFileSize && isValidFileName && (
                  <Alert color="danger" className="rounded">
                    <IntlMessages id="IMPORT_USERS.ALERTS.INVALID_FILE_SIZE" />
                  </Alert>
                )}
                {!isValidFileSize && !isValidFileName && (
                  <Alert color="danger" className="rounded">
                    <div>
                      <IntlMessages id="IMPORT_USERS.ALERTS.INVALID_FILE_NAME" />
                    </div>

                    <div>
                      <IntlMessages id="IMPORT_USERS.ALERTS.INVALID_FILE_SIZE" />
                    </div>
                  </Alert>
                )}
                {csvFileError && (
                  <Alert color="danger" className="rounded ">
                    {rejectFile}
                  </Alert>
                )}
                <FormGroupCoustom
                  identifier="emailAddress"
                  type="textarea"
                  onChange={(event) =>
                    setFieldValue('emailAddress', event.target.value)
                  }
                  identifierLabel="ALL_SEGMENTS.EDIT_FILE_SEGMENT.TITLE.EMAIL_ADDRESS"
                  placeholder="ALL_SEGMENTS.EDIT_FILE_SEGMENT.PLACEHOLDER.EMAIL_ADDRESS_PLACEHOLDER"
                  errors={errors}
                  touched={touched}
                  required={true}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  onClick={() => {
                    inputToggle();
                  }}
                >
                  <IntlMessages id="ALL_SEGMENTS.EDIT_FILE_SEGMENT.BUTTON.CANCEL" />
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  className={`btn-shadow btn-multiple-state ${
                    loading ? 'show-spinner' : ''
                  }`}
                  disabled={csvFile.length === 0}
                >
                  <span className="spinner d-inline-block">
                    <span className="bounce1" />
                    <span className="bounce2" />
                    <span className="bounce3" />
                  </span>
                  <span
                    className={`${
                      csvFile.length === 0 ? 'disable-edit' : 'label'
                    }`}
                  >
                    {values.action === SegmentationEnums.ADD_USERS &&
                      messages[
                        'ALL_SEGMENTS.EDIT_FILE_SEGMENT.SELECT_ACTION.ADD_USERS'
                      ]}
                    {values.action === SegmentationEnums.REMOVE_USERS &&
                      messages[
                        'ALL_SEGMENTS.EDIT_FILE_SEGMENT.SELECT_ACTION.REMOVE_USERS'
                      ]}
                    {values.action === SegmentationEnums.REPLACE_USERS &&
                      messages[
                        'ALL_SEGMENTS.EDIT_FILE_SEGMENT.SELECT_ACTION.REPLACE_USERS'
                      ]}
                  </span>
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};
const mapStateToProps = ({ segmentationApp }) => {
  const {
    editSegmentError,
    editSegmentSuccess,
    successMessage,
    viewSegmentData,
    editSegmentErrorMessage,
  } = segmentationApp;
  return {
    errorMessage: editSegmentError,
    formSuccess: editSegmentSuccess,
    successMessage,
    viewSegmentAllData: viewSegmentData,
    editSegmentErrorMessage,
  };
};

export default connect(mapStateToProps, {
  getCategoryDropdownListAction: getCategoryDropdownList,
  editFileSegmentAction: editFileSegment,
  getViewSegDataAction: getViewSegData,
  clearEditSegmentDataAction: clearEditSegmentData,
})(injectIntl(EditFileSegmentPopOver));
