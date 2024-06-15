/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable camelcase */

import React from 'react';
// import moment from 'moment';
import {
    // Row,
    // Button,
    // Card,
    // CardBody,
    // CardSubtitle,
    // Nav,
    NavItem,
} from 'reactstrap';


// import { getChannelNameFromType } from 'helpers/TringIconHelper';

import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
// import { adminRoot } from 'constants/defaultValues';

// import DataTableView from 'containers/contacts/DataTableView';

// import IntlMessages from 'helpers/IntlMessages';

const ReportStatsCard = ({
    desc,
    heading,
    // index,
    // item,
    onClick,
    point,
    trend,
    selected,
}) => {
    return (
        <NavItem>
            <NavLink
                to="#"
                location={{}}
                className={`${classnames({
                    active: selected,
                    'nav-link pt-112 pb-012': true,
                })} `}
                onClick={onClick}
            >
                <div>
                    <div>{heading}</div>
                    <div className='text-center'>
                        {point}
                        {trend !== 0 &&
                            <span
                                className={trend > 0 ? 'badge-info' : 'badge-danger'}
                            >
                                {trend > 0 ? `+${trend}%` : `${trend}%`}
                            </span>
                        }
                    </div>
                    <div className='text-center'>{desc}</div>
                </div>
            </NavLink>
        </NavItem>
    );
};

export default ReportStatsCard;
