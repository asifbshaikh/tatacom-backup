import IntlMessages from 'helpers/IntlMessages';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Alert,
} from 'reactstrap';
import DataTableView from 'containers/contacts/DataTableView';
import { connect } from 'react-redux';
import { addEmailConnectorClean, removeEmailConnector } from 'redux/actions';
import { NotificationManager } from 'components/common/react-notifications';
import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';
import SMTPConfiguration from './SMTPConfiguration';
import CommonEnums from 'enums/commonEnums';

function collect(props) {
  return { data: props.data };
}

const ConnectorConfigList = ({
  removeConnectorFromList,
  data,
  formSuccess,
  formError,
  formLoading,
  emailConnectorCleanUp,
}) => {
  const [modalOpenAdd, setModalOpenAdd] = useState(false);
  const [editRowData, setEditRowData] = useState('');
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState('');

  const tableCols = [
    {
      Header: 'CHANNEL_MGMT.EMAIL_CHANNEL.SMTP_HOSTNAME.LABEL',
      accessor: 'channel_name',
      cellClass: ' text-nowrap description-wrap hover-effect',

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
      Header: 'CHANNEL_MGMT.EMAIL_CHANNEL.API_KEY.LABEL',
      accessor: 'email_api_key',
      Cell: function OrderItems() {
        return (
          <>
            <div className="rt-cell-data">
              {ContentConfigurationEnums.API_KEY_HIDDEN}
            </div>
          </>
        );
      },
    },
    {
      Header: 'CHANNEL_MGMT.EMAIL_CHANNEL.API_URL.LABEL',
      accessor: 'email_api_url',
      cellClass: 'hover-effect description-wrap ',
      Cell: (props) => {
        let propsVal = props.value;
        propsVal =
          propsVal?.length > 40
            ? propsVal.substring(0, 40).concat('...')
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
      Header: 'CHANNEL_MGMT.EMAIL_CHANNEL.ACTION',
      accessor: '',
      cellClass: 'text-nowrap',
      Cell: function OrderItems({ row }) {
        return (
          <>
            <Button
              color="theme-3"
              data-testid="edit-button"
              className="icon-button ml-1 edit-button"
              onClick={() => {
                setEditRowData(row);
                setModalOpenAdd(!modalOpenAdd);
              }}
            >
              <i className="simple-icon-pencil" />
            </Button>
            <Button
              data-testid="delete-btn"
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
  ];

  const closeForm = () => {
    if (deleteConfirmDialog) {
      setDeleteConfirmDialog(!deleteConfirmDialog);
    }
    emailConnectorCleanUp();
  };

  const onDeleteContactItem = () => {
    if (formLoading) {
      return false;
    }
    const deleteParam = {
      deleteRowId: deleteRowId,
      channel_type: CommonEnums.EMAIL,
    };
    removeConnectorFromList(deleteParam);
    return false;
  };

  useEffect(() => {
    if (deleteConfirmDialog) {
      if (formSuccess) {
        closeForm();
        NotificationManager.success(
          'Deleted successfully',
          'Success',
          6000,
          null,
          null,
          ''
        );
      }
    }
  }, [formSuccess]);

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

        <SMTPConfiguration
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
            {formError && formError.errorMsg && (
              <Alert color="danger" className="rounded">
                {formError.errorMsg}
              </Alert>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" outline onClick={closeForm}>
              <IntlMessages id="CAMPAIGN.DELETE.CONFIRM.NO" />
            </Button>
            <Button color="primary" onClick={onDeleteContactItem}>
              <IntlMessages id="CAMPAIGN.DELETE.CONFIRM.YES" />
            </Button>{' '}
          </ModalFooter>
        </Modal>
      </Row>
    </>
  );
};

const mapStateToProps = ({ settingsChannels }) => {
  const { emailChannelRemove, errorAdd, loadingDelete } = settingsChannels;
  return {
    formSuccess: emailChannelRemove,
    formError: errorAdd,
    formLoading: loadingDelete,
  };
};

export default connect(mapStateToProps, {
  removeConnectorFromList: removeEmailConnector,
  emailConnectorCleanUp: addEmailConnectorClean,
})(ConnectorConfigList);
