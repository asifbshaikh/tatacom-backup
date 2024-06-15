import React, { createRef, useEffect, useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import { Wizard, Steps, Step } from 'react-albus';
import { connect } from 'react-redux';
import IntlMessages from 'helpers/IntlMessages';
import SelectSource from './SelectSource';
import S3SFTPImportEnums from 'enums/s3sftp/s3stfpImportEnums';
import CustomTopNavigation from 'components/wizard/CustomTopNavigation';
import ConfigureAndFormat from './ConfigureAndFormat';
import ImportConfiguration from './ImportConfiguration';
import S3SFTPSchedule from './S3SFTPSchedule';
import { getuserEventsList } from 'redux/segmentation/actions';
import { addUpdateS3SFTPImportCleanUp } from 'redux/s3-sftp/actions';

const S3SFTPProgressBar = ({
  sourceType,
  audienceType,
  getUserEventsDropDownList,
  userEventsList,
}) => {
  const s3sftpSteps = [
    {
      route: S3SFTPImportEnums.SOURCE,
      name: <IntlMessages id="S3SFTP.WIZARD.STEP_1" />,
    },
    {
      route: S3SFTPImportEnums.FORMAT,
      name: <IntlMessages id="S3SFTP.WIZARD.STEP_2" />,
    },
    // { WILL BE ADDED IN FUTURE
    //   route: S3SFTPImportEnums.CONFIGURATION_AND_ACTION,
    //   name: <IntlMessages id="S3SFTP.WIZARD.STEP_3" />,
    // },
    {
      route: S3SFTPImportEnums.SCHEDULING,
      name: <IntlMessages id="S3SFTP.WIZARD.STEP_4" />,
    },
  ];

  const [forms, setForms] = useState([]);

  useEffect(() => {
    const formRefs = s3sftpSteps.map(() => createRef(null));
    setForms(formRefs);
    getUserEventsDropDownList();
    return () => {
      addUpdateS3SFTPImportCleanUp();
    };
  }, []);

  return (
    <Card>
      <CardBody className="wizard wizard-default">
        <Wizard>
          <CustomTopNavigation className="justify-content-center" disableNav />
          <Steps>
            {s3sftpSteps.map((S3SFTPStep, index) => {
              const commonparms = {
                formRef: forms[index],
                sourceType,
                audienceType,
              };
              return (
                <Step
                  key={S3SFTPStep.route}
                  id={S3SFTPStep.route}
                  name={S3SFTPStep.name}
                >
                  {({ next, previous }) => {
                    commonparms.next = next;
                    commonparms.previous = previous;
                    return (
                      <>
                        {S3SFTPStep.route === S3SFTPImportEnums.SOURCE && (
                          <SelectSource
                            {...commonparms}
                            userEventsList={userEventsList}
                          />
                        )}
                        {S3SFTPStep.route === S3SFTPImportEnums.FORMAT && (
                          <ConfigureAndFormat {...commonparms} />
                        )}
                        {S3SFTPStep.route ===
                          S3SFTPImportEnums.CONFIGURATION_AND_ACTION && (
                          <ImportConfiguration {...commonparms} />
                        )}
                        {S3SFTPStep.route === S3SFTPImportEnums.SCHEDULING && (
                          <S3SFTPSchedule {...commonparms} />
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
  );
};

const mapStateToProps = ({ s3sftpApp, segmentationApp }) => {
  const {
    selectSource: { sourceType, audienceType },
  } = s3sftpApp;
  const { userEventsList } = segmentationApp;
  return {
    sourceType,
    audienceType,
    userEventsList,
  };
};

export default connect(mapStateToProps, {
  getUserEventsDropDownList: getuserEventsList,
})(S3SFTPProgressBar);
