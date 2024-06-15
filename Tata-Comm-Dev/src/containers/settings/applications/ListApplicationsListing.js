/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */

import React from 'react';
// import moment from 'moment';
import {
    Row, Button, Card, CardBody,
    // CardTitle,
} from 'reactstrap';

import { Colxx } from 'components/common/CustomBootstrap';

import DataTableView from 'containers/contacts/DataTableView';

import IntlMessages from 'helpers/IntlMessages';
import { globalConfig } from 'constants/defaultValues';

function collect(props) {
    return { data: props.data };
}

const ListApplicationsListing = ({
    integration,
    // items,
    isHookTypeInbox,
    setModalOpenDelete,
    setEditFormData,
    // setModalOpen,
}) => {

    const hookHeaders = () => {
        return integration.visible_properties || [];
    }
    const hooks = () => {
        const { hooks: hooksMy } = integration;
        return hooksMy;
        // return hooksMy.map(hook => {
        //     // const properties = {}
        //     return {
        //         ...hook,
        //         id: hook.id,
        //         // properties: hookHeaders().map(property => {
        //         //     return { [property]: hook.settings[property] ? hook.settings[property] : '--' }
        //         // }),
        //     }
        // });
    }

    const tableCols = hookHeaders().map(item => {
        return {
            Header: item,
            accessor: item,
            Cell: (props) => {
                return props.row.settings[item] ? props.row.settings[item] : '--';
            }
        }
    })
    if (isHookTypeInbox()) {
        tableCols.push({
            Header: "INTEGRATION_APPS.LIST.INBOX",
            accessor: 'ibx',
            Cell: (props) => {
                // const [thisInbox] = hooks().filter(hook => (props.row.id === hook.id));
                return props.row.inbox ? props.row.inbox.name : '';
            }
        })
    }
    tableCols.push({
        Header: "INTEGRATION_APPS.LIST.DELETE.BUTTON_TEXT",
        accessor: 'action',
        Cell: (props) => {
            return (<Button
                // outline
                color="theme-3"
                className="icon-button ml-1 edit-button"
                onClick={() => {
                    setModalOpenDelete(true);
                    setEditFormData(props.row);
                }}
            >
                <i className="simple-icon-trash" />
                {/* <IntlMessages id="INTEGRATION_APPS.LIST.DELETE.BUTTON_TEXT" /> */}
            </Button>
            )
        }
    })
    return (
        <Row>
            <DataTableView
                colxxs="8"
                cols={tableCols}
                items={hooks()}
                key="ReactTblContacts"
                collect={collect}
            />
            <Colxx xxs="4"
            >
                <Card className="mb-4">
                    <CardBody>
                        <p>
                            <b>{integration.name}</b>
                        </p>
                        <IntlMessages
                            id={`INTEGRATION_APPS.SIDEBAR_DESCRIPTION.${integration.name.toUpperCase()}`}
                            values={{
                                p: (...chunks) => <p>{chunks}</p>,
                                linebreak: <br />,
                                installationName: globalConfig.installationName
                            }} />
                    </CardBody>
                </Card>
            </Colxx>
        </Row>
    );
};

export default React.memo(ListApplicationsListing);
