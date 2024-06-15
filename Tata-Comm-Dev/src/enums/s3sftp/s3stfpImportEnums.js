const S3SFTPImportEnums = Object.freeze({
  SOURCE: 'source',
  FORMAT: 'format',
  CONFIGURATION_AND_ACTION: 'configuration_and_action',
  SCHEDULING: 'scheduling',
  SOURCE_TYPE: {
    S3: 's3',
    SFTP: 'sftp',
    DATABASE: 'database',
  },
  MODULE_NAME: 'db_imports',
  IMPORT_TYPE: {
    AUDIENCE: 'audience',
    EVENT: 'event',
  },
  STATUS: {
    INITIATED: 'initiated',
    PROCESSING: 'processing',
    COMPLETE: 'complete',
    CANCELLED: 'cancelled',
    FAILED: 'failed',
  },
});

export default S3SFTPImportEnums;
