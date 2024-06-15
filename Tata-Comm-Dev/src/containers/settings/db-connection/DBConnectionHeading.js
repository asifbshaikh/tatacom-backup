import React from 'react';
import { Row, Button } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { NavLink } from 'react-router-dom';
import { adminRoot } from 'constants/defaultValues';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const DBConnectionHeading = ({ match, heading, showAddBtn }) => {
  const history = useHistory();
  const search = history.location;
  const params = search.state;
  const fromPage = params?.from;

  const headingText =
    fromPage === 'edit' ? 'S3SFTP.DB_SETTING.EDIT_CONNECTION' : heading;
  fromPage;
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <div className="mb-2">
            <h1>
              <IntlMessages id={headingText} />
            </h1>

            {showAddBtn && (
              <div className="text-zero top-right-button-container">
                <NavLink
                  to={{
                    pathname: `${adminRoot}/settings/db-connection-setup/new`,
                    state: { from: 'new' },
                    className: 'ml-2 text-primary1 active1',
                  }}
                >
                  <Button
                    color="primary"
                    size="lg"
                    className="top-right-button"
                  >
                    <IntlMessages id="S3SFTP.DB_SETTING.ADD_CONNECTION" />
                  </Button>
                </NavLink>
              </div>
            )}

            <Breadcrumb match={match} />
          </div>
        </Colxx>
      </Row>
    </>
  );
};

export default DBConnectionHeading;
