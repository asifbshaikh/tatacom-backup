import React from 'react';
import { connect } from 'react-redux';
// import { NavItem, Button } from 'reactstrap';

// import IntlMessages from 'helpers/IntlMessages';
import { getCommentsContactItem } from 'redux/actions';
// import { object } from 'prop-types';

import Comments from 'components/contacts/Comments';

const ContactComments = ({
  id,
  comments,
  loaded,
  getCommentsContactItemAction,
}) => {
  if (!loaded) {
    getCommentsContactItemAction({ id });
  }

  return loaded ? (
    <>
      {comments.map((data) => {
        return <Comments data={data} key={`comments_${data.id}`} />;
      })}
    </>
  ) : (
    <div className="loading" />
  );
};

const mapStateToProps = ({ contactsApp }) => {
  const { loadedComments, comments } = contactsApp;

  return {
    loaded: loadedComments,
    comments,
  };
};
export default connect(mapStateToProps, {
  getCommentsContactItemAction: getCommentsContactItem,
  // getTodoListWithFilterAction: getTodoListWithFilter,
})(ContactComments);
