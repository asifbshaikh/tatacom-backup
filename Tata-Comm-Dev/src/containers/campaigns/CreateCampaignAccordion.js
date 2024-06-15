import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import React, { useState } from 'react';
import { Button, Collapse, ListGroupItem, Row } from 'reactstrap';

const CreateCampaignAccordion = ({
  children,
  btnLabel,
  handleBtnClik,
  heading,
  hideHeading = false,
}) => {
  const [openAccordion, setOpenAccordion] = useState(true);
  return (
    <div className="pl-2 pr-2 pt-1 pb-2">
      <Row className="pt-3 pb-3 m-2 segment-filter-block">
        {!hideHeading && (
          <>
            <Colxx xxs="12" className="border-bottom-primary">
              <ListGroupItem
                data-testid="accordionHeading"
                className="d-flex align-items-center font-weight-bold border-0"
                onClick={() => setOpenAccordion(!openAccordion)}
              >
                {' '}
                <i
                  className={
                    openAccordion
                      ? 'iconsminds-arrow-down mr-1'
                      : 'iconsminds-arrow-right mr-1'
                  }
                />
                {heading ? (
                  <span>{heading}</span>
                ) : (
                  <span>
                    <IntlMessages id="CREATE_SEGMENT.NO_RULES_DEFINED" />
                  </span>
                )}
              </ListGroupItem>
            </Colxx>
          </>
        )}
        <Colxx xxs="12">
          <Collapse isOpen={openAccordion}>{children}</Collapse>
        </Colxx>

        {btnLabel && (
          <Colxx xxs="12" md="3" className="m-2 mt-3">
            <Button onClick={handleBtnClik}>
              <i className="iconsminds-add" />
              {btnLabel}
            </Button>
          </Colxx>
        )}
      </Row>
    </div>
  );
};

export default CreateCampaignAccordion;
