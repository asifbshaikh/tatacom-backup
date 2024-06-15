import React from 'react';

// import axios from 'axios';

import {
    // CustomInput,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    // Input,
    // Label,
    // FormText,
    // FormGroup,
    // Input,
    // Form,
    // Alert,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

import IntlMessages from 'helpers/IntlMessages';
import { switchAccount } from 'helpers/Utils';
import {  redirectToUrl } from 'constants/defaultValues';


const ToggleAccount = ({ modalOpen, toggleModal, accounts, user }) => {
    const closeForm = () => {
        if (modalOpen) {
            toggleModal();
        }
    }

    const onSwitchAccount = (accountId) => {
         switchAccount(accountId)
        const url = redirectToUrl('adminRoot')
        // history.push(url)
        window.location.href = url;
    }


    return (
        <Modal
            isOpen={modalOpen}
            toggle={toggleModal}
            // wrapClassName="modal-right"
            backdrop="static"
        >
            <ModalHeader toggle={toggleModal}>
                <IntlMessages id="SIDEBAR_ITEMS.CHANGE_ACCOUNTS" />
            </ModalHeader>
            <ModalBody>
                <p><IntlMessages id="SIDEBAR_ITEMS.SELECTOR_SUBTITLE" /></p>
                <Nav>
                    {accounts.map((account) => {
                        return (
                            <NavItem key={`acount_${account.id}`}>
                                <NavLink
                                    active={account.id === user.account_id_choosen}
                                    href="#"
                                    onClick={() => onSwitchAccount(account.id)}>
                                    {account.name}
                                    ({account.role})
                                </NavLink>
                            </NavItem>
                        )
                    })}
                </Nav>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" outline onClick={closeForm}>
                    <IntlMessages id="pages.cancel" />
                </Button>
            </ModalFooter>
        </Modal>
    );
};
export default ToggleAccount;