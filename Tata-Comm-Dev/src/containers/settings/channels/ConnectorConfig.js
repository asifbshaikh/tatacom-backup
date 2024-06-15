import React, { useState, useEffect } from 'react';
import { Button, Container, Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';
import {
  getSettingsSMSConnectorList,
  getSettingsWhatsAppConnectorList,
} from 'redux/actions';
import CommonEnums from 'enums/commonEnums';
import ConnectorList from './sms/ConnectorList';
import TataConfigForm from './sms/TataConfigForm';
import WhatsAppConfigForm from './whatsapp/WhatsAppConfigForm';
import WhatsAppConnectorList from './whatsapp/WhatsAppConnectorList';
import { getInboxList } from 'redux/settingsChannels/actions';

const ConnectorConfig = ({
  tataSMSConnectors,
  tataWhatsAppConnectors,
  getConnectorList,
  getWAConnectorList,
  channelType,
  successRemove,
  successWARemove,
  getInboxListAction,
  successAdd,
  successWAAdd,
}) => {
  const [modalOpenAdd, setModalOpenAdd] = useState(false);

  useEffect(() => {
    if (channelType === CommonEnums.SMS) {
      getConnectorList(CommonEnums.TATA_SMSC);
    } else {
      getWAConnectorList(CommonEnums.WHATSAPP);
    }
  }, []);

  useEffect(() => {
    if (successRemove || successWARemove || successWAAdd || successAdd) {
      if (channelType === CommonEnums.SMS) {
        getInboxListAction({ Channel_type: CommonEnums.TATA_SMSC });
        getConnectorList(CommonEnums.TATA_SMSC);
      } else {
        getInboxListAction({ Channel_type: CommonEnums.WHATSAPP });
        getWAConnectorList(CommonEnums.WHATSAPP);
      }
    }
  }, [successRemove, successWARemove, successWAAdd, successAdd]);

  return (
    <Container className="mt-3">
      <Row>
        <Colxx xs="12" className="allign-right">
          <Button
            color="primary"
            size="lg"
            className="top-right-button"
            onClick={() => setModalOpenAdd(true)}
          >
            <IntlMessages id="CHANNEL_MGMT.SMS_CHANNEL.ADD_CONFIG_BTN" />
          </Button>
        </Colxx>
      </Row>
      <br />
      <Row>
        <Colxx xs="12">
          {channelType === CommonEnums.SMS && (
            <ConnectorList data={tataSMSConnectors} />
          )}
          {channelType === CommonEnums.WHATSAPP && (
            <WhatsAppConnectorList data={tataWhatsAppConnectors} />
          )}
        </Colxx>

        {channelType === CommonEnums.SMS && (
          <TataConfigForm
            modalType="Add"
            modalOpen={modalOpenAdd}
            toggleModal={() => {
              setModalOpenAdd(!modalOpenAdd);
            }}
          />
        )}
        {channelType === CommonEnums.WHATSAPP && (
          <WhatsAppConfigForm
            modalType="Add"
            modalOpen={modalOpenAdd}
            toggleModal={() => {
              setModalOpenAdd(!modalOpenAdd);
            }}
          />
        )}
      </Row>
    </Container>
  );
};
const mapStateToProps = ({ settingsChannels }) => {
  const {
    tataSMSConnectors,
    tataWhatsAppConnectors,
    successRemove,
    successWARemove,
    successAdd,
    successWAAdd,
  } = settingsChannels;
  return {
    tataSMSConnectors,
    tataWhatsAppConnectors,
    successRemove,
    successWARemove,
    successAdd,
    successWAAdd,
  };
};

export default connect(mapStateToProps, {
  getConnectorList: getSettingsSMSConnectorList,
  getWAConnectorList: getSettingsWhatsAppConnectorList,
  getInboxListAction: getInboxList,
})(ConnectorConfig);
