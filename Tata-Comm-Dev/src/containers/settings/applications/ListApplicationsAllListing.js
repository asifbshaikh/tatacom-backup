/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */

import React from 'react';
// import moment from 'moment';
import {
    Row, Button, Card, CardBody,
    // CardTitle,
    CardSubtitle,
    CardText,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import ThumbnailImage from 'components/cards/ThumbnailImage';
import { Colxx } from 'components/common/CustomBootstrap';


// import IntlMessages from 'helpers/IntlMessages';
import { adminRoot } from 'constants/defaultValues';
import IntlMessages from 'helpers/IntlMessages';


const ListAgentsListing = ({
    items,
}) => {
    return (
        <Row>
            <Colxx
                // md="6"
                // sm="6"
                // lg="4"
                xxs="12"
            >
                {items.map((item) => {
                    return (
                        <Card className="d-flex flex-row mb-4" key={`app_card_${item.id}`}>
                            {/* <NavLink to={`${adminRoot}/cards`} className="d-flex"> */}
                            <ThumbnailImage
                                rounded
                                src={`/assets/img/tring/integrations/${item.logo}`}
                                alt={item.name}
                                className="m-4"
                            />
                            {/* </NavLink> */}
                            <div className=" d-flex flex-grow-1 min-width-zero">
                                <CardBody className=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                    <div className="min-width-zero">
                                        {/* <NavLink to={`${adminRoot}/cards`}> */}
                                        <CardSubtitle className="truncate mb-1">
                                            {item.name}
                                        </CardSubtitle>
                                        {/* </NavLink> */}
                                        <CardText className="text-muted text-small mb-2">
                                            {item.description}
                                        </CardText>
                                        <CardText className="text-muted text-small mb-2">
                                            <Button size="xs" disabled color={item.hooks.length ? "primary" : "secondary"}>
                                                <IntlMessages id={item.hooks.length ? "INTEGRATION_APPS.STATUS.ENABLED" : "INTEGRATION_APPS.STATUS.DISABLED"} />
                                            </Button>
                                        </CardText>
                                        <NavLink to={`${adminRoot}/settings/applications/${item.id}`} className="d-flex">
                                            <Button outline size="xs" color="primary">
                                                <IntlMessages id="INTEGRATION_APPS.CONFIGURE" />
                                            </Button>
                                        </NavLink>
                                    </div>
                                </CardBody>
                            </div>
                        </Card>
                    )
                })}
            </Colxx>
        </Row>
    );
};

export default React.memo(ListAgentsListing);
