import React, { useEffect } from 'react';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import { Row, Button, Alert } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import * as Yup from 'yup';
import { getTeam, addTeam, addTeamClean } from 'redux/actions';

const CreateTeam = ({
  match,
  formRef,
  next,
  setFieldsCoustom,
  formSuccess,
  formError,
  formLoading,
  addData,
  addTeamAction,
  addTeamCleanAction,
  editFormData,
  getTeamAction,
}) => {
  useEffect(() => {
    if (match.params.itemid) {
      getTeamAction(parseInt(match.params.itemid, 10));
    }
  }, [match.params.itemid]);

  const onSubmitForm = (values) => {
    if (formLoading) {
      return false;
    }
    const newParams = {
      description: values.description,
      name: values.title,
      allow_auto_assign: values.allowAutoAssign,
    };
    if (editFormData.id) {
      newParams.id = editFormData.id;
    }
    addTeamAction(newParams);
    return false;
  };
  if (formSuccess) {
    setFieldsCoustom({ item_id: addData.id, addData });
    addTeamCleanAction({});
    next();
  }

  const initialValues = {
    description: editFormData.description || '',
    title: editFormData.name || '',
    allowAutoAssign:
      typeof editFormData.allow_auto_assign !== 'undefined'
        ? editFormData.allow_auto_assign
        : true,
  };

  const SignupSchema = Yup.object().shape({
    title: Yup.string().trim().required('This field is required!'),
  });
  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={SignupSchema}
        validateOnMount
        enableReinitialize
        onSubmit={onSubmitForm}
      >
        {({ errors, touched, setFieldValue, values, isValid }) => (
          <Form className="av-tooltip tooltip-label-right">
            <Row>
              <Colxx xxs="12">
                <h2 className="mb-4 font-weight-bold">
                  <IntlMessages
                    id={
                      typeof editFormData.id === 'undefined'
                        ? 'TEAMS_SETTINGS.CREATE_FLOW.CREATE.TITLE'
                        : 'TEAMS_SETTINGS.EDIT_FLOW.CREATE.TITLE'
                    }
                  />
                </h2>
                <p>
                  <IntlMessages
                    id={
                      typeof editFormData.id === 'undefined'
                        ? 'TEAMS_SETTINGS.CREATE_FLOW.CREATE.DESC'
                        : 'TEAMS_SETTINGS.EDIT_FLOW.CREATE.DESC'
                    }
                  />
                </p>
                <FormGroupCoustom
                  identifier="title"
                  errors={errors}
                  touched={touched}
                  identifierLabel="TEAMS_SETTINGS.FORM.NAME.LABEL"
                  placeholder="TEAMS_SETTINGS.FORM.NAME.PLACEHOLDER"
                  required={true}
                />
                <FormGroupCoustom
                  type="textarea"
                  identifier="description"
                  errors={errors}
                  touched={touched}
                  identifierLabel="TEAMS_SETTINGS.FORM.DESCRIPTION.LABEL"
                  placeholder="TEAMS_SETTINGS.FORM.DESCRIPTION.PLACEHOLDER"
                  value={values.description}
                  onChange={(event) =>
                    setFieldValue('description', event.target.value)
                  }
                />
                <FormGroupCoustom
                  identifier="allowAutoAssign"
                  errors={errors}
                  touched={touched}
                  type="checkboxMulti"
                  noLable
                  radioMultiOptions={[
                    {
                      id: 'showsidebar_enabled',
                      value: 'enabled',
                      label: 'TEAMS_SETTINGS.FORM.AUTO_ASSIGN.LABEL',
                    },
                  ]}
                  onChange={(event) => {
                    setFieldValue(
                      'allowAutoAssign',
                      event.target.checked,
                      false
                    );
                  }}
                  value={values.allowAutoAssign ? ['enabled'] : []}
                />
                {formError && formError.errorMsg && (
                  <Alert color="danger" className="rounded">
                    {formError.errorMsg}
                  </Alert>
                )}
                <Button color="primary" disabled={!isValid}>
                  <IntlMessages
                    id={
                      typeof editFormData.id === 'undefined'
                        ? 'TEAMS_SETTINGS.FORM.SUBMIT_CREATE'
                        : 'TEAMS_SETTINGS.EDIT_FLOW.CREATE.BUTTON_TEXT'
                    }
                  />
                </Button>
              </Colxx>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
};

const mapStateToProps = ({ teamsApp }) => {
  const { successAdd, errorAdd, loadingAdd, addData, editFormData } = teamsApp;
  return {
    formSuccess: successAdd,
    formError: errorAdd,
    formLoading: loadingAdd,
    addData,
    editFormData,
  };
};
export default connect(mapStateToProps, {
  addTeamAction: addTeam,
  addTeamCleanAction: addTeamClean,
  getTeamAction: getTeam,
})(CreateTeam);
