import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  NavLink,
  Row,
  Input,
  Label,
  FormGroup,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getControlGroups } from 'redux/actions';
import ControlDetails from './ControlDetails';
import ControlPage from './ControlPage';

const ControlEnable = ({ intl, controlGroups, getControlGroupsAction }) => {
  const { messages } = intl;
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const inputToggle = () => setShowModal(!showModal);
  useEffect(() => {
    getControlGroupsAction();
  }, []);
  useEffect(() => {
    if (controlGroups.length > 0) {
      setShowDetail(true);
    }
  }, [controlGroups]);
  const enableControl = [
    {
      message: messages['CONTROL_GROUPS.ENABLE_MSG_1'],
      id: 1,
    },
    {
      message: messages['CONTROL_GROUPS.ENABLE_MSG_2'],
      id: 2,
    },
  ];

  const handleLeftBtnClick = () => {
    setShowModal(true);
  };

  const handleSubmit = () => {
    setShowCreate(true);
  };

  return (
    <div className="app-row">
      {showDetail ? (
        <ControlDetails />
      ) : showCreate ? (
        <ControlPage />
      ) : (
        <>
          <Row className="pb-2">
            <Colxx xxs="12" md="6">
              <div className="font-weight-bold">
                <IntlMessages id="CONTROL_GROUPS.GLOBAL_CONTROL_GROUP" />
              </div>
            </Colxx>
          </Row>
          <Row className="page-background pt-3">
            <Colxx xxs="12">
              <ul>
                {enableControl.map((val) => {
                  return (
                    <li key={val.id} className="pt-2">
                      {val.message}
                    </li>
                  );
                })}
              </ul>
            </Colxx>
            <Colxx xxs="12">
              <NavLink className="muted font-weight-bold clickable-text user-pointer">
                <div className="pl-2 pb-2">
                  <IntlMessages id={'CONTROL_GROUPS.KNOW_MORE'} />
                </div>
              </NavLink>
            </Colxx>
          </Row>
          <div className="app-row mt-3">
            <Button color="primary" onClick={handleLeftBtnClick}>
              <IntlMessages id={'CONTROL_GROUPS.ENABLE_BUTTON'} />
            </Button>
          </div>
          {showModal && (
            <Modal isOpen={showModal} toggle={inputToggle} size="lg">
              <ModalHeader
                toggle={() => {
                  setShowModal(false);
                }}
              >
                <div className="heading">
                  <IntlMessages id="CONTROL_GROUPS.ENABLE_HEADING" />
                </div>
              </ModalHeader>
              <ModalBody>
                <FormGroup className="has-float-label">
                  <Label>
                    <IntlMessages id="CONTROL_GROUPS.SUBJECT" />
                  </Label>
                  <Input
                    type="text"
                    defaultValue={messages['CONTROL_GROUPS.MAIL_HEADING']}
                  />
                </FormGroup>
                <FormGroup className="has-float-label">
                  <Label>
                    <IntlMessages id="CONTROL_GROUPS.MESSAGE" />
                  </Label>
                  <Input
                    type="textarea"
                    defaultValue={messages['CONTROL_GROUPS.MAIL_BODY']}
                  />
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  <IntlMessages id="CONTROL_GROUPS.CANCEL" />
                </Button>
                <Button color="primary" onClick={handleSubmit}>
                  <IntlMessages id="CONTROL_GROUPS.SUBMIT" />
                </Button>
              </ModalFooter>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

const mapStateToProps = ({ controlGroupsApp }) => {
  const { controlGroups } = controlGroupsApp;
  return {
    controlGroups,
  };
};
export default connect(mapStateToProps, {
  getControlGroupsAction: getControlGroups,
})(injectIntl(ControlEnable));
