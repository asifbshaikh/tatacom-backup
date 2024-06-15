import React from "react";
import { Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import TeamsWizard from 'containers/settings/teams/TeamsWizard';

const TeamsNew = ({ match }) => {

    return (
        <>
            <Row>
                <Colxx xxs="12">
                    <Breadcrumb heading="TEAMS_SETTINGS.HEADER" match={match} />
                    <Separator className="mb-5" />
                </Colxx>
            </Row>
            <Row>
                <Colxx xxs="12" className="mb-5">
                    {/* <h5 className="mb-4">Validation</h5> */}
                    <TeamsWizard match={match} itemid={match.params.itemid || ''} />
                </Colxx>
            </Row>
        </>
    );
}

export default TeamsNew;