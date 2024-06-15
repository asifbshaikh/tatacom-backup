import React, { useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import IntlMessages from 'helpers/IntlMessages';
import ToggleSwitch from './ToggleSwitch';
import ControlCard from './ControlCard';
import { connect } from 'react-redux';
import {
  createControlGroups,
  createControlGroupsSuccessReset,
  deleteCreateControlGroups,
  deleteCreateControlGroupsSuccessReset,
  downloadCreateControlGroups,
  downloadCreateControlGroupsReset,
  downloadCreateControlGroupsSuccess,
  getControlGroups,
} from 'redux/actions';
import { NotificationManager } from 'components/common/react-notifications';
import moment from 'moment';
import ControlPage from './ControlPage';

function ControlDetails({
  match,
  controlGroups,
  createControlGroupsSuccessResetAction,
  deleteControlGroupsSuccess,
  getControlGroupsAction,
  downloadCreateControlGroupsAction,
  downloadCreateControlGroupsResetAction,
  downloadControlGroupsSuccess,
  errorMsg,
  deleteCreateControlGroupsAction,
  deleteErrorMsg,
  deleteCreateControlGroupsSuccessResetAction,
}) {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  useEffect(() => {
    getControlGroupsAction();
    createControlGroupsSuccessResetAction();
    downloadCreateControlGroupsResetAction();
    deleteCreateControlGroupsSuccessResetAction();
  }, [
    downloadControlGroupsSuccess,
    deleteControlGroupsSuccess,
    errorMsg,
    deleteErrorMsg,
  ]);
  useEffect(() => {
    if (downloadControlGroupsSuccess) {
      NotificationManager.success(
        <IntlMessages id={'CONTROL_GROUPS.DOWNLOAD_SUCCESSFUL'} />,
        'Success',
        6000,
        null,
        null
      );
      downloadCreateControlGroupsResetAction();
    } else {
      if (errorMsg) {
        NotificationManager.error(
          <IntlMessages id={'CONTROL_GROUPS.DOWNLOAD_FAILED'} />,
          'Error',
          6000,
          null,
          null
        );
      }
    }
  }, [downloadControlGroupsSuccess, errorMsg]);
  useEffect(() => {
    if (deleteControlGroupsSuccess) {
      NotificationManager.success(
        <IntlMessages id={'CONTROL_GROUPS.DELETE_SUCCESSFUL'} />,
        'Success',
        6000,
        null,
        null
      );
      deleteCreateControlGroupsSuccessResetAction();
    } else {
      if (deleteErrorMsg) {
        NotificationManager.error(
          <IntlMessages id={'CONTROL_GROUPS.DELETE_SUCCESSFUL'} />,
          'Error',
          6000,
          null,
          null
        );
      }
    }
  }, [deleteControlGroupsSuccess, deleteErrorMsg]);
  const handleDeleteButtonClick = (groupID) => {
    deleteCreateControlGroupsAction(groupID);
  };
  const handleEdit = (controlGroup) => {
    getControlGroupsAction(controlGroup?.global_control_group?.id);
    setShowCreate(true);
  };
  const handleDownload = (controlGroup) => {
    let payload = {
      id: controlGroup?.global_control_group?.id,
      created_at: moment(controlGroup?.global_control_group?.created_at).format(
        'DD MMMM YYYY'
      ),
    };
    downloadCreateControlGroupsAction(payload);
  };

  return (
    <>
      {showCreate ? (
        <ControlPage
          controlGroupID={controlGroups[0]?.global_control_group?.id}
        />
      ) : (
        <div>
          <Row>
            <Colxx xxs="12">
              <div className="font-weight-bold mt-4 ml-4 align-items-center">
                <IntlMessages id={'CONTROL_GROUPS.GLOBAL_CONTROL_GROUP'} />
              </div>
            </Colxx>
          </Row>
          <Row className="radio-select-background pt-2 pb-4 toggle-background">
            <Colxx xxs="12">
              <div className="d-flex status-toggler pb-2 pl-4 justify-content-between">
                <div>
                  <span className="ml-2">
                    <ToggleSwitch
                      setSwitchChecked={setSwitchChecked}
                      switchChecked={switchChecked}
                    />
                  </span>
                  <IntlMessages id={'CONTROL_GROUPS.STATUS'} />
                </div>
                {switchChecked && (
                  <Row className="align-items-center">
                    <Colxx xxs="12" md="2">
                      <div className="d-flex justify-content-around">
                        <span
                          className="d-flex align-items-center control-button-pointer-cursor p-2"
                          onClick={() => {
                            handleEdit(controlGroups[0]);
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <h6 className="d-flex align-items-center font-weight-bold">
                            <span className="mr-1 alert-message">
                              <i className="simple-icon-pencil" />
                            </span>
                            <IntlMessages id="CONTROL_GROUPS.EDIT" />
                          </h6>
                        </span>
                        <span
                          className="d-flex align-items-center control-button-pointer-cursor p-2"
                          onClick={() => {
                            handleDeleteButtonClick(
                              controlGroups[0]?.global_control_group?.id
                            );
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <h6 className="d-flex align-items-center font-weight-bold">
                            <span className="mr-1 alert-message">
                              <i className="simple-icon-trash" />
                            </span>
                            <IntlMessages id="CONTROL_GROUPS.DELETE" />
                          </h6>
                        </span>
                        <span
                          className="d-flex align-items-center control-button-pointer-cursor p-1"
                          onClick={() => {
                            handleDownload(controlGroups[0]);
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <h6 className="d-flex align-items-center font-weight-bold">
                            <i className="iconsminds-download alert-message" />
                            <IntlMessages id="CONTROL_GROUPS.DOWNLOAD" />
                          </h6>
                        </span>
                      </div>
                    </Colxx>
                  </Row>
                )}
              </div>
              {switchChecked && (
                <Colxx xxs="12">
                  <ControlCard
                    controlGroupDetails={controlGroups}
                    match={match}
                    handleDeleteButtonClick={handleDeleteButtonClick}
                    getControlGroupsAction={getControlGroupsAction}
                    downloadCreateControlGroupsAction={
                      downloadCreateControlGroupsAction
                    }
                  />
                </Colxx>
              )}
            </Colxx>
          </Row>
        </div>
      )}
    </>
  );
}

const mapStateToProps = ({ controlGroupsApp }) => {
  const {
    controlGroups,
    controlGroupsSuccess,
    deleteControlGroupsSuccess,
    downloadControlGroupsSuccess,
    errorMsg,
    deleteErrorMsg,
  } = controlGroupsApp;
  return {
    controlGroups,
    controlGroupsSuccess,
    deleteControlGroupsSuccess,
    downloadControlGroupsSuccess,
    errorMsg,
    deleteErrorMsg,
  };
};
export default connect(mapStateToProps, {
  getControlGroupsAction: getControlGroups,
  createControlGroupsAction: createControlGroups,
  createControlGroupsSuccessResetAction: createControlGroupsSuccessReset,
  deleteCreateControlGroupsAction: deleteCreateControlGroups,
  deleteCreateControlGroupsSuccessResetAction:
    deleteCreateControlGroupsSuccessReset,
  downloadCreateControlGroupsAction: downloadCreateControlGroups,
  downloadCreateControlGroupsSuccessAction: downloadCreateControlGroupsSuccess,
  downloadCreateControlGroupsResetAction: downloadCreateControlGroupsReset,
})(ControlDetails);
