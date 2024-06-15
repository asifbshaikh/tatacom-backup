import React from 'react';
import { Colxx } from 'components/common/CustomBootstrap';

const ThumbListView = ({ product, isSelect, collect, onCheckItem }) => {
  return (
    <Colxx xxs="12" key={product.id} className="mb-3">
      <></>
    </Colxx>
  );
};

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(ThumbListView);
