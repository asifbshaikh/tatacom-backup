import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';
import {
  fetchEmailTemplatesRequest,
  addEmailTemplateSuccess,
} from 'redux/actions';
import { Formik } from 'formik';
import Pagination from 'containers/pages/Pagination';
import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import CardContentConfiguration from './CardContentConfiguration';
import TemplateCards from './TemplateCards';
import SavedTemplatesWrapper from './SavedTemplatesWrapper';

const DragAndDropEditor = ({
  formRef,
  loading,
  error,
  savedTemplates,
  totalCount,
  fetchEmailTemplatesRequestAction,
  addEmailTemplateAcion,
  emailTemplate,
  handleSubmit,
  templatePageChangeRef,
  emailEditorRef,
  setDisableNextButton,
}) => {
  let isChoosenDefault = false;
  if (emailTemplate && emailTemplate.id) {
    isChoosenDefault = true;
  }
  const [isChoose, setIsChoose] = useState(isChoosenDefault);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const selectedPageSize = ContentConfigurationEnums.TOTAL_PAGE_COUNT;
  const totalPage = Math.ceil(totalCount / selectedPageSize);

  const fetchEmailTemplates = () => {
    fetchEmailTemplatesRequestAction(currentPage, 6);
  };

  useEffect(() => {
    fetchEmailTemplates();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onChooseExistingTemplate = (data) => {
    setIsChoose(true);
    addEmailTemplateAcion(data);
  };

  useEffect(() => {
    if (templatePageChangeRef) {
      templatePageChangeRef.current = fetchEmailTemplates;
    }
  }, []);

  return (
    <>
      {isChoose ? (
        <CardContentConfiguration
          formRef={formRef}
          setIsChoose={setIsChoose}
          handleSubmit={handleSubmit}
          templatePageChangeRef={templatePageChangeRef}
          emailEditorRef={emailEditorRef}
          setDisableNextButton={setDisableNextButton}
        />
      ) : (
        <div>
          <div className="d-flex">
            <TemplateCards
              title="blankTemplate"
              isChoose={isChoose}
              setIsChoose={setIsChoose}
            />
          </div>
          <div>
            <div className="d-flex">
              <h6 className="title-of-cards">
                <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEMPLATE.BLANK" />
              </h6>
            </div>
          </div>
          <div>
            <Row>
              <Colxx xxs="12" md="6" className="py-4">
                <h2>
                  <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEMPLATE.SAVED_TEMPLATES" />
                </h2>
              </Colxx>
              <Colxx
                xxs="12"
                md="6"
                className="py-4"
                data-testid="search-input"
              >
                <Formik initialValues={{ searchText: '' }}>
                  <FormGroupCoustom
                    type="text"
                    identifier="searchText"
                    identifierLabel="EMAIL_CONTENT_CONFIGURATION.TEMPLATE.SEARCH_PLACEHOLDER"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Formik>
              </Colxx>
            </Row>
            <div>
              {error && <p>{error.message}</p>}
              {loading && (
                <p>
                  <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.LOADING" />
                </p>
              )}
              {!error && !loading && (
                <SavedTemplatesWrapper
                  onChooseExistingTemplate={onChooseExistingTemplate}
                  savedTemplates={savedTemplates}
                  searchQuery={searchQuery}
                />
              )}
            </div>
            <Row>
              <Colxx xxs="12">
                <Pagination
                  currentPage={currentPage}
                  totalPage={totalPage}
                  onChangePage={(i) => handlePageChange(i)}
                />
              </Colxx>
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ campaignsApp }) => {
  const {
    loading,
    error,
    emailCampaignTemplates: { savedTemplates, totalCount },
    emailTemplate,
  } = campaignsApp;
  return {
    loading,
    error,
    savedTemplates,
    totalCount,
    emailTemplate,
  };
};

export default connect(mapStateToProps, {
  fetchEmailTemplatesRequestAction: fetchEmailTemplatesRequest,
  addEmailTemplateAcion: addEmailTemplateSuccess,
})(DragAndDropEditor);
