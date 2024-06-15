import React, { useEffect } from "react";
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { connect } from 'react-redux';
import {
    Row,
    Spinner,
    // Alert,
} from 'reactstrap';
import EditAccountSettings from "containers/settings/accounts/EditAccountSettings";



import {
    getAccount,
} from 'redux/actions';

const AccountsNew = ({
    match,
    account,
    getAccountAction,
}) => {
    useEffect(() => {
        // updateData();
        getAccountAction();
    }, [])
    // const updateData = () => {
    //     getAccountAction();
    // }


    return (
        <>
            <Row>
                <Colxx xxs="12">
                    <Breadcrumb heading="GENERAL_SETTINGS.TITLE" match={match} />
                    <Separator className="mb-5" />
                </Colxx>
            </Row>
            <Row>
                <Colxx xxs="12" className="mb-5">
                    {(!account || !account.id) ? <Spinner color="primary" /> : <EditAccountSettings
                        account={account}
                        accountid={match.params.accountid}
                        // updateData={updateData}
                    />}
                </Colxx>
            </Row>
        </>
    );
}

// export default AccountsNew;
const mapStateToProps = ({ accountsApp }) => {
    const {
        account,
    } = accountsApp;
    return {
        account,
    };
};
export default connect(mapStateToProps, {
    getAccountAction: getAccount,
})(AccountsNew);