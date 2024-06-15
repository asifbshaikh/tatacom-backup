import React from 'react';
import { Card, CardTitle, CustomInput } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { getImportUsersUploadData } from 'redux/actions';
import { connect } from 'react-redux';

function SelectUserType({
  setSelectUser,
  selectUser,
  getImportUsersUploadDataAction,
}) {
  const handleUserSelection = (cardId) => {
    setSelectUser(cardId);
    getImportUsersUploadDataAction({ csvFile: [] });
  };
  return (
    <div>
      <h2>
        <b>
          <IntlMessages id="IMPORT_USERS.SELECTION_OF_USER.DESCRIPTION" />
        </b>
      </h2>
      <br />
      <Card
        data-testid="Registered"
        body
        className={`user-selection ${
          selectUser === 'Registered' ? 'user-selected' : ''
        }`}
        onClick={() => handleUserSelection('Registered')}
      >
        <CustomInput
          type="radio"
          id="Registered"
          value="Registered"
          checked={selectUser === 'Registered'}
          onChange={() => handleUserSelection('Registered')}
          className="custom-radio-button"
        />
        <CardTitle
          tag="h5"
          className={`user-selection-title ${
            selectUser === 'Registered' ? 'color-title' : ''
          }`}
        >
          <IntlMessages id="IMPORT_USERS.REGISTERED.USER" />
        </CardTitle>
        <b>
          <IntlMessages id="IMPORT_USERS.REGISTERED.USE-CASE" />
        </b>
        <p>
          <IntlMessages id="IMPORT_USERS.REGISTERED.USE-CASE_DESCRIPTION" />
        </p>
        <b>
          <IntlMessages id="IMPORT_USERS.REGISTERED.PREREQUISITE" />
        </b>
        <p>
          <IntlMessages id="IMPORT_USERS.REGISTERED.PREREQUISITE_DESCRIPTION" />
        </p>
      </Card>
      <br />
      <Card
        data-testid="Anonymous"
        body
        className={`user-selection ${
          selectUser === 'Anonymous' ? 'user-selected' : ''
        }`}
        onClick={() => handleUserSelection('Anonymous')}
      >
        <CustomInput
          type="radio"
          id="Anonymous"
          value="Anonymous"
          checked={selectUser === 'Anonymous'}
          className="custom-radio-button"
        />
        <CardTitle
          tag="h5"
          className={`user-selection-title ${
            selectUser === 'Anonymous' ? 'color-title' : ''
          }`}
        >
          <IntlMessages id="IMPORT_USERS.ANONYMOUS.USER" />
        </CardTitle>
        <b>
          <IntlMessages id="IMPORT_USERS.ANONYMOUS.USE-CASE" />
        </b>
        <p>
          <IntlMessages id="IMPORT_USERS.ANONYMOUS.USE-CASE_DESCRIPTION" />
        </p>
        <b>
          <IntlMessages id="IMPORT_USERS.ANONYMOUS.PREREQUISITE" />
        </b>
        <p>
          <IntlMessages id="IMPORT_USERS.ANONYMOUS.PREREQUISITE_DESCRIPTION" />
        </p>
      </Card>
    </div>
  );
}
const mapStateToProps = ({ importusersApp }) => {
  const { csvFile } = importusersApp;
  return {
    csvFile,
  };
};

export default connect(mapStateToProps, {
  getImportUsersUploadDataAction: getImportUsersUploadData,
})(SelectUserType);
