import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';
import { getEmailConnectorList } from 'redux/actions';
import ConnectorConfigList from './ConnectorConfigList';
import SMTPConfiguration from './SMTPConfiguration';
import { getInboxList } from 'redux/settingsChannels/actions';
import CommonEnums from 'enums/commonEnums';

const ConnectorConfig = ({
  channelType,
  allConnectorList,
  getConnectorList,
  emailChannelRemove,
  getInboxListAction,
  successEmailConnector,
}) => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  useEffect(() => {
    getConnectorList(CommonEnums.EMAIL);
  }, []);

  useEffect(() => {
    if (emailChannelRemove || successEmailConnector) {
      getConnectorList(CommonEnums.EMAIL);
      getInboxListAction({ Channel_type: CommonEnums.EMAIL });
    }
  }, [emailChannelRemove, successEmailConnector]);

  return (
    <>
      <Colxx xxs="12 allign-right">
        <Button
          color="primary"
          size="lg"
          className="top-right-button"
          onClick={() => setOpenCreateDialog(true)}
        >
          <IntlMessages id="CHANNEL_MGMT.EMAIL_CHANNEL.ADD_CONFIG_BTN" />
        </Button>
      </Colxx>
      <br />
      <Colxx xxs="12">
        <ConnectorConfigList data={allConnectorList} />
      </Colxx>

      <SMTPConfiguration
        modalType="Add"
        modalOpen={openCreateDialog}
        toggleModal={() => {
          setOpenCreateDialog(!openCreateDialog);
        }}
      />
    </>
  );
};

const mapStateToProps = ({ settingsChannels }) => {
  const { tataEmailConnectors, emailChannelRemove, successEmailConnector } =
    settingsChannels;
  return {
    allConnectorList: tataEmailConnectors,
    emailChannelRemove,
    successEmailConnector,
  };
};

export default connect(mapStateToProps, {
  getConnectorList: getEmailConnectorList,
  getInboxListAction: getInboxList,
})(ConnectorConfig);
