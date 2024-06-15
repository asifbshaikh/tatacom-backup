/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
import React from 'react';
import { Row } from 'reactstrap';

import IntlMessages from 'helpers/IntlMessages';
import allRecords from 'data/products';
import {
  TringReactTable,
  ReactTableWithPaginationCard,
  ReactTableDivided,
} from 'containers/ui/TringReactTable';
import { Colxx } from 'components/common/CustomBootstrap';

import Pagination from '../pages/Pagination';
import ContextMenuContainer from '../pages/ContextMenuContainer';
import DataListView from './DataListView';
import DataTableView from './DataTableView';
import ImageListView from '../pages/ImageListView';
import ThumbListView from '../pages/ThumbListView';


function collect(props) {
  return { data: props.data };
}

const ListPageListing = ({
  items,
  displayMode,
  selectedItems,
  onCheckItem,
  currentPage,
  totalPage,
  onContextMenuClick,
  onContextMenu,
  onChangePage,
}) => {
  const tableCols =  React.useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'id',
        cellClass: 'text-muted w-40',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'Name',
        accessor: 'name',
        cellClass: 'text-muted w-40',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'Email',
        accessor: 'email',
        cellClass: 'text-muted w-40',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'Phone Number',
        accessor: 'phone_number',
        cellClass: 'text-muted w-40',
        Cell: (props) => <>{props.value}</>,
      },
    ],
    []
  );

    const cols = React.useMemo(
      () => [
        {
          Header: 'Name',
          accessor: 'title',
          cellClass: 'list-item-heading w-40',
          Cell: (props) => <>{props.value}</>,
        },
        {
          Header: 'Sales',
          accessor: 'sales',
          cellClass: 'text-muted w-10',
          Cell: (props) => <>{props.value}</>,
        },
        {
          Header: 'Stock',
          accessor: 'stock',
          cellClass: 'text-muted w-10',
          Cell: (props) => <>{props.value}</>,
          Filter: 'NumberRangeColumnFilter',
          filter: 'between',
        },
        {
          Header: 'Category',
          accessor: 'category',
          cellClass: 'text-muted w-40',
          Cell: (props) => <>{props.value}</>,
          Filter: 'SelectColumnFilter',
          filter: 'includes',
        },
      ],
      []
    );
    const colsNew =  React.useMemo(
      () => [
        {
          Header: 'Id',
          accessor: 'id',
          cellClass: 'text-muted w-40',
          Cell: (props) => <>{props.value}</>,
        },
        {
          Header: 'Name',
          accessor: 'name',
          cellClass: 'text-muted w-40',
          Cell: (props) => <>{props.value}</>,
        },
        {
          Header: 'Email',
          accessor: 'email',
          cellClass: 'text-muted w-40',
          Cell: (props) => <>{props.value}</>,
        },
        {
          Header: 'Phone Number',
          accessor: 'phone_number',
          cellClass: 'text-muted w-40',
          Cell: (props) => <>{props.value}</>,
        },
      ],
      []
    );
  return (
    <Row>
      {items.map((product) => {
        if (displayMode === 'imagelist') {
          return (
            <ImageListView
              key={product.id}
              product={product}
              isSelect={selectedItems.includes(product.id)}
              collect={collect}
              onCheckItem={onCheckItem}
            />
          );
        }
        if (displayMode === 'thumblist') {
          return (
            <ThumbListView
              key={product.id}
              product={product}
              isSelect={selectedItems.includes(product.id)}
              collect={collect}
              onCheckItem={onCheckItem}
            />
          );
        }
        return (
          <DataListView
            key={product.id}
            product={product}
            isSelect={selectedItems.includes(product.id)}
            onCheckItem={onCheckItem}
            collect={collect}
          />
        );
      })}
      <DataTableView 
            cols={tableCols} 
            items={items}
            key="ReactTblContacts"
            // product={product}
            isSelect={false}
            onCheckItem={onCheckItem}
            collect={collect}
          />
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onChangePage={(i) => onChangePage(i)}
      />
      <ContextMenuContainer
        onContextMenuClick={onContextMenuClick}
        onContextMenu={onContextMenu}
      />
      
      
      <Colxx xxs="12">
          <h3 className="mb-4">
            <IntlMessages id="table.react-tables" />
          </h3>
        </Colxx>

<Colxx xxs="12">
  <TringReactTable cols={colsNew} items={items} />
</Colxx>

        <Colxx xxs="12">
          <TringReactTable cols={cols} items={allRecords} />
        </Colxx>

        <Colxx xxs="12">
          <ReactTableWithPaginationCard props={{name: '123'}} />
        </Colxx>

        <Colxx xxs="12">
          <ReactTableDivided />{' '}
        </Colxx>
    </Row>
  );
};

export default React.memo(ListPageListing);
