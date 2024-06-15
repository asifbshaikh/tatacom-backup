import React from 'react';
import DBConfigureAndFormat from './DBConfigureAndFormat';
import S3SFTPImportEnums from 'enums/s3sftp/s3stfpImportEnums';
import S3ConfigureAndFormat from './S3ConfigureAndFormat';
import SFTPConfigureAndFormat from './SFTPConfigureAndFormat';

const ConfigureAndFormat = ({ formRef, sourceType, next, previous }) => {
  return (
    <>
      {sourceType === S3SFTPImportEnums.SOURCE_TYPE.S3 && (
        <S3ConfigureAndFormat
          sourceType={sourceType}
          formRef={formRef}
          next={next}
          previous={previous}
        />
      )}
      {sourceType === S3SFTPImportEnums.SOURCE_TYPE.SFTP && (
        <SFTPConfigureAndFormat
          sourceType={sourceType}
          formRef={formRef}
          next={next}
          previous={previous}
        />
      )}
      {sourceType === S3SFTPImportEnums.SOURCE_TYPE.DATABASE && (
        <DBConfigureAndFormat
          sourceType={sourceType}
          formRef={formRef}
          next={next}
          previous={previous}
        />
      )}
    </>
  );
};

export default ConfigureAndFormat;
