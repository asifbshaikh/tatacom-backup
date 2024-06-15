import React from 'react';
import { NavLink } from 'react-router-dom';

import Thumbnail from 'components/common/Thumbnail';
// import { adminRoot } from 'constants/defaultValues';

import { getTimeFromTimeStamp } from 'helpers/TringReactHelper';

// import { injectIntl } from 'react-intl';

// const Comments = ({ intl, className, data }) => {
const Comments = ({ className, data }) => {
  // const getLikeLabel = (likeCount) => {
  //     if (likeCount === 1) {
  //       return intl.messages['pages.like'];
  //     }
  //     return intl.messages['pages.likes'];
  //   };
  return (
    <div
      className={`d-flex flex-row mb-3 border-bottom justify-content-between ${className}`}
    >
      <NavLink to="#" location={{}}>
        {/* <NavLink to={`${adminRoot}/contacts/details/${data.user.id}`}> */}
        {/* <img
          src={data.user.thumbnail}
          alt={data.user.name}
          className="img-thumbnail border-0 rounded-circle list-thumbnail align-self-center xsmall"
        /> */}
        <Thumbnail
          source={data.user.thumbnail}
          name={data.user.name ? data.user.name : data.user.email}
        />
      </NavLink>
      <div className="pl-3 flex-grow-1">
        <NavLink to="#" location={{}}>
          <p className="font-weight-medium mb-0">
            {data.user.name ? data.user.name : data.user.email}
          </p>
          {/* <p className="text-muted mb-0 text-small">{data.user.data}</p> */}
        </NavLink>
        <p className="mt-3 directContent">{data.content}</p>
      </div>
      <div className="comment-likes">
        <span className="post-icon">
          {/* <NavLink to="#" location={{}}> */}
          <span>{getTimeFromTimeStamp(data.created_at)}</span>
          {/* <i className="simple-icon-heart ml-2" /> */}
          {/* </NavLink> */}
        </span>
      </div>
    </div>
  );
};

export default Comments;
// export default injectIntl(Comments);
