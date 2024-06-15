import React, { useEffect } from 'react';
import { Input } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchTemplatesRequest } from 'redux/campaigns/actions';
import IntlMessages from 'helpers/IntlMessages';

const TemplateSearch = ({
  loading,
  error,
  templates,
  fetchTemplatesRequestAction,
}) => {
  useEffect(() => {
    fetchTemplatesRequestAction();
  }, [fetchTemplatesRequestAction]);

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
      <div className="template-grid">
        {templates.map((result) => (
          <div key={result.id}>
            <img className="template-image" src={result.body} alt="" />
            <p className="template-align">{result.name}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <Input
        type="text"
        placeholder="Search for templates"
        className="search-input"
      />
      {content}
    </div>
  );
};
const mapStateToProps = ({ campaignsApp }) => {
  const { templates, loading, error } = campaignsApp;
  return {
    templates,
    loading,
    error,
  };
};
export default connect(mapStateToProps, {
  fetchTemplatesRequestAction: fetchTemplatesRequest,
})(TemplateSearch);
