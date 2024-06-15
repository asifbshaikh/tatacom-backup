import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import React, { useState } from 'react';
import Select from 'react-select';
import { Row, Tooltip } from 'reactstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import '../../assets/css/sass/views/campaign.scss';
import CampaignCardType from 'containers/campaigns/CampaignCardType';
import StepperNavigationButtons from 'containers/campaigns/StepperNavigationButtons';
import S3SFTPImportEnums from 'enums/s3sftp/s3stfpImportEnums';
import {
  useHistory,
  useParams,
} from 'react-router-dom/cjs/react-router-dom.min';
import { adminRoot } from 'constants/defaultValues';
import { addS3SFTPImportSourceType } from 'redux/actions';
import { injectIntl } from 'react-intl';
import CreateEventPopOver from 'views/app/segments/create-segment/widgets/CreateEventPopOver';

const sourceList = [
  // This code may be required in Future, commenting as it is out of scope for present release
  // {
  //   type: 's3',
  //   label: <IntlMessages id="S3SFTP.SOURCE.TITLE.S3" />,
  //   icon: 'simple-icon-cloud-download',
  //   description: <IntlMessages id="S3SFTP.SOURCE.DESCRIPTION.S3" />,
  // },
  // {
  //   type: 'sftp',
  //   label: <IntlMessages id="S3SFTP.SOURCE.TITLE.SFTP" />,
  //   icon: 'iconsminds-folder-open',
  //   description: <IntlMessages id="S3SFTP.SOURCE.DESCRIPTION.SFTP" />,
  // },
  {
    type: 'database',
    label: <IntlMessages id="S3SFTP.SOURCE.TITLE.DATABASE" />,
    icon: 'iconsminds-data-center',
    description: <IntlMessages id="S3SFTP.SOURCE.DESCRIPTION.DATABASE" />,
  },
];

const userList = [
  {
    type: 'registered_audience',
    label: <IntlMessages id="S3SFTP.SOURCE.TITLE.REGISTERED_AUDIENCE" />,
    icon: 'simple-icon-people',
    description: (
      <IntlMessages id="S3SFTP.SOURCE.DESCRIPTION.REGISTERED_AUDIENCE" />
    ),
  },
  {
    type: 'anonymous_audience',
    label: <IntlMessages id="S3SFTP.SOURCE.TITLE.ANONYMOUS_AUDIENCE" />,
    icon: 'simple-icon-question',
    description: (
      <IntlMessages id="S3SFTP.SOURCE.DESCRIPTION.ANONYMOUS_AUDIENCE" />
    ),
  },
];

