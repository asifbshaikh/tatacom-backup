import React from 'react';
import { Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import Basic from 'containers/wizard/Basic';
import LastStepEnd from 'containers/wizard/LastStepEnd';
import TopNavDisabled from 'containers/wizard/TopNavDisabled';
import Validation from 'containers/wizard/Validation';
import Layouts from 'containers/wizard/Layouts';

const FormWizard = ({ match }) => {
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.form-wizard" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12" className="mb-5">
          <h2 className="mb-4 font-weight-bold">Basic</h2>
          <Basic />
        </Colxx>
        <Colxx xxs="12" className="mb-5">
          <h2 className="mb-4 font-weight-bold">Last Step End</h2>
          <LastStepEnd />
        </Colxx>
        <Colxx xxs="12" className="mb-5">
          <h2 className="mb-4 font-weight-bold">Top Navigation Disabled</h2>
          <TopNavDisabled />
        </Colxx>
        <Colxx xxs="12" className="mb-5">
          <h2 className="mb-4 font-weight-bold">Validation</h2>
          <Validation />
        </Colxx>
        <Colxx xxs="12" className="mb-5">
          <h2 className="mb-4 font-weight-bold">Layouts</h2>
          <Layouts />
        </Colxx>
      </Row>
    </>
  );
};
export default FormWizard;
