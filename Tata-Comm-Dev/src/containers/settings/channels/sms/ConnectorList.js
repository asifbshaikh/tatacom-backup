import React, { useEffect, useMemo, useState } from 'react';
import DataTableView from 'containers/contacts/DataTableView';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';
import { connect } from 'react-redux';
import { removeChannelConnector } from 'redux/actions';
import { NotificationManager } from 'components/common/react-notifications';
import IntlMessages from 'helpers/IntlMessages';
import TataConfigForm from './TataConfigForm';
import CommonEnums from 'enums/commonEnums';

function collect(props) {
  return { data: props.data };
}

const ConnectorList = ({
  removeConnectorFromList,
  successRemoveConnector,
  data,
  removeFail,
  errorMessaage,
}) => {
  const [modalOpenAdd, setModalOpenAdd] = useState(false);
  const [editRowData, setEditRowData] = useState('');
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState('');

  const tableCols = useMemo(
    () => [
      {
        Header: 'CHANNEL_MGMT.SMS_CHANNEL.API_PROVIDER',
        accessor: 'medium',
      },
      {
        Header: 'CHANNEL_MGMT.SMS_CHANNEL.SENDER_NAME',
        accessor: 'channel_name',
        cellClass: 'hover-effect',
        Cell: (props) => {
          let propsVal = props.value;
          propsVal =
            propsVal?.length > 20
              ? propsVal.substring(0, 20).concat('...')
              : propsVal;
          return (
            <>
              <div
                className="rt-cell-data column-sticky pr-5"
                title={props?.value}
              >
                {propsVal}
              </div>
            </>
          );
        },
      },
      {
        Header: 'CHANNEL_MGMT.SMS_CHANNEL.SENDER_ID',
        accessor: 'sender_id',
        cellClass: 'hover-effect',
        Cell: (props) => {
          let propsVal = props.value;
          propsVal =
            propsVal?.length > 20
              ? propsVal.substring(0, 20).concat('...')
              : propsVal;
          return (
            <>
              <div
                className="rt-cell-data column-sticky pr-5"
                title={props?.value}
              >
                {propsVal}
              </div>
            </>
          );
        },
      },
      {
        Header: 'CHANNEL_MGMT.SMS_CHANNEL.API_KEY_LABEL',
        // accessor: 'auth_token'  //TO DO
        accessor: '',
        Cell: function OrderItems() {
          return (
            <>
              <div className="rt-cell-data">********</div>
            </>
          );
        },
      },
      {
        Header: 'CHANNEL_MGMT.SMS_CHANNEL.CALLBACK_URL_LABEL',
        accessor: 'callback_url',
      },
      {
        Header: 'CHANNEL_MGMT.SMS_CHANNEL.ACTION',
        accessor: '',
        cellClass: 'text-nowrap',
        Cell: function OrderItems({ row }) {
          return (
            <>
              <Button
                data-testid={`edit-btn_${row.id}`}
                color="theme-3"
                className="icon-button ml-1 edit-button"
                onClick={() => {
                  setEditRowData(row);
                  setModalOpenAdd(!modalOpenAdd);
                }}
              >
                <i className="simple-icon-pencil" />
              </Button>
              <Button
                data-testid={`delete-btn_${row.id}`}
                color="theme-3"
                className="icon-button ml-1 edit-button"
                onClick={() => {
                  setDeleteRowId(row.channel_id);
                  setDeleteConfirmDialog(true);
                }}
              >
                <i className="simple-icon-trash" />
              </Button>
            </>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (successRemoveConnector) {
      NotificationManager.success(
        'Deleted successfully',
        'Success',
        6000,
        null,
        null,
        '' // className
      );
    }
  }, [successRemoveConnector]);

  if (removeFail) {
    NotificationManager.error(
      errorMessaage?.errorMsg,
      'Error',
      6000,
      null,
      null,
      '' // className
    );
  }

  const closeForm = () => {
    if (deleteConfirmDialog) {
      setDeleteConfirmDialog(!deleteConfirmDialog);
    }
  };

  return (
    <>
      <Row>
        <DataTableView
          colxxs="12"
          cols={tableCols}
          items={data}
          key="ReactTblImportUserList"
          collect={collect}
        />

        <TataConfigForm
          modalType="Edit"
          editRow={editRowData}
          modalOpen={modalOpenAdd}
          toggleModal={() => {
            setModalOpenAdd(!modalOpenAdd);
          }}
        />

        <Modal
          isOpen={deleteConfirmDialog}
          toggle={closeForm}
          backdrop="static"
        >
          <ModalHeader toggle={closeForm}>
            <IntlMessages id="CAMPAIGN.DELETE.CONFIRM.TITLE" />
          </ModalHeader>

          <ModalBody>
            <IntlMessages id="CAMPAIGN.DELETE.CONFIRM.MESSAGE" />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" outline onClick={closeForm}>
              <IntlMessages id="CAMPAIGN.DELETE.CONFIRM.NO" />
            </Button>
            <Button
              color="primary"
              onClick={() => {
                closeForm();
                const deleteParam = {
                  deleteRowId: deleteRowId,
                  channel_type: CommonEnums.TATA_SMS,
                };
                removeConnectorFromList(deleteParam);
              }}
            >
              <IntlMessages id="CAMPAIGN.DELETE.CONFIRM.YES" />
            </Button>{' '}
          </ModalFooter>
        </Modal>
      </Row>
    </>
  );
};

const mapStateToProps = ({ settingsChannels }) => {
  const { successRemove, removeFail, errorMessaage } = settingsChannels;
  return { successRemoveConnector: successRemove, removeFail, errorMessaage };
};

export default connect(mapStateToProps, {
  removeConnectorFromList: removeChannelConnector,
})(ConnectorList);
