import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function CustomDialog(args) {
  return (
    <div>
      <Modal isOpen={args.open} toggle={args.toggle} {...args}>
        <ModalHeader className="dialogHeaderColor" toggle={args.toggle}>
          {args.title}
        </ModalHeader>
        <ModalBody>{args.children}</ModalBody>
        {args?.footer ? <ModalFooter>{args.footer}</ModalFooter> : <></>}
      </Modal>
    </div>
  );
}

export default CustomDialog;
