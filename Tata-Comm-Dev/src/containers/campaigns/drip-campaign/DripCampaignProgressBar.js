import React, { createRef, useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Button, Row } from 'reactstrap';
import { Wizard, Steps, Step } from 'react-albus';
import { connect } from 'react-redux';
import IntlMessages from 'helpers/IntlMessages';
import S3SFTPImportEnums from 'enums/s3sftp/s3stfpImportEnums';
import CustomTopNavigation from 'components/wizard/CustomTopNavigation';
import FlowsEnums from 'enums/campaigns/flowsEnums';
import DetailsAndGoals from './DetailsAndGoals';
import FlowConditions from './FlowConditions';

import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { injectIntl } from 'react-intl';
import FlowTargetAudience from './FlowTargetAudience';

const DripCampaignProgressBar = ({ flowName }) => {
  const flowSteps = [
    {
      route: FlowsEnums.DETAILS_GOALS,
      name: <IntlMessages id="DRIP_CAMPAIGN.WIZARD.DETAILS_GOALS" />,
    },
    {
      route: FlowsEnums.FLOW_CONDITIONS,
      name: <IntlMessages id="DRIP_CAMPAIGN.WIZARD.FLOW_CONDITIONS" />,
    },
    {
      route: FlowsEnums.TARGET_AUDIENCE,
      name: <IntlMessages id="DRIP_CAMPAIGN.WIZARD.TARGET_AUDIENCE" />,
    },
  ];

  const [forms, setForms] = useState([]);

  useEffect(() => {
    const formRefs = flowSteps.map(() => createRef(null));
    setForms(formRefs);
  }, []);

  const getFlowsHeader = useCallback(() => {
    let flowHeader = '';
    flowHeader = flowName ?? '';
    return flowHeader;
  }, [flowName]);

  return (
    <>
      <Row>
        <div className="container d-flex">
          <span
            className="d-flexbutton-pointer-cursor ml-30"
            role="button"
            tabIndex={0}
          >
            <h2>
              {flowName.length > 20 ? (
                <div title={flowName}>
                  {flowName.substring(0, 20).concat('...')}
                </div>
              ) : (
                getFlowsHeader()
              )}
            </h2>
          </span>

          <span
            className="d-flexbutton-pointer-cursor ml-10 rtl skip-canvas-btn mr-3"
            onClick={() => {}}
            role="button"
            tabIndex={0}
            onKeyDown={() => {}}
          >
            <h6 className="font-weight-bold">
              <IntlMessages id="DRIP_CAMPAIGN.SKIP_TO_CANVAS" />
            </h6>
          </span>
        </div>
      </Row>
      <Separator className="mb-5" />

      <Card>
        <CardBody className="wizard wizard-default">
          <Wizard>
            <CustomTopNavigation
              className="justify-content-center"
              disableNav
            />
            <Steps>
              {flowSteps.map((FlowStep, index) => {
                const commonparams = {
                  form: forms[index],
                };
                return (
                  <Step
                    key={FlowStep.route}
                    id={FlowStep.route}
                    name={FlowStep.name}
                  >
                    {({ next, previous }) => {
                      commonparams.next = next;
                      commonparams.previous = previous;
                      return (
                        <>
                          {FlowStep.route === FlowsEnums.DETAILS_GOALS && (
                            <DetailsAndGoals {...commonparams} />
                          )}
                          {FlowStep.route === FlowsEnums.FLOW_CONDITIONS && (
                            <FlowConditions {...commonparams} />
                          )}
                          {FlowStep.route === FlowsEnums.TARGET_AUDIENCE && (
                            <FlowTargetAudience {...commonparams} />
                          )}
                        </>
                      );
                    }}
                  </Step>
                );
              })}
            </Steps>
          </Wizard>
        </CardBody>
      </Card>
    </>
  );
};

const mapStateToProps = ({ flowsApp }) => {
  const { flowName } = flowsApp;

  return {
    flowName,
  };
};

export default connect(
  mapStateToProps,
  {}
)(injectIntl(DripCampaignProgressBar));
