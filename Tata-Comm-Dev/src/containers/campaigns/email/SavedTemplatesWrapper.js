import React from 'react';
import DOMPurify from 'dompurify';
import parser from 'html-react-parser';
import { Button, Row } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx } from 'components/common/CustomBootstrap';

const SavedTemplatesWrapper = ({
  onChooseExistingTemplate,
  savedTemplates,
  searchQuery,
}) => {
  return (
    <div>
      <Row>
        {savedTemplates
          ?.filter((result) =>
            result.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((result) => (
            <Colxx
              xxs="12"
              sm="2"
              md="4"
              key={result.id}
              className="templateView"
            >
              <div className="button">
                <Button
                  className="template-card-button1"
                  onClick={() => {
                    onChooseExistingTemplate(result);
                  }}
                >
                  <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.CHOOSE" />
                </Button>
              </div>
              <div className="content">
                {parser(DOMPurify.sanitize(result.body))}
              </div>
              <p className="template-name">{result.name}</p>
            </Colxx>
          ))}
      </Row>
    </div>
  );
};

export default SavedTemplatesWrapper;
