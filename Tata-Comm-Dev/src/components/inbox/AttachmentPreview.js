import React from 'react';
import { Button } from 'reactstrap';
import { BITS_TO_BYTES } from 'constants/appConstant';
import { intlDirectMessage } from 'helpers/IntlMessages';

const AttachmentPreview = ({ attachments, removeAttachment }) => {
  const fileName = (file) => {
    return file.filename || file.name;
  };
  const calculateFileSize = (size) => {
    return (
      (size / BITS_TO_BYTES).toFixed(2) +
      intlDirectMessage({
        id: 'CONVERSATION.KB',
      })
    );
  };
  return (
    <div className="attachment-container">
      {attachments.map((attachment, index) => {
        return (
          <div
            className="preview-item d-flex pt-1 pl-2 mt-1"
            key={attachment.id}
          >
            <div className="file-name-wrap h-10 w-100">
              <span>{fileName(attachment?.resource)}</span>
            </div>
            <div className="file-size-wrap">
              <span>{calculateFileSize(attachment?.size)}</span>
            </div>
            <div className="remove-file-wrap">
              <Button
                color="primary"
                className="remove--attachment clear secondary btn-xs"
                onClick={() => removeAttachment(index)}
              >
                <i className="simple-icon-trash" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttachmentPreview;
