import DataTableView from 'containers/contacts/DataTableView';
import IntlMessages from 'helpers/IntlMessages';
import React, { useState, useEffect } from 'react';
import Pagination from 'containers/pages/Pagination';
import { UncontrolledPopover } from 'reactstrap';
import { COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT } from 'constants/appConstant';
import moment from 'moment';
import { adminRoot } from 'constants/defaultValues';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { cleanDeleteImportError } from 'redux/s3-sftp/actions';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { getDbImportsAudienceType, setStatusType } from 'helpers/S3SFTPHelper';
import { capitalizeFirstLetter } from 'helpers/S3SFTPHelper';
import CommonEnums from 'enums/commonEnums';

import DeleteDBImportModal from 'components/s3-sftp/DeleteDBImportModal';
import S3SFTPImportEnums from 'enums/s3sftp/s3stfpImportEnums';
function collect(props) {
  return { data: props.data };
}

const AllS3SFTPList = ({
  item,
  intl,
  currentPage,
  totalPage,
  onChangePage,
  cleanDeleteImportErrorAction,
  getImportSchedulerByIdAction,
}) => {
  const history = useHistory();
  const { messages } = intl;

  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState('');
  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    cleanDeleteImportErrorAction();
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleOnEditBtnClick = (payload) => {
    setStatusType(payload.status);
    getImportSchedulerByIdAction({ id: payload.id });
    const importType = getDbImportsAudienceType(payload.import_type);
    history.push(`${adminRoot}/segments/db-imports/upload/${importType}`);
  };

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

  const tableCols = React.useMemo(
    () => [
      {
        Header: 'S3SFTP.ALL_IMPORTS.TABLE_HEADER.NAME',
        accessor: 'import_name',
        Cell: (props) => {
          return (
            <NavLink
              className="text-primary active1 list-link"
              to={`${adminRoot}/segments/db-imports/scheduler-info/${props.row.id}`}
            >
              <div title={props.value}>{props.value}</div>
            </NavLink>
          );
        },
      },
      {
        Header: 'S3SFTP.ALL_IMPORTS.TABLE_HEADER.TYPE',
        accessor: `schedule_type`,
        Cell: function schedule(props) {
          return (
            <div>
              <span>
                {props.row.source_type
                  ? capitalizeFirstLetter(props.row.source_type)
                  : capitalizeFirstLetter(props.row.source_type)}{' '}
                ({' '}
              </span>
              <span data-testid="importSchedulerType">
                {props.row.schedule_type
                  ? schedulerType(props.row.schedule_type)
                  : props.row.schedule_type}{' '}
                )
              </span>
            </div>
          );
        },
      },
      {
        Header: 'S3SFTP.ALL_IMPORTS.TABLE_HEADER.CREATED_AT',
        accessor: 'created_at',
        Cell: (props) => {
          return moment
            .unix(props.value)
            .format(COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT);
        },
      },
      {
        Header: 'S3SFTP.ALL_IMPORTS.TABLE_HEADER.LAST_RUN_AT',
        accessor: 'run_at',
        Cell: (props) => {
          if (props.value !== null && props.value !== '' && props.value !== 0) {
            return moment
              .unix(props.value)
              .format(COMMA_SEPERATED_FULL_DATE_TIME_HH_MM_FORMAT);
          } else {
            return '--';
          }
        },
      },
      {
        Header: 'S3SFTP.ALL_IMPORTS.TABLE_HEADER.STATUS',
        accessor: 'status',
        Cell: (props) => {
          if (props.value != null && props.value !== '') {
            return capitalizeFirstLetter(props.value);
          } else {
            return props.value;
          }
        },
      },
      {
        Header: 'S3SFTP.ALL_IMPORTS.TABLE_HEADER.ACTION',
        accessor: '',
        Cell: function action(props) {
          return (
            <>
              {props.row.status === S3SFTPImportEnums.STATUS.COMPLETE ||
              (props.row.status === S3SFTPImportEnums.STATUS.FAILED &&
                props.row.schedule_type !== CommonEnums.PERIODIC) ? (
                ''
              ) : (
                <div>
                  <button
                    type="button"
                    id={`PopOver${props.row.id}`}
                    onClick={handleOnClick}
                    className="simpleButton"
                    data-testid={`actionBtn${props.row.id}`}
                  >
                    <i className="simple-icon-options-vertical" />
                  </button>
                  <UncontrolledPopover
                    placement="left-start"
                    trigger="legacy"
                    id="listActionPopOver"
                    target={`PopOver${props.row.id}`}
                    data-testid={`PopOver${props.row.id}`}
                  >
                    <button
                      type="button"
                      className="simpleButton"
                      onClick={() => handleOnEditBtnClick(props.row)}
                      data-testid={`editBtn${props.row.id}`}
                    >
                      <IntlMessages id="S3SFTP.ALL_IMPORTS.ACTION_BUTTON.EDIT" />
                    </button>
                    {props.row.status === S3SFTPImportEnums.STATUS.CANCELLED ? (
                      ''
                    ) : (
                      <button
                        type="button"
                        className="simpleButton"
                        onClick={() => {
                          setModalOpen(true);
                          setCurrentItem(props.row.id);
                        }}
                        data-testid={`deactivateBtn${props.row.id}`}
                      >
                        <IntlMessages id="S3SFTP.ALL_IMPORTS.ACTION_BUTTON.DEACTIVATE" />
                      </button>
                    )}
                  </UncontrolledPopover>
                </div>
              )}
            </>
          );
        },
      },
    ],
    []
  );
  return (
    <div className="import-list">
      {item && (
        <div>
          <DataTableView
            colxxs="12"
            cols={tableCols}
            items={item}
            key="ReactTblImportUserList"
            collect={collect}
          />
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onChangePage={(i) => onChangePage(i)}
      />
      <DeleteDBImportModal
        id={currentItem}
        modalOpen={modalOpen}
        toggleModal={toggleModal}
      />
    </div>
  );
};

const mapStateToProps = ({ s3sftpApp }) => {
  const { importSchedulerDetails } = s3sftpApp;
  return {
    importSchedulerDetails,
  };
};

export default connect(mapStateToProps, {
  cleanDeleteImportErrorAction: cleanDeleteImportError,
})(injectIntl(AllS3SFTPList));
