import {
  IMPORTUSER_UPLOAD_FILE_CHARACTER_LENGTH,
  IMPORTUSER_UPLOAD_FILE_SIZE,
} from 'constants/appConstant';
import ImportUserEnums from 'enums/importUser/importUserEnums';
import IntlMessages from 'helpers/IntlMessages';
import { checkForIdentifier } from 'helpers/Utils';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { connect } from 'react-redux';
import { Alert, CustomInput, Tooltip } from 'reactstrap';
import { getImportUsersUploadData } from 'redux/actions';

const UploadCSV = ({
  getCVSFile,
  uploadedFile,
  headerKeys,
  getImportUsersUploadDataAction,
  firstRowHeaders,
  updateExistingUsers,
  csvFile,
  selectUser,
}) => {
  const [showFile, setShowFile] = useState(true);
  const [isValidFileName, setIsValidFileName] = useState(true);
  const [csvFileError, setCSVFileError] = useState(false);
  const [isValidFileSize, setIsValidFileSize] = useState(true);
  const [hasNotHeader, setHasNotHeader] = useState(true);
  const [toolTipOpen, setToolTipOpen] = useState(false);
  const [toolTipUpdateUser, setToolTipUpdateUser] = useState(false);

  useEffect(() => {
    if (csvFile.length === 0 || uploadedFile.length === 0) {
      getCVSFile([]);
      setShowFile(true);
      setHasNotHeader(true);
    }
  }, [showFile]);

  const onDrop = (acceptedFiles) => {
    getCVSFile([...uploadedFile, ...acceptedFiles]);
    getImportUsersUploadDataAction({ csvFile: acceptedFiles });
    getImportUsersUploadDataAction({
      skippedColumns: [],
      colAttributeWithType: {},
      newCustomAttributes: [],
      columnAttributeOptions: [],
      checkColumnAttributes: [],
      selectedColumnType: [],
      customAttributeName: [],
      segmentName: '',
      showSegmentName: false,
    });
  };

  const typeValidator = (file) => {
    if (file.size > IMPORTUSER_UPLOAD_FILE_SIZE * 1024 * 1024) {
      setCSVFileError(true);
      setTimeout(() => {
        setCSVFileError(false);
      }, 4000);

      return {
        code: 'size-too-large',
        message: <IntlMessages id="IMPORT_USERS.ERROR_MSG.FILE_SIZE_ERROR" />,
      };
    }
    return null;
  };

  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    onDrop,
    validator: typeValidator,
    accept: {
      'text/csv': ['.csv'],
    },
  });

  const removeFile = () => {
    getCVSFile([]);
    setShowFile(true);
    setHasNotHeader(true);
    getImportUsersUploadDataAction({ csvFile: [] });
  };

  const files = uploadedFile.map((file) => (
    <div key={file.path}>
      {file.path} - {file.size} bytes{' '}
    </div>
  ));

  const rejectFile = fileRejections.map(({ file, errors }) => (
    <div key={file.path}>
      {errors.map((e) =>
        e.code === ImportUserEnums.FILE_INVALID_TYPE ? (
          <div key={e.code}>
            <IntlMessages id="IMPORT_USERS.ERROR_MSG.FILE_TYPE_ERROR" />
          </div>
        ) : (
          <div key={e.code}>{e.message}</div>
        )
      )}
    </div>
  ));

  const checkFirstRow = () => {
    getImportUsersUploadDataAction({
      firstRowHeaders: !firstRowHeaders,
    });
  };

  const checkUpdateUsers = () => {
    getImportUsersUploadDataAction({
      updateExistingUsers: !updateExistingUsers,
    });
  };

  const toggleTooltipDownloadSample = () => {
    setToolTipOpen(!toolTipOpen);
  };

  useEffect(() => {
    if (rejectFile.length > 0) {
      setCSVFileError(true);
      setTimeout(() => {
        setCSVFileError(false);
      }, 4000);
    }

    if (uploadedFile.length > 0) {
      const fileName = uploadedFile[0].name;
      const specials = /[^A-Za-z 0-9)( ._-]/g;
      const res = specials.test(fileName);
      const fileNameLen =
        fileName.length > IMPORTUSER_UPLOAD_FILE_CHARACTER_LENGTH;

      if (csvFile.length === 0) {
        setShowFile(true);
      }
      if (uploadedFile.length >= 2) {
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

        if (!fileNameLen) {
          const hasIdentifier = checkForIdentifier(
            [
              'customer id',
              'customer_id',
              'email',
              'phone',
              'phone number',
              'phone_number',
              'moblie',
              'mobile_number',
              'mobile number',
            ],
            headerKeys
          );
          if (hasIdentifier) {
            setHasNotHeader(true);
          } else {
            setHasNotHeader(false);
            setTimeout(() => {
              setHasNotHeader(true);
            }, 5000);
          }
        }
      }
    }
  }, [uploadedFile, headerKeys]);

  const toggleTooltipUpdateUsers = () => {
    setToolTipUpdateUser(!toolTipUpdateUser);
  };

  return (
    <div className="upload-container">
      <h2>
        <b>
          <IntlMessages id="IMPORT_USERS.UPLOAD_CSV.UPLOAD" />
        </b>
      </h2>
      <div data-testid="ondrop" className="section">
        <div {...getRootProps()}>
          <input
            name="dropzone-upload-file"
            data-testid="uploadCsv"
            {...getInputProps()}
          />
          {showFile && (
            <div className="drag-and-drop">
              <IntlMessages id="IMPORT_USERS.UPLOAD_CSV.DRAG_AND_DROP_CSV" />
            </div>
          )}
        </div>
        <div>
          {!showFile && (
            <div data-testid="files" className="file-name">
              {files}
              <div
                aria-hidden
                className="remove"
                data-testid="removeCsv"
                onClick={removeFile}
              >
                (<i className="simple-icon-trash" />
                <IntlMessages id="IMPORT_USERS.UPLOAD_CSV.REMOVE_CSV" />)
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="download-sample-file">
        <CustomInput
          id="check-columns"
          name="check-columns"
          type="checkbox"
          data-testid="check-headers"
          defaultChecked={firstRowHeaders}
          onChange={checkFirstRow}
          label={<IntlMessages id="IMPORT_USERS.CHECKBOXES.CHECK_FIRST_ROW" />}
        />
        {selectUser === ImportUserEnums.REGISTERED && (
          <>
            <a
              id="TooltipExample"
              className="csv-file-link"
              href="/assets/sample/RegisteredAudience.csv"
              download
            >
              <IntlMessages id="IMPORT_USERS.SAMPLE_CSV.DOWNLOAD_SAMPLE_CSV" />
            </a>
            <Tooltip
              placement="left"
              isOpen={toolTipOpen}
              target="TooltipExample"
              toggle={toggleTooltipDownloadSample}
            >
              <IntlMessages id="IMPORT_USERS.SAMPLE_CSV.DOWNLOAD_SAMPLE_CSV_TOOLTIP" />
            </Tooltip>
          </>
        )}
        {selectUser === ImportUserEnums.ANONYMOUS && (
          <>
            <a
              id="TooltipExample"
              className="csv-file-link"
              href="/assets/sample/AnonymousAudience.csv"
              download
            >
              <IntlMessages id="IMPORT_USERS.SAMPLE_CSV.DOWNLOAD_SAMPLE_CSV" />
            </a>
            <Tooltip
              placement="left"
              isOpen={toolTipOpen}
              target="TooltipExample"
              toggle={toggleTooltipDownloadSample}
            >
              <IntlMessages id="IMPORT_USERS.SAMPLE_CSV.DOWNLOAD_SAMPLE_CSV_TOOLTIP" />
            </Tooltip>
          </>
        )}
      </div>
      <div className="d-inline-flex">
        <CustomInput
          id="update-users"
          name="update-users"
          type="checkbox"
          data-testid="check-update-users"
          defaultChecked={updateExistingUsers}
          onChange={checkUpdateUsers}
          label={<IntlMessages id="IMPORT_USERS.CHECKBOXES.UPDATE_USERS" />}
        />
        <i className="simple-icon-info mt-2 ml-2" id="updateUserInfo" />
        <Tooltip
          placement="bottom"
          isOpen={toolTipUpdateUser}
          target="updateUserInfo"
          toggle={toggleTooltipUpdateUsers}
        >
          <IntlMessages id="IMPORT_USERS.CHECKBOXES.UPDATE_USERS_TOOLTIP" />
        </Tooltip>
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
      {!hasNotHeader && firstRowHeaders && (
        <Alert color="danger" className="rounded">
          <IntlMessages id="IMPORT_USERS.ALERTS.HAS_NOT_HEADER" />
        </Alert>
      )}
      {csvFileError && (
        <Alert color="danger" className="rounded ">
          {rejectFile}
        </Alert>
      )}
    </div>
  );
};

const mapStateToProps = ({ importusersApp }) => {
  const {
    firstRowHeaders,
    updateExistingUsers,
    csvFile,
    skippedColumns,
    selectUser,
  } = importusersApp;
  return {
    firstRowHeaders,
    updateExistingUsers,
    csvFile,
    skippedColumns,
    selectUser,
  };
};

export default connect(mapStateToProps, {
  getImportUsersUploadDataAction: getImportUsersUploadData,
})(UploadCSV);
