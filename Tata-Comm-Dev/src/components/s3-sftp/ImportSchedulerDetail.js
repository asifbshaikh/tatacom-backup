import { Colxx } from 'components/common/CustomBootstrap';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { Row } from 'reactstrap';
import ViewSegmentDetailsHeading from 'views/app/segments/ViewSegmentDetailsHeading';
import ImportSchedulerDetailInfo from './ImportSchedulerDetailInfo';
import {
  getImportSchedulerDetail,
  clearImportSchedulerDetail,
} from 'redux/s3-sftp/actions';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { NotificationManager } from 'components/common/react-notifications';
import CommonEnums from 'enums/commonEnums';

const ImportSchedulerDetail = ({
  match,
  getImportSchedulerDetailAction,
  errorSchedulerDetail,
  importSchedulerDetails,
  clearImportSchedulerDetailAction,
}) => {
  const { ImportSchedulerId } = useParams();

  useEffect(() => {
    getImportSchedulerDetailAction({ id: ImportSchedulerId });
  }, []);

  useEffect(() => {
    if (
      (errorSchedulerDetail && errorSchedulerDetail.error) ||
      (errorSchedulerDetail && errorSchedulerDetail.errorMsg)
    ) {
      const error = errorSchedulerDetail.error || errorSchedulerDetail.errorMsg;
      NotificationManager.error(error, CommonEnums.ERROR, 6000, null, null, '');
      clearImportSchedulerDetailAction({});
    }
  }, [errorSchedulerDetail]);

  return (
    <>
      <div className="segmentTypeContainer">
        <ViewSegmentDetailsHeading
          match={match}
          heading="S3SFTP.IMPORT_SCHEDULER_DETAIL.IMPORT_SCHEDULER_INFO"
        />
        <ImportSchedulerDetailInfo importID={ImportSchedulerId} />
      </div>
    </>
  );
};

const mapStateToProps = ({ s3sftpApp }) => {
  const {
    successSchedulerDetail,
    errorSchedulerDetail,
    importSchedulerDetails,
  } = s3sftpApp;
  return {
    successSchedulerDetail,
    errorSchedulerDetail,
    importSchedulerDetails,
  };
};

export default connect(mapStateToProps, {
  getImportSchedulerDetailAction: getImportSchedulerDetail,
  clearImportSchedulerDetailAction: clearImportSchedulerDetail,
})(injectIntl(ImportSchedulerDetail));
