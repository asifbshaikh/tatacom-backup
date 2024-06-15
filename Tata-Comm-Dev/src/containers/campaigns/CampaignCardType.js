import React from 'react';
import { Card, Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';

const CampaignCardType = ({ cardsList, form, identifier, className }) => {
  const { values, setFieldValue } = form;
  return (
    <Row className={`pd-3 ${className}-campaigncardrow`}>
      {cardsList.map((card) => {
        return (
          <Colxx
            xxs="12"
            md="4"
            className={`p-3 ${className}-campaigncardcolumn`}
            key={card.type}
          >
            <Card
              data-testid={card.type}
              style={{ cursor: 'pointer' }}
              color={values[identifier] === card.type ? 'primary' : 'inherit'}
              onClick={() => setFieldValue(identifier, card.type)}
              className={`${className}-campaigncardcontent d-flex flex-row  justify-content-center align-items-center p-4 shadow`}
            >
              <i
                className={`${className}-iconsize ${card.icon} display-2 p-2`}
              />
              <h2 className="p-2">{card.label}</h2>

              {card.description && (
                <p className="p-2 text-center">{card.description}</p>
              )}
            </Card>
          </Colxx>
        );
      })}
    </Row>
  );
};

export default CampaignCardType;
