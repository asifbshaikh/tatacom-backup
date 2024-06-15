import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ListPageHeading from 'containers/contacts/ListPageHeading';
import AddNewModal from 'containers/contacts/AddNewModal';
import DeleteModal from 'containers/contacts/DeleteModal';
import ListPageListing from 'containers/contacts/ListPageListing';
import ContactApplicationMenu from 'containers/contacts/ContactApplicationMenu';
import useMousetrap from 'hooks/use-mousetrap';
import { contactFilterSuccess, getContactsList } from 'redux/actions';
import { adminRoot } from 'constants/defaultValues';
import Pagination from 'containers/pages/Pagination';
import ContactsEnums from 'enums/contacts/contactsEnums';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { handleAppliedContactFilter } from 'helpers/contactsFiltersHelpers';

const getIndex = (value, arr, prop) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][prop] === value) {
      return i;
    }
  }
  return -1;
};

const orderOptions = [
  { column: 'name', label: 'CONTACTS_PAGE.LIST.TABLE_HEADER.NAME' },
  { column: 'email', label: 'CONTACTS_PAGE.LIST.TABLE_HEADER.EMAIL_ADDRESS' },
  {
    column: 'phone_number',
    label: 'CONTACTS_PAGE.LIST.TABLE_HEADER.PHONE_NUMBER',
  },
  { column: 'company', label: 'CONTACTS_PAGE.LIST.TABLE_HEADER.COMPANY' },
  { column: 'city', label: 'CONTACTS_PAGE.LIST.TABLE_HEADER.CITY' },
  { column: 'country', label: 'CONTACTS_PAGE.LIST.TABLE_HEADER.COUNTRY' },
  {
    column: 'last_activity_at',
    label: 'CONTACTS_PAGE.LIST.TABLE_HEADER.LAST_ACTIVITY',
  },
];
const orderOptionsDir = [
  { column: '', label: 'Ascending' },
  { column: '-', label: 'Descending' },
];
const pageSizes = [15];

