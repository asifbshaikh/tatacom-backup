import React from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardBody, CardSubtitle, CardText } from 'reactstrap';

import Thumbnail from 'components/common/Thumbnail';
import SocialLinks from 'components/cards/SocialLinks';

// import ThumbnailImage from './ThumbnailImage';

const ContactCardBasic = ({ link = '#', data }) => {
  return (
    <Card className="d-flex flex-row mb-4">
      <NavLink to={link} className="d-flex">
        {/* <ThumbnailImage
          rounded
          small
          src={data.thumbnail}
          alt="profile"
          className="m-4"
        /> */}
        <Thumbnail source={data.thumbnail} name={data.name} defaultWidth classNameCustom="m-4" />
      </NavLink>
      <div className=" d-flex flex-grow-1 min-width-zero">
        <CardBody className=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
          <div className="min-width-zero">
            <NavLink to={link}>
              <CardSubtitle title={data.name} className="truncate mb-1">{data.name}</CardSubtitle>
            </NavLink>
            <CardText className="text-muted text-small mb-2">
              {data.email}
            </CardText>
            <CardText className="text-muted text-small mb-2">
              {data.phone_number}
            </CardText>
            <CardText className="text-muted text-small mb-2">
              <div className='social-icons'>
                <div className='list-unstyled list-inline'>
                  <SocialLinks props={data} className="list-inline-item" />
                </div>
              </div>
            </CardText>
          </div>
        </CardBody>
      </div>
    </Card>
  );
};

export default React.memo(ContactCardBasic);
