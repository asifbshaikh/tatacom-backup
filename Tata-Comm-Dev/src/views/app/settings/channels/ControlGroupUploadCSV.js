import { CONTROL_GROUP_UPLOAD_FILE_SIZE } from 'constants/appConstant';
import ImportUserEnums from 'enums/importUser/importUserEnums';
import IntlMessages from 'helpers/IntlMessages';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import { getImportUsersUploadData } from 'redux/actions';

const ControlGroupUploadCSV = ({
  getCVSFile,
  uploadedFile,
  getImportUsersUploadDataAction,
  csvFile,
}) => {
  const [showFile, setShowFile] = useState(true);
  const [csvFileError, setCSVFileError] = useState(false);
  const [isValidFileSize, setIsValidFileSize] = useState(true);
  useEffect(() => {
    if (csvFile.length === 0 || uploadedFile.length === 0) {
      getCVSFile([]);
      setShowFile(true);
    }
  }, [showFile]);
  const onDrop = (acceptedFiles) => {
    getCVSFile([...uploadedFile, ...acceptedFiles]);
    getImportUsersUploadDataAction({ csvFile: acceptedFiles });
  };
  const typeValidator = (file) => {
    if (file.size > CONTROL_GROUP_UPLOAD_FILE_SIZE * 1024 * 1024) {
      setCSVFileError(true);
      setTimeout(() => {
        setCSVFileError(false);
      }, 4000);

      return {
        code: ImportUserEnums.SIZE_LARGE,
        message: <IntlMessages id="CONTROL_GROUPS.FILE_SIZE_ERROR" />,
      };
    } else {
      setIsValidFileSize(false);
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
  useEffect(() => {
    if (rejectFile.length > 0) {
      setCSVFileError(true);
      setTimeout(() => {
        setCSVFileError(false);
      }, 4000);
    }

    if (uploadedFile.length > 0) {
      setShowFile(false);
    }
  }, [uploadedFile]);

  return (
    <div className="control-upload-container">
      <h2 color="muted font-weight-bold">
        <IntlMessages id="IMPORT_USERS.UPLOAD_CSV.UPLOAD" />
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
      <div className="download-sample-file pl-2 pt-2">
        <div>
          <IntlMessages id={'CONTROL_GROUPS.UPLOAD_MESSAGE_1'} />
        </div>
      </div>
      <div className="d-inline-flex pl-2 pb-4">
        <div>
          <IntlMessages id={'CONTROL_GROUPS.UPLOAD_MESSAGE_2'} />
        </div>
      </div>
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
})(ControlGroupUploadCSV);
