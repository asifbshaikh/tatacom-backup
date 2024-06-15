import React, { useState, useEffect, useRef } from 'react';
import SmsTemplatesListing from 'containers/campaigns/sms-campaign/smsTemplate/SmsTemplatesListing';
import AddSmsTemplateModal from 'containers/campaigns/sms-campaign/smsTemplate/AddSmsTemplateModal';
import SmsTemplateHeading from 'containers/campaigns/sms-campaign/smsTemplate/SmsTemplateHeading';
import DeleteSmsTemplateModal from 'containers/campaigns/sms-campaign/smsTemplate/DeleteSmsTemplateModal';
import { connect } from 'react-redux';
import {
  getSmsCampaignsTemplatesAll,
  getSearchSmsTemplates,
} from 'redux/campaigns/actions';

const SMSTemplate = ({
  match,
  getallTemplates,
  loadedCampaigns,
  templates,
  totalCount,
  getSearchTemplates,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenDelete, setModalOpenDelete] = useState(false);
  const [fetchAllTemplates,setFetchAllTemplates] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [viewData, setViewData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const pageSizes = [10, 15];
  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;
  const totalPageCount = Math.ceil(totalCount / selectedPageSize);
  const [searchValue, setSearchValue] = useState('');

  const timeoutHandler = useRef(null);

  const searchTemplate = (searchQuery) => {
    if (timeoutHandler.current) {
      clearTimeout(timeoutHandler.current);
    }
    timeoutHandler.current = setTimeout(() => {
      if (searchQuery) {
        getSearchTemplates({
          searchWord: searchQuery.trim(),
          page: currentPage,
          selectedPageSize,
        });
      } else {
        getallTemplates({ page: currentPage, selectedPageSize });
      }
    }, 1000);
  };
  useEffect(() => {
    if (searchValue) {
      searchTemplate(searchValue);
    } else {
      getallTemplates({ page: currentPage, selectedPageSize });
    }

  }, [currentPage, selectedPageSize, fetchAllTemplates]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setSelectedPageSize(size);
  };

  const handleToggleModal = () => {
    setModalOpenDelete(!modalOpenDelete);
    setEditFormData({});
    if(modalOpenDelete){
      setFetchAllTemplates(!fetchAllTemplates);
    }
  };

  return !loadedCampaigns ? (
    <div className="loading" />
  ) : (
    <>
      <SmsTemplateHeading
        heading="SMS_TEMPLATE.HEADER"
        match={match}
        toggleModal={() => setModalOpen(!modalOpen)}
        pageSizes={pageSizes}
        changePageSize={handlePageSizeChange}
        selectedPageSize={selectedPageSize}
        totalItemCount={totalCount}
        startIndex={startIndex}
        endIndex={endIndex}
        onSearchKey={searchTemplate}
        setSearchValue={setSearchValue}
        searchValue={searchValue}
      />
      <SmsTemplatesListing
        items={templates}
        setModalOpen={setModalOpen}
        setModalOpenDelete={setModalOpenDelete}
        setEditFormData={setEditFormData}
        setViewData={setViewData}
        currentPage={currentPage}
        totalPage={totalPageCount}
        onChangePage={handlePageChange}
      />

      <AddSmsTemplateModal
        modalOpen={modalOpen}
        toggleModal={() => {
          setModalOpen(!modalOpen);
          setEditFormData({});
          setViewData(false);
        }}
        editFormData={editFormData}
        viewData={viewData}
      />

      <DeleteSmsTemplateModal
        modalOpen={modalOpenDelete}
        toggleModal={handleToggleModal}
        editFormData={editFormData}
      />
    </>
  );
};

const mapStateToProps = ({ campaignsApp }) => {
  const {
    loadedCampaigns,
    smsCampaignTemplates: { templates, totalCount },
  } = campaignsApp;
  return { loadedCampaigns, templates, totalCount };
};

export default connect(mapStateToProps, {
  getallTemplates: getSmsCampaignsTemplatesAll,
  getSearchTemplates: getSearchSmsTemplates,
})(SMSTemplate);
