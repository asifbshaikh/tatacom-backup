import React from 'react';
import classNames from 'classnames';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';

const ChannelTabListing = ({
  title,
  description,
  tabs,
  activeTab,
  hanldeActiveTab,
}) => {
  return (
    <div>
      <Row>
        <Colxx xxs="12">
          <h2 className="mb-4 font-weight-bold">
            <IntlMessages id={title} />
          </h2>
          <p>
            <IntlMessages id={description} />
          </p>
        </Colxx>
      </Row>
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
                    hanldeActiveTab(item.id);
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
              <div key={item.id}>
                {activeTab === item.id ? (
                  <TabPane tabId={item.id}>{item.element}</TabPane>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </TabContent>
      </Row>
    </div>
  );
};

export default ChannelTabListing;
