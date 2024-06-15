import React, { useState } from 'react';
import classNames from 'classnames';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import {
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';
import EmailDetails from './EmailDetails';

const CardContentConfiguration = ({
  formRef,
  setIsChoose,
  handleSubmit,
  templatePageChangeRef,
  emailEditorRef,
  setDisableNextButton,
}) => {
  const tabs = [
    {
      id: '1',
      type: 'emailDetails',
      attribute_model: 'email_details',
      label: (
        <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.SENDER_DETAILS" />
      ),
      element: (
        <EmailDetails
          formRef={formRef}
          setIsChoose={setIsChoose}
          handleSubmit={handleSubmit}
          templatePageChangeRef={templatePageChangeRef}
          emailEditorRef={emailEditorRef}
          setDisableNextButton={setDisableNextButton}
        />
      ),
    },
  ];

  const tabId = (val) => {
    return tabs.filter((element) => element.type === val)[0];
  };
  const [activeTab, setActiveTab] = useState(tabId.id ?? '1');

  return (
    <>
      <div className="app-row1 channels-config">
        <Row>
          <Colxx xxs="12">
            <Nav tabs className="card-header-tabs mb-2">
              {tabs.map((item) => (
                <NavItem key={item.id}>
                  <NavLink
                    to="#"
                    location={{}}
                    className={`${classNames({
                      active: activeTab === item.id,
                      'nav-link pt-112 pb-012': true,
                    })} `}
                    onClick={() => {
                      setActiveTab(item.id);
                    }}
                  >
                    {item.label}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </Colxx>
        </Row>
        <Row>
          <TabContent activeTab={activeTab} className="w-100">
            {tabs.map((item) => {
              return (
                <TabPane key={item.id} tabId={item.id}>
                  <Card>
                    <CardBody>{item.element}</CardBody>
                  </Card>
                </TabPane>
              );
            })}
          </TabContent>
        </Row>
      </div>
    </>
  );
};

export default CardContentConfiguration;