const SelectSource = ({
  formRef,
  sourceType,
  audienceType,
  eventSelect,
  next,
  intl,
  addSourceType,
  userEventsList,
}) => {
  const { importType } = useParams();
  const history = useHistory();
  const initialValues = {
    sourceType: sourceType ?? '',
    audienceType: audienceType ?? '',
    eventSelect: eventSelect ?? [],
    importType: importType ?? '',
  };

  const { messages } = intl;
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [toolTipOpen, setToolTipOpen] = useState(false);
  const eventDropDownData = userEventsList?.map((item) => ({
    label: item.displayed_name,
    value: item.id,
  }));

  const toggleTooltipDownloadSample = () => {
    setToolTipOpen(!toolTipOpen);
  };

  const handleSubmit = (values) => {
    addSourceType({ ...values });
    next();
  };

  const handlePreviousBtnClick = () => {
    history.push(`${adminRoot}/segments/db-imports/list`);
  };

  const makeSchema = Yup.object().shape({
    sourceType: Yup.string().required(),
    audienceType: Yup.string().when('importType', {
      is: (importType) => importType === S3SFTPImportEnums.IMPORT_TYPE.AUDIENCE,
      then: Yup.string().required(),
      otherwise: Yup.string().notRequired(),
    }),
    eventSelect: Yup.array().when('importType', {
      is: (importType) => importType === S3SFTPImportEnums.IMPORT_TYPE.EVENT,
      then: Yup.array().of(Yup.string()).min(1).required(),
      otherwise: Yup.array().notRequired(),
    }),
  });

  const handleCreateEvent = () => {
    setShowCreateEvent(true);
  };

  const getEventSelectValues = (form) => {
    return eventDropDownData.filter((eventData) => {
      return form.values.eventSelect.includes(eventData.label);
    });
  };

  const handleOnChange = (data, form) => {
    eventSelect = data?.map((item) => item.label);
    form.setFieldValue('eventSelect', eventSelect);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        innerRef={formRef}
        validationSchema={makeSchema}
        validateOnBlur
        validateOnChange
        enableReinitialize
        isValidating
        onSubmit={handleSubmit}
        validateOnMount
      >
        {(form) => (
          <Form>
            <Row>
              <Colxx xxs="12" style={{ flex: 1 }}>
                <h2 className="p-2 font-weight-bold">
                  {' '}
                  <IntlMessages id="S3SFTP.SOURCE.LABEL.SELECT_SOURCE_TYPE" />
                </h2>
              </Colxx>
              <div className="mr-4">
                <IntlMessages id="S3SFTP.SOURCE.DESCRIPTION.SAMPLE_DB_STRUCTURE_FOR" />
                {importType === S3SFTPImportEnums.IMPORT_TYPE.AUDIENCE ? (
                  <>
                    <a
                      id="TooltipExample"
                      className="csv-file-link"
                      href="/assets/sample/AudienceDBSchemaStructureFormat.csv"
                      download
                    >
                      <IntlMessages id="S3SFTP.DB_SETTING.LABEL.AUDIENCE_IMPORTS" />
                    </a>
                    <Tooltip
                      placement="top"
                      isOpen={toolTipOpen}
                      target="TooltipExample"
                      toggle={toggleTooltipDownloadSample}
                    >
                      <IntlMessages id="S3SFTP.SOURCE.DESCRIPTION.AUDIENCE_SAMPLE_DB_INSTRUCTION" />
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <a
                      id="TooltipExample"
                      className="csv-file-link"
                      href="/assets/sample/EventsDBSchemaStructureFormat.csv"
                      download
                    >
                      <IntlMessages id="S3SFTP.DB_SETTING.LABEL.EVENT_IMPORTS" />
                    </a>
                    <Tooltip
                      placement="top"
                      isOpen={toolTipOpen}
                      target="TooltipExample"
                      toggle={toggleTooltipDownloadSample}
                    >
                      <IntlMessages id="S3SFTP.SOURCE.DESCRIPTION.EVENT_SAMPLE_DB_INSTRUCTION" />
                    </Tooltip>
                  </>
                )}
              </div>
            </Row>
            <Colxx xxs="12" className="pl-3 pr-3">
              <CampaignCardType
                cardsList={sourceList}
                form={form}
                identifier="sourceType"
                className="select-source"
              />
            </Colxx>
            <Row>
              <Colxx xxs="12">
                <h2 className="p-2 font-weight-bold">
                  {' '}
                  {importType === S3SFTPImportEnums.IMPORT_TYPE.AUDIENCE ? (
                    <IntlMessages id="S3SFTP.SOURCE.LABEL.SELECT_AUDIENCE_TYPE" />
                  ) : (
                    <IntlMessages id="S3SFTP.SOURCE.LABEL.SELECT_EVENT" />
                  )}
                </h2>
              </Colxx>
            </Row>
            {importType === S3SFTPImportEnums.IMPORT_TYPE.AUDIENCE ? (
              <Colxx xxs="12" className="pl-3 pr-3">
                <CampaignCardType
                  cardsList={userList}
                  form={form}
                  identifier="audienceType"
                  className="select-source"
                />
              </Colxx>
            ) : (
              <>
                {showCreateEvent && (
                  <CreateEventPopOver
                    showCreateEvent={showCreateEvent}
                    setShowCreateEvent={setShowCreateEvent}
                  />
                )}
                <Row>
                  <Colxx xxs="12" className="d-flex justify-content-center">
                    <Colxx xxs="4" className="mt-3">
                      <Select
                        className="react-select"
                        classNamePrefix="react-select"
                        placeholder={
                          messages['S3SFTP.SOURCE.LABEL.SELECT_EVENT']
                        }
                        onChange={(e) => handleOnChange(e, form)}
                        options={eventDropDownData}
                        isMulti
                        value={getEventSelectValues(form)}
                      />
                    </Colxx>
                  </Colxx>
                </Row>
                <Row className="mt-2">
                  <Colxx xxs="12" className="d-flex justify-content-center">
                    <Colxx xxs="4">
                      <span
                        className="create-event"
                        role="button"
                        onClick={handleCreateEvent}
                        tabIndex="0"
                        onKeyDown={() => {}}
                      >
                        <IntlMessages id="CREATE_SEGMENT.CREATE_EVENT.ADD_EVENT" />
                      </span>
                    </Colxx>
                  </Colxx>
                </Row>
              </>
            )}
            <StepperNavigationButtons
              className="m-2"
              rightBtnLabel={<IntlMessages id="S3SFTP.BUTTONS.NEXT" />}
              leftBtnLabel={<IntlMessages id="S3SFTP.BUTTONS.PREVIOUS" />}
              handleLeftBtnClick={handlePreviousBtnClick}
              handleRightBtnClick={form.handleSubmit}
              rightBtnLabelDisable={
                !form.isValid && !(Object.keys(form.errors) > 0)
              }
            />
          </Form>
        )}
      </Formik>
    </>
  );
};

const mapStateToProps = ({ s3sftpApp }) => {
  const {
    selectSource: { sourceType, audienceType, eventSelect },
  } = s3sftpApp;
  return {
    sourceType,
    audienceType,
    eventSelect,
  };
};

export default connect(mapStateToProps, {
  addSourceType: addS3SFTPImportSourceType,
})(injectIntl(SelectSource));
