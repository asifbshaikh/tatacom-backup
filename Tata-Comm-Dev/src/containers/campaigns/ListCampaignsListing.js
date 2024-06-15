/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */

import React, { useState } from 'react';
// import moment from 'moment';
import {
    Row, Button,
    // Card, CardBody,
    // CardTitle,
    Nav,
    NavItem,
} from 'reactstrap';

import { Colxx } from 'components/common/CustomBootstrap';

import DataTableView from 'containers/contacts/DataTableView';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import IntlMessages from 'helpers/IntlMessages';
import { adminRoot } from 'constants/defaultValues';
import { getTimeFromTimeStamp } from 'helpers/TringReactHelper';

function collect(props) {
    return { data: props.data };
}
const tabs = [
    {
        campaign_type: 'ongoing',
        label: <IntlMessages id='menu.ongoing' />,
    },
    {
        campaign_type: 'one_off',
        label: <IntlMessages id='menu.one_off' />,
    },
]

const ListCampaignsListing = ({
    match,
    items,
    setModalOpenDelete,
    setEditFormData,
    setModalOpen,
    isOngoingType,
}) => {
    const [activeFirstTab, setActiveFirstTab] = useState(match.params.campaigntype);
    let tableColsAll = [
        {
            Header: 'CAMPAIGN.LIST.TABLE_HEADER.TITLE',
            accessor: 'title',
            cellClass: 'text-nowrap',
            Cell: (props) => {
                return (
                    <>
                        {props.value}
                        {
                            isOngoingType(props.row.campaign_type) &&
                            <Button
                                // outline
                                color="theme-3"
                                className="icon-button ml-1 edit-button"
                                onClick={() => {
                                    setModalOpen(true);
                                    setEditFormData(props.row);
                                }}
                            >
                                <i className="simple-icon-pencil" />
                            </Button>
                        }
                        <Button
                            // outline
                            color="theme-3"
                            className="icon-button ml-1 edit-button"
                            onClick={() => {
                                setModalOpenDelete(true);
                                setEditFormData(props.row);
                            }}
                        >
                            <i className="simple-icon-trash" />
                        </Button>
                    </>
                );
            }
        },
        {
            Header: 'CAMPAIGN.LIST.TABLE_HEADER.MESSAGE',
            accessor: 'message',
        },
        {
            Header: 'CAMPAIGN.LIST.TABLE_HEADER.INBOX',
            accessor: 'inbox.name',
        },
    ];
    if (isOngoingType()) {
        tableColsAll = [
            ...tableColsAll,
            {
                Header: 'CAMPAIGN.LIST.TABLE_HEADER.STATUS',
                accessor: 'enabled',
                Cell: (props) => {
                    return (
                        <IntlMessages id={props.value ? "CAMPAIGN.LIST.STATUS.ENABLED" : "CAMPAIGN.LIST.STATUS.DISABLED"} />
                    );
                }
            },
            {
                Header: 'CAMPAIGN.LIST.TABLE_HEADER.SENDER',
                accessor: 'sender',
                Cell: (props) => {
                    return (
                        props.value && props.value.name ? props.value.name : <IntlMessages id="CAMPAIGN.LIST.SENDER.BOT" />
                    );
                }
            },
            {
                Header: 'CAMPAIGN.LIST.TABLE_HEADER.URL',
                accessor: 'trigger_rules',
                Cell: (props) => {
                    return (
                        <>
                            {props.row.trigger_rules && props.row.trigger_rules.url
                                &&
                                <a href={props.row.trigger_rules.url}>{props.row.trigger_rules.url}</a>
                            }
                        </>
                    );
                }
            },
            {
                Header: 'CAMPAIGN.LIST.TABLE_HEADER.TIME_ON_PAGE',
                accessor: 'trigger_rules.time_on_page',
            },
        ]
    } else {
        tableColsAll = [
            ...tableColsAll,
            {
                Header: 'CAMPAIGN.LIST.TABLE_HEADER.STATUS',
                accessor: 'campaign_status',
            },
            {
                Header: 'CAMPAIGN.LIST.TABLE_HEADER.SCHEDULED_AT',
                accessor: 'scheduled_at',
                Cell: (props) => {
                    return (
                        <>
                            {getTimeFromTimeStamp(props.value)}
                        </>
                    );
                }
            },
        ];
    }
    const tableCols = React.useMemo(
        () => tableColsAll,
        []
    );
    return (
        <>
            <Row>
                <Colxx xxs="12"
                >
                    {/* <Card className="mb-4"> */}
                    <Nav tabs className="card-header-tabs mb-2">
                        {tabs.map((item) => (<NavItem key={item.campaign_type}>
                            <NavLink
                                to={`${adminRoot}/campaigns/list/${item.campaign_type}`}
                                location={{}}
                                className={`${classnames({
                                    active: activeFirstTab === item.campaign_type,
                                    'nav-link pt-112 pb-012': true,
                                })} `}
                                onClick={() => {
                                    setActiveFirstTab(item.campaign_type);
                                }}
                            >
                                {item.label}
                            </NavLink>
                        </NavItem>))}
                    </Nav>
                    {/* </Card> */}
                </Colxx>
            </Row>
            <Row>
                <DataTableView
                    // colxxs="8"
                    cols={tableCols}
                    items={items.filter(item => item.campaign_type === activeFirstTab)}
                    key="ReactTblContacts"
                    collect={collect}
                />
            </Row>
        </>
    );
};

export default React.memo(ListCampaignsListing);
