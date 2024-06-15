import React, { useState, useCallback } from 'react';
import IntlMessages from 'helpers/IntlMessages';
import { useDropzone } from 'react-dropzone';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';

export default function HTMLCards({ title, setIsChoose }) {
  const [isHovered, setIsHovered] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const acceptedFileTypes = '.zip';

  const onDrop = useCallback(() => {}, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedFileTypes,
    onDrop,
  });

  const handleChooseButton = () => {
    setIsChoose(true);
  };

  return (
    <>
      {title === ContentConfigurationEnums.EDIT_TEMPLATE ? (
        <div
          className={`html-card ${isHovered ? 'hover' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          tabIndex="0"
          role="button"
        >
          <Button
            className="html-button"
            onClick={(e) => {
              e.preventDefault();
              handleChooseButton();
            }}
          >
            <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.CHOOSE" />
          </Button>
          <p className="template-text">
            <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.EDIT_TEMPLATE" />
          </p>
        </div>
      ) : (
        ''
      )}
      {title === ContentConfigurationEnums.UPLOAD_TEMPLATE ? (
        <div
          className={`html-card ${isHovered ? 'hover' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          tabIndex="0"
          role="button"
        >
          <Button
            className="html-button"
            onClick={(e) => {
              e.preventDefault();
              toggle();
            }}
          >
            <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.CHOOSE" />
          </Button>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>
              <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.UPLOAD_ZIP_TEMPLATE" />
            </ModalHeader>
            <ModalBody>
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>
                  <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.ZIP_FILE" />
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={toggle}>
                <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.BUTTON.UPLOAD" />
              </Button>
            </ModalFooter>
          </Modal>
          <p className="template-text">
            <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.UPLOAD_ZIP_FILE" />
          </p>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