const DataListPages = ({
  match,
  loadedContactsList,
  contactsList,
  reloadList,
  setReloadList,
  setSearch,
  currentPage,
  setCurrentPage,
  selectedPageSize,
  setSelectedPageSize,
  selectedOrderOption,
  setSelectedOrderOption,
  selectedOrderOptionDir,
  setSelectedOrderOptionDir,
  getContactsListAction,
  search,
  listingFilter,
  contactFilterSegment,
  contactFilterSuccessAction,
}) => {
  const queryParams = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayMode, setDisplayMode] = useState('list');
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenDelete, setModalOpenDelete] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [items, setItems] = useState([]);
  const [lastChecked, setLastChecked] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const history = useHistory();

  const onImportClick = () => {
    history.push(`${adminRoot}/segments/import-users/list`);
  };

  useEffect(() => {
    if (loadedContactsList && contactsList.meta && contactsList.payload) {
      const { meta, payload } = contactsList;
      const limit = 15;
      const totalPageCount = Math.ceil(meta.count / limit);
      setTotalPage(totalPageCount);
      setItems(payload);
      setSelectedItems([]);
      setTotalItemCount(meta.count);
      setSelectedPageSize(limit);
      setIsLoaded(true);
    }
  }, [contactsList]);

  const filterId = queryParams?.filterId;

  useEffect(() => {
    if (filterId) {
      const params = {
        currentPage,
        selectedOrderOptionDir,
        selectedOrderOption,
      };
      const selectedContactFilter = contactFilterSegment?.filter((data) => {
        if (data?.id == filterId) {
          return data;
        }
      });
      if (selectedContactFilter[0]) {
        const contactFilter = handleAppliedContactFilter(
          selectedContactFilter[0]
        );
        params.payload = contactFilter;
        getContactsListAction(params);
      }
    } else {
      const params = {
        search,
        listingFilter,
        currentPage,
        selectedOrderOptionDir,
        selectedOrderOption,
      };
      getContactsListAction(params);
    }
    contactFilterSuccessAction(false);
  }, [
    selectedPageSize,
    currentPage,
    selectedOrderOption,
    selectedOrderOptionDir,
    search,
    listingFilter,
    reloadList,
    contactFilterSegment,
    filterId,
  ]);

  const onCheckItem = (event, id) => {
    if (
      event.target.tagName === 'A' ||
      (event.target.parentElement && event.target.parentElement.tagName === 'A')
    ) {
      return true;
    }
    if (lastChecked === null) {
      setLastChecked(id);
    }

    let selectedList = [...selectedItems];
    if (selectedList.includes(id)) {
      selectedList = selectedList.filter((x) => x !== id);
    } else {
      selectedList.push(id);
    }
    setSelectedItems(selectedList);

    if (event.shiftKey) {
      let newItems = [...items];
      const start = getIndex(id, newItems, 'id');
      const end = getIndex(lastChecked, newItems, 'id');
      newItems = newItems.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...newItems.map((item) => {
          return item.id;
        })
      );
      selectedList = Array.from(new Set(selectedItems));
      setSelectedItems(selectedList);
    }
    document.activeElement.blur();
    return false;
  };

  const handleChangeSelectAll = (isToggle) => {
    if (selectedItems.length >= items.length) {
      if (isToggle) {
        setSelectedItems([]);
      }
    } else {
      setSelectedItems(items.map((x) => x.id));
    }
    document.activeElement.blur();
    return false;
  };

  const onContextMenuClick = () => {};

  const onContextMenu = (e, data) => {
    const clickedProductId = data.data;
    if (!selectedItems.includes(clickedProductId)) {
      setSelectedItems([clickedProductId]);
    }

    return true;
  };

  useMousetrap(['ctrl+a', 'command+a'], () => {
    handleChangeSelectAll(false);
  });

  useMousetrap(['ctrl+d', 'command+d'], () => {
    setSelectedItems([]);
    return false;
  });

  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;

  const loaded = true;

  const handleSearch = (e) => {
    setTimeout(() => {
      if (e.target.value === ContactsEnums.PLUS_ICON) {
        setSearch('');
      } else {
        setSearch(e.target.value.toLowerCase());
      }
    }, 1000);
  };

  return !isLoaded ? (
    <div className="loading" />
  ) : (
    <>
      <div className="d-flex flex-column">
        <ListPageHeading
          heading="CONTACTS_PAGE.HEADER"
          displayMode={displayMode}
          changeDisplayMode={setDisplayMode}
          handleChangeSelectAll={handleChangeSelectAll}
          changeOrderBy={(column) => {
            setSelectedOrderOption(
              orderOptions.find((x) => x.column === column)
            );
          }}
          changeOrderByDir={(column) => {
            setSelectedOrderOptionDir(
              orderOptionsDir.find((x) => x.column === column)
            );
          }}
          changePageSize={setSelectedPageSize}
          selectedPageSize={selectedPageSize}
          totalItemCount={totalItemCount}
          selectedOrderOption={selectedOrderOption}
          selectedOrderOptionDir={selectedOrderOptionDir}
          match={match}
          startIndex={startIndex}
          endIndex={endIndex}
          selectedItemsLength={selectedItems ? selectedItems.length : 0}
          itemsLength={items ? items.length : 0}
          handleSearch={handleSearch}
          orderOptions={orderOptions}
          orderOptionsDir={orderOptionsDir}
          pageSizes={pageSizes}
          toggleModal={() => setModalOpen(!modalOpen)}
          toggleModalImport={onImportClick}
        />
        <AddNewModal
          modalOpen={modalOpen}
          toggleModal={() => {
            setModalOpen(!modalOpen);
            setEditFormData({}); // reset edit form
          }}
          editFormData={editFormData}
          reloadList={reloadList}
          setReloadList={setReloadList}
        />
        <DeleteModal
          modalOpen={modalOpenDelete}
          toggleModal={() => {
            setModalOpenDelete(!modalOpenDelete);
            setEditFormData({}); // reset edit form
          }}
          editFormData={editFormData}
          reloadList={reloadList}
          setReloadList={setReloadList}
        />
        <ListPageListing
          items={items}
          displayMode={displayMode}
          selectedItems={selectedItems}
          onCheckItem={onCheckItem}
          currentPage={currentPage}
          totalPage={totalPage}
          onContextMenuClick={onContextMenuClick}
          onContextMenu={onContextMenu}
          onChangePage={setCurrentPage}
          setModalOpen={setModalOpen}
          setModalOpenDelete={setModalOpenDelete}
          setEditFormData={setEditFormData}
        />
        <div className="contact-pagination">
          <Pagination
            currentPage={currentPage}
            totalPage={totalPage}
            onChangePage={(i) => setCurrentPage(i)}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ contactsApp }) => {
  const { loadedContactsList, contactsList, contactFilterSegment } =
    contactsApp;
  return {
    contactFilterSegment,
    loadedContactsList,
    contactsList,
  };
};
export default connect(mapStateToProps, {
  getContactsListAction: getContactsList,
  contactFilterSuccessAction: contactFilterSuccess,
})(DataListPages);
