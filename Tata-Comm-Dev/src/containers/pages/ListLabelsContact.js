/* eslint-disable no-param-reassign */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/no-this-in-sfc */

import React from 'react';
import {
    // CustomInput,
    Button,
    InputGroup,
    // Input,
    // Input,
    // Comment,
    // FormText,
    // FormGroup,
    // Form,
    InputGroupAddon,
    Alert,
} from 'reactstrap';


import {
    Formik,
    Form,
    Field,
} from 'formik';
// import Select from 'react-select';
// import CustomSelectInput from 'components/common/CustomSelectInput';

// import { loginUser } from 'redux/actions';
import { addCommentsContactItem, addCommentsContactItemClean } from 'redux/actions';
import { connect } from 'react-redux';

import * as Yup from 'yup';

import { injectIntl } from 'react-intl';

import { NotificationManager } from 'components/common/react-notifications';


const AddCommentsContact = ({ id, intl, formSuccess, formError, formLoading, addCommentsContactItemAction, addCommentsContactItemCleanAction }) => {
    const { messages } = intl;

    const onAddCommentsContactItem = (values, {resetForm}) => {
        if (formLoading) {
            return false;
        }
        const resp = addCommentsContactItemAction(values);
        resetForm();
        return false;
    };
    if (formSuccess) {
        addCommentsContactItemCleanAction({})
        NotificationManager.success(
            'Saved successfully',
            'Success',
            6000,
            null,
            null,
            '', // className
        );
    }

    const initialValues = {
        'content': '',
        'contact_id': id,
    }

    const SignupSchema = Yup.object().shape({
        content: Yup.string()
            .required('Note is required!'),
    });


    return (
        <Formik initialValues={initialValues} validationSchema={SignupSchema} onSubmit={onAddCommentsContactItem}>
            {({ errors, touched, handleSubmit }) => (
                <Form onSubmit={handleSubmit}>

                    <InputGroup className="comment-container mb-4">
                        <Field name="content" as="textarea" placeholder={messages['contacts.add_comment']} className="form-control" />
                        <InputGroupAddon addonType="append">
                            <Button color="primary" onClick={handleSubmit}>
                                <span className="d-inline-block">
                                    {messages['contacts.add_note']}
                                </span>{' '}
                                <i className="simple-icon-arrow-right ml-2" />
                            </Button>
                        </InputGroupAddon>
                        {errors.content && touched.content && (
                            <div className="invalid-feedback d-block">
                                {errors.content}
                            </div>
                        )}
                    </InputGroup>
                    {formError && formError.errorMsg && (
                        <Alert color="danger" className="rounded">
                            {formError.errorMsg}
                        </Alert>
                    )}
                </Form>
            )}
        </Formik>
    );
};

const mapStateToProps = (state, props) => {
    const { contactsApp } = state;
    const { successAddComment, errorAddComment, loadingAddComment } = contactsApp;
    return { formSuccess: successAddComment, formError: errorAddComment, formLoading: loadingAddComment };
};
export default connect(mapStateToProps, {
    addCommentsContactItemAction: addCommentsContactItem,
    addCommentsContactItemCleanAction: addCommentsContactItemClean,
})(injectIntl(AddCommentsContact));