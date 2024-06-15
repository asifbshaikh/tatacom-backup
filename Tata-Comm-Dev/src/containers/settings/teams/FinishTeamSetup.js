import React from 'react';

// import FormGroupCoustom from 'components/common/FormGroupCoustom';
import IntlMessages from 'helpers/IntlMessages';
// import { connect } from 'react-redux';

// import {
//     Formik,
//     Form,
//     // Field
// } from 'formik';

import {
  // FormGroup,
  // Label,
  Row,
  Button,
  // NavLink,
  // Alert,
  // Card, CardBody
} from 'reactstrap';
// import { injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';

import { adminRoot } from 'constants/defaultValues';

import { Colxx } from 'components/common/CustomBootstrap';

// const Website = ({
//     fields, formRef,
//     next,
//     setFieldsCoustom,
// }) => {
const Website = () => {
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <h2 className="mb-4 font-weight-bold">
            <IntlMessages id="TEAMS_SETTINGS.FINISH.TITLE" />
          </h2>
          <p>
            <IntlMessages id="TEAMS_SETTINGS.FINISH.MESSAGE" />
          </p>
          <div>
            <NavLink
              className="ml-2 text-primary1 active1"
              to={`${adminRoot}/settings/teams/list`}
            >
              <Button color="primary">
                <IntlMessages id="TEAMS_SETTINGS.FINISH.BUTTON_TEXT" />
              </Button>
            </NavLink>
          </div>
        </Colxx>
      </Row>
    </>
  );
};

export default Website;
