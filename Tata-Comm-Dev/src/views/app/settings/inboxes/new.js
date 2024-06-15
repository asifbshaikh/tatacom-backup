import React from "react";
import { Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import InboxesWizard from 'containers/settings/inboxes/InboxesWizard';

const InboxesNew = ({ match }) => {

    return (
        <>
            <Row>
                <Colxx xxs="12">
                    <Breadcrumb heading="inboxes.add-new-heading" match={match} />
                    <Separator className="mb-5" />
                </Colxx>
            </Row>
            <Row>
                <Colxx xxs="12" className="mb-5">
                    {/* <h5 className="mb-4">Validation</h5> */}
                    <InboxesWizard match={match} />
                </Colxx>
            </Row>
        </>
    );
}

export default InboxesNew;