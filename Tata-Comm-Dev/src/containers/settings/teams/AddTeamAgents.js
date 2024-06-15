import React, { useEffect, useState } from 'react';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import { Row, Button, Alert, FormGroup, Table, CustomInput } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import {
  getTeamAgents,
  getAgents,
  addAgentsTeam,
  addAgentsTeamClean,
} from 'redux/actions';
import Thumbnail from 'components/common/Thumbnail';

const AddTeamAgents = ({
  fields,
  formRef,
  next,
  agents,
  loadedAgents,
  formSuccess,
  formError,
  formLoading,
  teamAgents,
  getTeamAgentsAction,
  getAgentsAction,
  addAgentsTeamAction,
  addAgentsTeamCleanAction,
  editFormData,
  addData,
}) => {
  const [selectedAgents, setSelectedAgents] = useState([]);
  useEffect(() => {
    if (!loadedAgents) {
      getAgentsAction();
    }
    getTeamAgentsAction(fields.item_id);
  }, []);
  const onSubmitForm = (values) => {
    if (formLoading) {
      return false;
    }
    addAgentsTeamAction(values);
    return false;
  };
  if (formSuccess) {
    addAgentsTeamCleanAction({});
    next();
  }
  const filterFunc = (val) => {
    return { value: val.id, label: val.name };
  };
  const initialValues = {
    selectAllAgents: false,
    id: fields.item_id,
    selectedAgents: teamAgents ? teamAgents.map(filterFunc) : [],
  };

  const generateSelectedTeam = () => {
    const generatedData = agents
      .filter((item) => {
        if (selectedAgents.includes(item.id)) {
          return true;
        }
        return false;
      })
      .map((item) => ({ value: item.id, label: item.name }));
    return generatedData;
  };

  const onAgentSelected = (e) => {
    if (e.target.checked) {
      setSelectedAgents([...selectedAgents, parseInt(e.target.value)]);
    } else {
      const updatedSelectedAgents = [...selectedAgents];
      if (selectedAgents.includes(parseInt(e.target.value))) {
        updatedSelectedAgents.splice(
          selectedAgents.indexOf(parseInt(e.target.value)),
          1
        );
        setSelectedAgents(updatedSelectedAgents);
      }
    }
  };

  const onSelectAllAgentsChange = (e) => {
    if (e.target.checked) {
      const allAgentsSelectedData = agents.map((item) => item.id);
      setSelectedAgents(allAgentsSelectedData);
    } else {
      formRef.current.setFieldValue('selectAllAgents', false);
    }
  };

  useEffect(() => {
    if (teamAgents) {
      const savedAgents = teamAgents.map((item) => item.id);
      setSelectedAgents(savedAgents);
    }
  }, [teamAgents]);

  useEffect(() => {
    formRef.current.setFieldValue('selectedAgents', generateSelectedTeam());
    if (selectedAgents.length === agents.length) {
      formRef.current.setFieldValue('selectAllAgents', true);
    } else {
      formRef.current.setFieldValue('selectAllAgents', false);
    }
  }, [selectedAgents]);

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <h2 className="mb-4 font-weight-bold">
            <IntlMessages
              id="TEAMS_SETTINGS.CREATE_FLOW.AGENTS.ADD_AGENTS_TO_TEAM"
              values={{
                teamName: addData.name || editFormData.name || '',
              }}
            />
          </h2>
          <p>
            {editFormData?.id ? (
              <IntlMessages id="TEAMS_SETTINGS.CREATE_FLOW.AGENTS.ADD_AGENTS_TO_TEAM_HELP" />
            ) : (
              <IntlMessages id="TEAMS_SETTINGS.CREATE_FLOW.AGENTS.ADD_AGENTS_TO_TEAM_HELP_NEW" />
            )}
          </p>
        </Colxx>
        <Colxx xxs="12">
          <Formik
            innerRef={formRef}
            initialValues={initialValues}
            validateOnMount
            enableReinitialize
            onSubmit={onSubmitForm}
          >
            {({ values }) => (
              <Form className="av-tooltip tooltip-label-right">
                <Row>
                  <Colxx xxs="12">
                    <Table
                      responsive
                      className="table-style de-table-cell-content-middle"
                    >
                      <thead>
                        <tr>
                          <th className="de-checkbox-table-cell">
                            <FormGroup className="position-relative mb-0">
                              <CustomInput
                                type="checkbox"
                                name="selectAllAgents"
                                className="ml-0 my-0"
                                checked={values?.selectAllAgents}
                                onChange={onSelectAllAgentsChange}
                              />
                            </FormGroup>
                          </th>
                          <th>
                            <IntlMessages id="TEAMS_SETTINGS.CREATE_FLOW.AGENTS.TABLE.AGENT" />
                          </th>
                          <th>
                            <IntlMessages id="TEAMS_SETTINGS.CREATE_FLOW.AGENTS.TABLE.EMAIL" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {agents.map((item) => {
                          return (
                            <tr key={item.id + item.email}>
                              <td className="de-checkbox-table-cell">
                                <FormGroup className="mb-0">
                                  <CustomInput
                                    type="checkbox"
                                    name={item.id}
                                    className="ml-0"
                                    value={item.id}
                                    onChange={onAgentSelected}
                                    checked={selectedAgents?.includes(item.id)}
                                  />
                                </FormGroup>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div>
                                    <Thumbnail
                                      source={item.thumbnail}
                                      name={item.name}
                                      classNameCustom="xs-small-tumbnail"
                                    />
                                  </div>
                                  <div className="px-1">
                                    <h3 className="font-weight-bold mb-0">
                                      {item.name}
                                    </h3>
                                  </div>
                                </div>
                              </td>
                              <td>{item.email}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Colxx>
                  <Colxx xxs="12">
                    {formError && formError.errorMsg && (
                      <Alert color="danger" className="rounded">
                        {formError.errorMsg}
                      </Alert>
                    )}
                  </Colxx>
                  <Colxx xxs="6">
                    <p>
                      <IntlMessages
                        id="TEAMS_SETTINGS.CREATE_FLOW.AGENTS.AGENTS_SELECTED_COUNT"
                        values={{
                          selectedCount: selectedAgents?.length || 0,
                          totalCount: agents?.length || 0,
                        }}
                      />
                    </p>
                  </Colxx>
                  <Colxx xxs="6" className="text-right">
                    <Button color="primary">
                      <IntlMessages
                        id={
                          editFormData?.id
                            ? 'TEAMS_SETTINGS.CREATE_FLOW.AGENTS.UPDATE_AGENTS_IN_TEAM'
                            : 'TEAMS_SETTINGS.CREATE_FLOW.AGENTS.ADD_AGENTS'
                        }
                      />
                    </Button>
                  </Colxx>
                </Row>
              </Form>
            )}
          </Formik>
        </Colxx>
      </Row>
    </>
  );
};

const mapStateToProps = ({ teamsApp, agentsApp }) => {
  const {
    successAddAgents,
    errorAddAgents,
    loadingAddAgents,
    loadedTeamAgents,
    teamAgents,
    editFormData,
    addData,
  } = teamsApp;
  const { loadedAgents, agents } = agentsApp;
  return {
    formSuccess: successAddAgents,
    formError: errorAddAgents,
    formLoading: loadingAddAgents,
    loadedAgents,
    agents,
    loadedTeamAgents,
    teamAgents,
    editFormData,
    addData,
  };
};
export default connect(mapStateToProps, {
  getAgentsAction: getAgents,
  addAgentsTeamAction: addAgentsTeam,
  addAgentsTeamCleanAction: addAgentsTeamClean,
  getTeamAgentsAction: getTeamAgents,
})(AddTeamAgents);
