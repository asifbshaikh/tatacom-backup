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
import { removeWhatsAppChannelConnector } from 'redux/actions';
import { NotificationManager } from 'components/common/react-notifications';
import IntlMessages from 'helpers/IntlMessages';
import WhatsAppConfigForm from './WhatsAppConfigForm';
import CommonEnums from 'enums/commonEnums';
import CustomUncontrolledToolTip from 'components/CustomUncontrolledToolTip';

function collect(props) {
  return { data: props.data };
}

const WhatsAppConnectorList = ({
  data,
  removeWAChannelConnectorList,
  successRemove,
  removeFail,
}) => {
  const [modalOpenAdd, setModalOpenAdd] = useState(false);
  const [editRowData, setEditRowData] = useState('');
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState('');

  const tableCols = useMemo(
    () => [
      {
        Header: 'CHANNEL_MGMT.WHATSAPP_CHANNEL.TABLE_HEADER.API_PROVIDER_LABEL',
        accessor: '',
        Cell: function OrderItems() {
          return 'Tata';
        },
      },
      {
        Header: 'CHANNEL_MGMT.WHATSAPP_CHANNEL.TABLE_HEADER.NAME',
        accessor: 'channel_name',
        cellClass: 'text-nowrap data-wrap hover-effect',
        Cell: (props) => (
          <>
            <CustomUncontrolledToolTip
              label={props.value}
              target={`tooltip-name-${props.row.id}`}
            />

            <span id={`tooltip-name-${props.row.id}`}>{props.value}</span>
          </>
        ),
      },
      {
        Header: 'CHANNEL_MGMT.WHATSAPP_CHANNEL.TABLE_HEADER.PHONE_NUMBER',
        accessor: 'phone_number',
      },
      {
        Header: 'CHANNEL_MGMT.WHATSAPP_CHANNEL.TABLE_HEADER.PHONE_NUMBER_ID',
        accessor: 'provider_config.phone_number_id',
      },
      {
        Header: 'CHANNEL_MGMT.WHATSAPP_CHANNEL.TABLE_HEADER.WABA_ID',
        accessor: 'provider_config.waba_id',
      },
      {
        Header: 'CHANNEL_MGMT.WHATSAPP_CHANNEL.TABLE_HEADER.API_KEY_LABEL',
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
        Header: 'CHANNEL_MGMT.WHATSAPP_CHANNEL.TABLE_HEADER.AUTH_KEY_LABEL',
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
        Header: 'CHANNEL_MGMT.WHATSAPP_CHANNEL.TABLE_HEADER.ACTION',
        accessor: '',
        Cell: function OrderItems({ row }) {
          return (
            <>
              <Button
                color="theme-3"
                data-testid="edit-btn"
                className="icon-button ml-1 edit-button"
                onClick={() => {
                  setEditRowData(row);
                  setModalOpenAdd(!modalOpenAdd);
                }}
              >
                <i className="simple-icon-pencil" />
              </Button>
              <Button
                color="theme-3"
                data-testid="delete-btn"
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
    if (successRemove) {
      const successMsg =
        'CHANNEL_MGMT.WHATSAPP_CHANNEL.API.DELETE.SUCCESS_MESSAGE';
      NotificationManager.success(
        <IntlMessages id={successMsg} />,
        'Success',
        6000,
        null,
        null,
        '' // className
      );
    }
  }, [successRemove]);

  useEffect(() => {
    if (removeFail && removeFail.errorMsg) {
      NotificationManager.error(
        <IntlMessages id={removeFail.errorMsg} />,
        'Error',
        6000,
        null,
        null,
        ''
      );
    }
  }, [removeFail]);

  const closeForm = () => {
    if (deleteConfirmDialog) {
      setDeleteConfirmDialog(!deleteConfirmDialog);
    }
  };

  return (
    <>
      <Row>
        {/* {data.length > 0 && ( */}
        <DataTableView
          colxxs="12"
          cols={tableCols}
          items={data}
          key="ReactTblImportUserList"
          collect={collect}
        />
        {/* )} */}
        <WhatsAppConfigForm
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
                  channel_type: CommonEnums.WHATSAPP,
                };
                removeWAChannelConnectorList(deleteParam);
              }}
            >
              <IntlMessages id="CAMPAIGN.DELETE.CONFIRM.YES" />
            </Button>
          </ModalFooter>
        </Modal>
      </Row>
    </>
  );
};

const mapStateToProps = ({ settingsChannels }) => {
  const { successWARemove, removeWAFail } = settingsChannels;
  return { successRemove: successWARemove, removeFail: removeWAFail };
};

export default connect(mapStateToProps, {
  removeWAChannelConnectorList: removeWhatsAppChannelConnector,
})(WhatsAppConnectorList);
