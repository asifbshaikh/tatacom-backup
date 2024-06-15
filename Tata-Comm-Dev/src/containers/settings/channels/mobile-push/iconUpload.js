import IntlMessages from 'helpers/IntlMessages';
import React from 'react';
import { Button, Input, Label } from 'reactstrap';

const IconUpload = ({ setFile, file }) => {
  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRemoveIcon = () => {
    setFile(null);
  };
  return (
    <div className="ml-3">
      <h2>
        <IntlMessages id="CHANNEL_MGMT.MOBILE_CHANNEL.DEFAULT_NOTIFICATION_ICON" />
      </h2>
      <Label htmlFor="input-file" className="icon-uploader">
        <IntlMessages id="CHANNEL_MGMT.MOBILE_CHANNEL.UPLOAD" />
      </Label>
      <br></br>
      <span className="recommended-size">
        <IntlMessages id="CHANNEL_MGMT.MOBILE_CHANNEL.RECOMMENDED_ICON_SIZE" />
      </span>
      {file?.name && (
        <p className="mt-2 d-flex align-items-center">
          {file?.name} &nbsp;{' '}
          <Button
            color="primary"
            close
            type="button"
            className="border-0 mt-0 pt-0 remove-icon"
            onClick={handleRemoveIcon}
          />
        </p>
      )}
      <Input
        type="file"
        id="input-file"
        onChange={onFileChange}
        className="d-none"
        multiple
        accept="image/*"
      />
    </div>
  );
};

export default IconUpload;
