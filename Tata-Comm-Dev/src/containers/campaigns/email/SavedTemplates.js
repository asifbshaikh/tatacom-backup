import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap';
import parser from 'html-react-parser';
import IntlMessages from 'helpers/IntlMessages';
import Pagination from 'containers/pages/Pagination';
import { connect } from 'react-redux';
import { fetchEmailTemplatesRequest } from 'redux/campaigns/actions';
import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';
import DOMPurify from 'dompurify';

const SavedTemplates = ({
  loading,
  error,
  savedTemplates,
  totalCount,
  fetchEmailTemplatesRequestAction,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const selectedPageSize = ContentConfigurationEnums.TOTAL_PAGE_COUNT;
  const totalPage = Math.ceil(totalCount / selectedPageSize);

  useEffect(() => {
    fetchEmailTemplatesRequestAction(currentPage, 4);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  let content;

  if (loading) {
    content = (
      <p>
        <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.LOADING" />
      </p>
    );
  } else if (error) {
    content = <p>{error.message}</p>;
  } else {
    content = (
      <div className="template-view-row">
        {savedTemplates
          ?.filter((result) =>
            result.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((result) => (
            <div key={result.id} className="templateView">
              <div>{parser(DOMPurify.sanitize(result.body))}</div>
              <></>
              <p className="template-name">{result.name}</p>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div>
      <div>
        <Input
          type="text"
          placeholder="Search for templates"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <br />
        <div>{content}</div>
      </div>
      <div>
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          onChangePage={(i) => handlePageChange(i)}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ campaignsApp }) => {
  const {
    loading,
    error,
    emailCampaignTemplates: { savedTemplates, totalCount },
  } = campaignsApp;
  return {
    loading,
    error,
    savedTemplates,
    totalCount,
  };
};

export default connect(mapStateToProps, {
  fetchEmailTemplatesRequestAction: fetchEmailTemplatesRequest,
})(SavedTemplates);
