import React, { useEffect, useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import { COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT } from 'constants/appConstant';
import IntlMessages from 'helpers/IntlMessages';
import moment from 'moment';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { Row, Button } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { getCurrentGMTTimeZone } from 'helpers/campaignHelper';
import {
  showImportList,
  cleanImportListError,
  deleteImport,
} from 'redux/s3-sftp/actions';
import { NotificationManager } from 'components/common/react-notifications';
import DataTableView from 'containers/contacts/DataTableView';
import DeleteDBImportModal from 'components/s3-sftp/DeleteDBImportModal';
import { getDbImportsAudienceType } from 'helpers/S3SFTPHelper';
import { adminRoot } from 'constants/defaultValues';
import { getImportSchedulerById } from 'redux/s3-sftp/actions';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import CommonEnums from 'enums/commonEnums';
import { capitalizeFirstLetter } from 'helpers/S3SFTPHelper';
import { UncontrolledTooltip } from 'reactstrap';
import S3SFTPImportEnums from 'enums/s3sftp/s3stfpImportEnums';

const ImportSchedulerDetailInfo = ({
  importSchedulerDetails,
  intl,
  errorImportListAdd,
  successImportListAdd,
  cleanImportListErrorAction,
  loadingSchedulerDetail,
  getImportSchedulerByIdAction,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const history = useHistory();

  const { messages } = intl;

  useEffect(() => {
    cleanImportListErrorAction({});
  }, []);

  useEffect(() => {
    if (
      (errorImportListAdd && errorImportListAdd.error) ||
      (errorImportListAdd && errorImportListAdd.errorMsg)
    ) {
      const error = errorImportListAdd.error || errorImportListAdd.errorMsg;
      NotificationManager.error(error, 'Error', 6000, null, null, '');
    }
  }, [errorImportListAdd]);

  const schedulerType = (schedule_type) => {
    switch (schedule_type) {
      case CommonEnums.AS_SOON_AS_POSSIBLE:
        return messages['S3SFTP.IMPORT_SCHEDULER_DETAIL.ONE_TIME'];
      case CommonEnums.PERIODIC:
        return messages['S3SFTP.IMPORT_SCHEDULER_DETAIL.PERIODIC'];
      case CommonEnums.AT_SPECIFIC_TIME:
        return messages['S3SFTP.IMPORT_SCHEDULER_DETAIL.FIXED_TIME'];
      default:
        return schedule_type;
    }
  };

  const importType = (import_type) => {
    switch (import_type) {
      case CommonEnums.REGISTERED_AUDIENCE:
        return messages['S3SFTP.IMPORT_SCHEDULER_DETAIL.REGISTERED_AUDIENCE'];
      case CommonEnums.ANONYMOUS_AUDIENCE:
        return messages['S3SFTP.IMPORT_SCHEDULER_DETAIL.ANONYMOUS_AUDIENCE'];
      case CommonEnums.EVENT:
        return messages['S3SFTP.ALL_IMPORTS.BUTTON.EVENT'];
      default:
        return import_type;
    }
  };

  const tableCols = React.useMemo(
    () => [
      {
        Header: 'S3SFTP.IMPORT_SCHEDULER_DETAIL.IMPORT_NAME',
        accessor: 'name',
      },

      {
        Header: 'S3SFTP.IMPORT_SCHEDULER_DETAIL.TOTAL_ROWS_COUNT',
        accessor: 'total_rows',
      },
      {
        Header: 'S3SFTP.IMPORT_SCHEDULER_DETAIL.PROCESSED_COUNT',
        accessor: 'processed_rows',
      },
      {
        Header: 'S3SFTP.IMPORT_SCHEDULER_DETAIL.CREATED_AT',
        accessor: 'created_at',
        Cell: (props) => {
          return (
            <>
              {props.value
                ? moment
                    .unix(parseInt(props.value))
                    .format(COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT)
                : '--'}
            </>
          );
        },
      },
      {
        Header: 'S3SFTP.IMPORT_SCHEDULER_DETAIL.LAST_UPDATED',
        accessor: 'updated_at',
        Cell: (props) => {
          return (
            <>
              {props.value
                ? moment
                    .unix(parseInt(props.value))
                    .format(COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT)
                : '--'}
            </>
          );
        },
      },
      {
        Header: 'S3SFTP.IMPORT_SCHEDULER_DETAIL.STATUS',
        accessor: 'status',
        Cell: (props) => {
          const { row, value } = props;
          const createdDate = row.created_at;
          const isUpdated =
            row.total_rows_in_file === row.new_users_added + row.users_updated;
          return (
            <div>
              <>{props.value ? capitalizeFirstLetter(props.value) : '--'}</>

              {props.value === S3SFTPImportEnums.STATUS.FAILED && (
                <>
                  <i
                    id={`tooltip-${createdDate}`}
                    className="ml-2 info-icon iconsminds-information"
                  />
                  <UncontrolledTooltip
                    placement="left"
                    target={`tooltip-${createdDate}`}
                  >
                    <small>{row.failed_error}</small>
                  </UncontrolledTooltip>
                </>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleOnEditBtnClick = (id) => {
    getImportSchedulerByIdAction({ id: id });
    const importType = getDbImportsAudienceType(
      importSchedulerDetails?.import_type
    );
    history.push(`${adminRoot}/segments/db-imports/upload/${importType}`);
  };

  return (
    <>
      {loadingSchedulerDetail ? (
        <div className="loading dnd-loader" />
      ) : (
        <>
          <div className="mb-5">
            {importSchedulerDetails?.status ===
              S3SFTPImportEnums.STATUS.COMPLETE ||
            (importSchedulerDetails?.status ===
              S3SFTPImportEnums.STATUS.FAILED &&
              importSchedulerDetails?.schedule_type !==
                CommonEnums.PERIODIC) ? (
              ''
            ) : (
              <span className="float-right ">
                <Button
                  color="theme-3"
                  className="icon-button ml-1 edit-button"
                  onClick={() => {
                    handleOnEditBtnClick(importSchedulerDetails.id);
                  }}
                  data-testid="edit-import-schedule"
                >
                  <i className="simple-icon-pencil" />
                </Button>
                {importSchedulerDetails?.status ===
                S3SFTPImportEnums.STATUS.CANCELLED ? (
                  ''
                ) : (
                  <Button
                    color="theme-3"
                    className="icon-button ml-1 edit-button"
                    onClick={() => {
                      setModalOpen(true);
                    }}
                    data-testid="delete-import-schedule"
                  >
                    <i className="iconsminds-pause" />
                  </Button>
                )}
              </span>
            )}

            <span>
              <h2>
                <strong>
                  {importSchedulerDetails?.import_name} &gt;{' '}
                  {schedulerType(importSchedulerDetails?.schedule_type)}
                </strong>
              </h2>
            </span>
          </div>

          <Row>
            <Colxx xxs="6" className="mb-5">
              <Card body className="info-card-height-style">
                <CardBody>
                  <div className="customSegmentData">
                    <div>
                      <p>
                        <IntlMessages id="S3SFTP.IMPORT_SCHEDULER_DETAIL.IMPORT_TYPE" />
                      </p>
                      <p>
                        <strong>
                          {importType(importSchedulerDetails?.import_type)}
                        </strong>
                      </p>
                    </div>
                    <div>
                      <p>
                        <IntlMessages id="ALL_SEGMENTS.LIST.CREATED_ON" />
                      </p>
                      <p>
                        <strong>
                          {moment
                            .unix(parseInt(importSchedulerDetails?.created_at))
                            .format(
                              COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT
                            )}
                        </strong>
                      </p>
                    </div>
                    <div className="customSegmentData">
                      <div>
                        <p>
                          <IntlMessages id="S3SFTP.IMPORT_SCHEDULER_DETAIL.STATUS" />
                        </p>
                        <p>
                          <strong>
                            {importSchedulerDetails?.status
                              ? capitalizeFirstLetter(
                                  importSchedulerDetails?.status
                                )
                              : importSchedulerDetails?.status}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                  <br />

                  <div className="customSegmentData">
                    <div>
                      <p>
                        <IntlMessages id="S3SFTP.IMPORT_SCHEDULER_DETAIL.SOURCE_DB" />
                      </p>
                      <p>
                        <strong>
                          {importSchedulerDetails?.connection_name}
                        </strong>
                      </p>
                    </div>
                    <div>
                      <p>
                        <IntlMessages id="S3SFTP.IMPORT_SCHEDULER_DETAIL.TABLENAME" />
                      </p>
                      <p>
                        <strong>{importSchedulerDetails?.table_name}</strong>
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Colxx>
            <Colxx xxs="6" className="mb-5">
              <Card body className="info-card-height-style">
                <CardBody>
                  <div className="customSegmentData">
                    {importSchedulerDetails?.schedule_type ===
                    CommonEnums.PERIODIC ? (
                      <>
                        <div>
                          <p>
                            <IntlMessages id="S3SFTP.IMPORT_SCHEDULER_DETAIL.LAST_RUN_TIME" />
                          </p>
                          <p>
                            <strong>
                              {importSchedulerDetails?.run_at &&
                              importSchedulerDetails?.run_at !== 0
                                ? moment
                                    .unix(importSchedulerDetails?.run_at)
                                    .format(
                                      COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT
                                    )
                                : ' -- '}
                            </strong>
                          </p>
                        </div>

                        <div>
                          <p>
                            <IntlMessages id="S3SFTP.IMPORT_SCHEDULER_DETAIL.NEXT_RUN_TIME" />
                          </p>
                          <p>
                            <strong>
                              {importSchedulerDetails?.next_run_at &&
                              importSchedulerDetails?.next_run_at !== 0
                                ? moment
                                    .unix(importSchedulerDetails?.next_run_at)
                                    .format(
                                      COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT
                                    )
                                : ' -- '}
                            </strong>
                          </p>
                        </div>
                      </>
                    ) : (
                      <div>
                        <p>
                          <IntlMessages id="S3SFTP.IMPORT_SCHEDULER_DETAIL.LAST_RUN_TIME" />
                        </p>
                        <p>
                          <strong>
                            {importSchedulerDetails?.run_at &&
                            importSchedulerDetails?.run_at !== 0
                              ? moment
                                  .unix(importSchedulerDetails?.run_at)
                                  .format(
                                    COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT
                                  )
                              : ' -- '}
                          </strong>
                        </p>
                      </div>
                    )}
                  </div>
                  <br />
                </CardBody>
              </Card>
            </Colxx>
          </Row>

          {successImportListAdd && (
            <Row>
              <Colxx>
                <div>
                  <DataTableView
                    colxxs="14"
                    cols={tableCols}
                    items={successImportListAdd}
                    key="ReactTblConnectionList"
                  />
                </div>
              </Colxx>
            </Row>
          )}

          <DeleteDBImportModal
            id={importSchedulerDetails?.id}
            modalOpen={modalOpen}
            toggleModal={toggleModal}
          />
        </>
      )}
    </>
  );
};

const mapStateToProps = ({ s3sftpApp }) => {
  const {
    importSchedulerDetails,
    errorImportListAdd,
    successImportListAdd,
    successSchedulerDetail,
    loadingSchedulerDetail,
    errorImportDeleteAdd,
    successImportDeleteAdd,
  } = s3sftpApp;
  return {
    importSchedulerDetails,
    errorImportListAdd,
    successImportListAdd,
    successSchedulerDetail,
    loadingSchedulerDetail,
    errorImportDeleteAdd,
    successImportDeleteAdd,
  };
};

export default connect(mapStateToProps, {
  showImportListAction: showImportList,
  cleanImportListErrorAction: cleanImportListError,
  deleteImportAction: deleteImport,
  getImportSchedulerByIdAction: getImportSchedulerById,
})(injectIntl(ImportSchedulerDetailInfo));
