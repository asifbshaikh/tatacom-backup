import React, { useState, useEffect } from 'react';
import IntlMessages from 'helpers/IntlMessages';
import Select, { components } from 'react-select';
import CollapsibleSection from 'components/common/CollapsibleSection';
import { NavLink } from 'react-router-dom';
import {
  Row,
  Card,
  CardBody,
  Label,
  UncontrolledTooltip,
  FormGroup,
  Alert,
} from 'reactstrap';
import { connect } from 'react-redux';
import { Colxx } from 'components/common/CustomBootstrap';
import AddNewModal from 'containers/contacts/AddNewModal';
import DeleteModal from 'containers/contacts/DeleteModal';
import MergeModal from 'containers/contacts/MergeModal';
import {
  detailsContactItemCleanBeforeLoad,
  getAgents,
  getTeams,
} from 'redux/actions';
import { assignAgent } from 'redux/agents/actions';
import { assignTeam } from 'redux/teams/actions';
import {
  addLabelContactItem,
  addLabelContactItemClean,
  conversationLabel,
  detailsContactItem,
  getLabelContactItem,
} from 'redux/contacts/actions';
import ContactAttributes from './ContactAttributes';
import { Form, Formik } from 'formik';
import { NotificationManager } from 'components/common/react-notifications';
import ContactConversations from './ContactConversations';
import { adminRoot } from 'constants/defaultValues';
import { useHistory } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { conversationLabelCustomStyle } from 'helpers/ConversationFiltersHelper';
import SocialLinks from 'components/cards/SocialLinks';

const ContactDetails = ({
  selectedConversation,
  detailsContactItemCleanBeforeLoadAction,
  labels,
  agents,
  teams,
  getAgentsAction,
  getTeamsAction,
  assignConversationAgent,
  assignConversationTeam,
  addConversationLabelAction,
  showDetails,
  setShowDetails,
  labelSelected,
  labelSelectedLoaded,
  formLoadingLabel,
  formSuccessLabel,
  addLabelContactItemAction,
  addLabelContactItemCleanAction,
  surveyid = '',
  formError,
  formErrorLabel,
  editFormData,
  detailsContactItemAction,
  getLabelContactItemAction,
  showMoreUserDetails = true,
  showConversationInformation = false,
  showConversationAction = false,
  showContactAttributes = false,
  showContactLabels = false,
  showPreviousConversations = false,
  showToggleButton = false,
  showNewMessageButton = false,
  showGoToLink = false,
  setNewMsgModal,
  lastSeenData,
}) => {
  const defaultLabelOption = { label: 'None', value: '', id: 0 };
  const displayName =
    editFormData?.name ||
    `${
      editFormData?.first_name && editFormData?.last_name
        ? editFormData?.first_name + ' ' + editFormData?.last_name
        : editFormData?.first_name ?? editFormData?.last_name ?? ''
    }`;
  const history = useHistory();
  const [modalOpenMerge, setModalOpenMerge] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(false);
  const [editContectModalOpen, setEditContectModalOpen] = useState(false);
  const [modalOpenDelete, setModalOpenDelete] = useState(false);
  const [conversationLabels, setConversationLabels] = useState(
    selectedConversation?.labels || []
  );
  const [conversationAssignedAgent, setConversationAssignedAgent] = useState(
    []
  );
  const [conversationAssignedTeam, setConversationAssignedTeam] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(
    surveyid || selectedConversation?.meta?.sender?.id
  );
  const [activeCollapseSection, setActiveCollapseSection] = useState(null);
  const initialValues = {
    reactSelect: labelSelected.map((val) => {
      return { value: val, label: val };
    }),
  };
  const [copied, setCopied] = useState(false);

  const handlecopy = (email) => {
    navigator.clipboard.writeText(email);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const reloadDetailPage = () => {
    detailsContactItemCleanBeforeLoadAction({});
  };

  useEffect(() => {
    getAgentsAction();
    getTeamsAction();
  }, []);

  useEffect(() => {
    if (
      selectedConversation &&
      selectedConversation?.labels &&
      Array.isArray(selectedConversation.labels)
    ) {
      const selectedLabels = selectedConversation.labels.map((item) => ({
        value: item,
        label: item,
      }));
      setConversationLabels(selectedLabels);
    }
  }, [selectedConversation?.labels]);

  useEffect(() => {
    if (selectedConversation?.meta?.assignee?.id) {
      setConversationAssignedAgent({
        label: selectedConversation.meta.assignee?.name ?? '',
        value: selectedConversation.meta.assignee?.name ?? '',
        id: selectedConversation.meta.assignee.id,
      });
    } else {
      setConversationAssignedAgent(defaultLabelOption);
    }
  }, [selectedConversation?.meta?.assignee]);

  useEffect(() => {
    if (selectedConversation?.meta?.team?.id) {
      setConversationAssignedTeam({
        label: selectedConversation.meta.team?.name ?? '',
        value: selectedConversation.meta.team?.name ?? '',
        id: selectedConversation.meta.team.id,
      });
    } else {
      setConversationAssignedTeam(defaultLabelOption);
    }
  }, [selectedConversation?.meta?.team]);

  const handleAssignAgent = (e) => {
    if (e.id) {
      setConversationAssignedAgent(e);
      assignConversationAgent({
        id: selectedConversation.id,
        assignee_id: e.id,
      });
    } else {
      setConversationAssignedAgent(e);
      assignConversationAgent({
        id: selectedConversation.id,
      });
    }
  };

  const handleAssignTeam = (e) => {
    if (e.id) {
      setConversationAssignedTeam(e);
      assignConversationTeam({ id: selectedConversation.id, team_id: e.id });
    } else {
      setConversationAssignedTeam(e);
      assignConversationTeam({ id: selectedConversation.id, team_id: 0 });
    }
  };

  const addConversationLabel = (selectedLabelValues) => {
    setConversationLabels(selectedLabelValues);
    addConversationLabelAction({
      id: selectedConversation.id,
      labels: selectedLabelValues.map((lab) => lab.value),
    });
  };

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(false);
  };

  const onChangeLabel = (value) => {
    if (formLoadingLabel || !labelSelectedLoaded) {
      return false;
    }
    const payload = value.map((val) => {
      return val.value;
    });
    addLabelContactItemAction({
      labels: payload,
      contact_id: selectedContactId,
    });
    return true;
  };
  if (formSuccessLabel) {
    addLabelContactItemCleanAction({});
    NotificationManager.success(
      'Saved successfully',
      'Success',
      6000,
      null,
      null,
      ''
    );
  }
  if (formError && formError.errorMsg) {
    NotificationManager.error(
      formError.errorMsg,
      'Error',
      6000,
      null,
      null,
      ''
    );
  }

  if (!editFormData) {
    detailsContactItemAction({ id: selectedContactId });
  }
  if (!labelSelectedLoaded) {
    getLabelContactItemAction({ id: selectedContactId });
  }

  const onDeleteSuccess = () => {
    history.replace(`${adminRoot}/contacts/list`);
  };
  const refreshContactData = () => {
    detailsContactItemAction({ id: selectedContactId });
  };

  const toggleContactGroupCollapse = (collapseId) => {
    if (collapseId === activeCollapseSection) {
      setActiveCollapseSection(null);
    } else {
      setActiveCollapseSection(collapseId);
    }
  };

  useEffect(() => {
    if (selectedConversation?.meta?.sender?.id) {
      setSelectedContactId(selectedConversation.meta.sender.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedContactId && selectedConversation) {
      getLabelContactItemAction({ id: selectedContactId });
      detailsContactItemAction({ id: selectedContactId });
    }
  }, [selectedContactId]);

  const getConversionLabelValues = () => {
    return conversationLabels.map((option) => {
      const data = labels.find((label) => {
        return label.title === option.value;
      });
      return { label: data?.title, value: data?.title, color: data?.color };
    });
  };

  const getContactLabelValues = (values) => {
    return values?.map((option) => {
      const data = labels.find((label) => {
        return label.title === option.value;
      });
      return { label: data?.title, value: data?.title, color: data?.color };
    });
  };

  const { Option } = components;
  const IconOption = (props) => (
    <Option {...props}>
      <span
        className="log-indicator align-middle mr-1 "
        style={{
          borderColor: props.data.color,
          backgroundColor: props.data.color,
        }}
      />
      {props.data.label}
    </Option>
  );

  return (
    <>
      {editFormData ? (
        <>
          <Row>
            <Colxx className="custom">
              <PerfectScrollbar
                options={{ suppressScrollX: true, wheelPropagation: false }}
              >
                <Card className="mb-412">
                  <CardBody className="pb-2">
                    <Row>
                      <Colxx xxs="12">
                        <div className="d-flex justify-content-between">
                          <div className="userAvtar">
                            {displayName?.charAt(0) ?? ''}
                          </div>
                          {showToggleButton ? (
                            <div
                              role="button"
                              tabIndex={0}
                              className="de-contact-options-item"
                              onClick={() => setShowDetails(!showDetails)}
                            >
                              <i className="simple-icon-arrow-right-circle" />
                            </div>
                          ) : null}
                        </div>
                      </Colxx>
                      <Colxx xxs="12">
                        <div className="p-2">
                          <div className="d-flex align-items-center">
                            <h6
                              className="font-weight-bold mr-2 mt-2 text-truncate flex-grow-1"
                              title={displayName}
                            >
                              {displayName}
                            </h6>
                            {showGoToLink ? (
                              <NavLink
                                to={`${adminRoot}/contacts/details/${editFormData?.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="simple-icon-link text-muted" />
                              </NavLink>
                            ) : null}
                          </div>
                        </div>
                      </Colxx>

                      <Colxx className="text-muted text-medium mb-2">
                        <div className="pr-2" title={editFormData?.email}>
                          <div className="d-flex">
                            <div>
                              <i className="mr-2 iconsminds-mail" />
                            </div>
                            <a
                              className="flex-grow-1 min-width-0 text-truncate hover-effect text-muted"
                              href={`mailto:${editFormData?.email}`}
                            >
                              {editFormData?.email}
                            </a>
                            <div>
                              <i
                                role="button"
                                tabIndex={0}
                                className="iconsminds-file-clipboard"
                                onClick={() => handlecopy(editFormData?.email)}
                                style={{ cursor: 'pointer' }}
                              />
                            </div>
                          </div>
                          {copied && (
                            <Alert className="alert-style">
                              <IntlMessages id="COMMON_ALERTS.COPIED_TO_CLIPBOARD" />
                            </Alert>
                          )}
                        </div>
                      </Colxx>

                      <Colxx xxs="12" className="text-muted text-medium mb-2 ">
                        <div className="d-flex">
                          <span>
                            <i className="mr-2 simple-icon-phone" />
                          </span>
                          <div className="flex-grow-1 text-truncate">
                            {editFormData?.phone_number}
                          </div>
                        </div>
                      </Colxx>

                      <Colxx
                        xxs="12"
                        className="text-muted text-medium mb-2 text-truncate hover-effect "
                      >
                        <div
                          className="d-flex"
                          title={
                            editFormData?.additional_attributes?.company_name
                          }
                        >
                          <span>
                            <i className="mr-2 simple-icon-home" />
                          </span>
                          <div className="text-truncate">
                            {editFormData?.additional_attributes
                              ?.company_name || (
                              <IntlMessages id="CONTACTS_PAGE.OPTION_LABELS.NOT_AVAILABLE" />
                            )}
                          </div>
                        </div>
                      </Colxx>
                    </Row>
                    {editFormData?.additional_attributes?.social_profiles && (
                      <div className="social-icons">
                        <div className="list-unstyled list-inline">
                          <SocialLinks
                            props={editFormData}
                            className="list-inline-item mr-2"
                          />
                        </div>
                      </div>
                    )}
                    {showMoreUserDetails &&
                    editFormData?.additional_attributes?.bio ? (
                      <Row>
                        <Colxx xxs="12" sm="12">
                          <p className="mb-2 text-muted">
                            {editFormData.additional_attributes.bio}
                          </p>
                        </Colxx>
                      </Row>
                    ) : null}
                    <Row>
                      <Colxx xxs="12">
                        <div className="d-flex flex-wrap de-contact-btn-group">
                          {showNewMessageButton ? (
                            <>
                              <div
                                role="button"
                                tabIndex={0}
                                className="de-icon-btn-secondary"
                                onClick={() => setNewMsgModal(true)}
                                id="newMessage"
                                data-testid="newMessage"
                              >
                                <i className="simple-icon-speech" />
                              </div>
                              <UncontrolledTooltip
                                placement="bottom"
                                target="newMessage"
                              >
                                <small>
                                  <IntlMessages id="CONVERSATION.NEW_MESSAGE" />
                                </small>
                              </UncontrolledTooltip>
                            </>
                          ) : null}
                          <div
                            role="button"
                            tabIndex={0}
                            className="de-icon-btn-secondary"
                            onClick={() =>
                              setEditContectModalOpen(!editContectModalOpen)
                            }
                            id="editContact"
                            data-testid="editContact"
                          >
                            <i className="simple-icon-pencil" />
                          </div>
                          <UncontrolledTooltip
                            placement="bottom"
                            target="editContact"
                          >
                            <small>
                              <IntlMessages id="CONVERSATION.EDIT_CONTACT" />
                            </small>
                          </UncontrolledTooltip>
                          <div
                            role="button"
                            tabIndex={0}
                            className="de-icon-btn-secondary"
                            onClick={() => setModalOpenDelete(!modalOpenDelete)}
                            id="deleteContact"
                            data-testid="deleteContact"
                          >
                            <i className="simple-icon-trash" />
                          </div>
                          <UncontrolledTooltip
                            placement="bottom"
                            target="deleteContact"
                          >
                            <small>
                              <IntlMessages id="CONVERSATION.DELETE_CONTACT" />
                            </small>
                          </UncontrolledTooltip>
                          <div
                            role="button"
                            tabIndex={0}
                            className="de-icon-btn-secondary"
                            onClick={() => setModalOpenMerge(!modalOpenMerge)}
                            id="mergeContact"
                            data-testid="mergeContact"
                          >
                            <i className="iconsminds-arrow-merge" />
                          </div>
                          <UncontrolledTooltip
                            placement="bottom"
                            target="mergeContact"
                          >
                            <small>
                              <IntlMessages id="CONVERSATION.MERGE_CONTACT" />
                            </small>
                          </UncontrolledTooltip>
                        </div>
                      </Colxx>
                    </Row>
                  </CardBody>
                  <div>
                    {showConversationInformation && (
                      <CollapsibleSection
                        title="CONVERSATION.CONVERSATIONS_INFO"
                        collapseSectionId="conversationInfo"
                        toggleGroupCollapseClick={toggleContactGroupCollapse}
                        openCollapse={activeCollapseSection}
                      >
                        <ContactAttributes
                          attributeType="conversation_attribute"
                          contactId={selectedContactId}
                          customAttributes={
                            lastSeenData?.custom_attributes ?? {}
                          }
                          conversationId={selectedConversation?.id}
                        />
                      </CollapsibleSection>
                    )}
                    {showConversationAction && (
                      <CollapsibleSection
                        title="CONVERSATION.CONVERSATION_ACTION"
                        collapseSectionId="conversationAction"
                        toggleGroupCollapseClick={toggleContactGroupCollapse}
                        openCollapse={activeCollapseSection}
                      >
                        <section className="p-4">
                          <div className="has-float-label mb-3">
                            <Label>
                              <IntlMessages id="CONVERSATION.ASSIGNED_AGENT" />
                            </Label>
                            <Select
                              className="react-select"
                              classNamePrefix="react-select"
                              placeholder={
                                <IntlMessages id="CONVERSATION.SELECT_AGENT" />
                              }
                              name="form-field-name"
                              onChange={(e) => handleAssignAgent(e)}
                              options={[
                                { label: 'None', value: '', id: 0 },
                                ...agents.map((item) => {
                                  return {
                                    label: item.name,
                                    value: item.name,
                                    id: item.id,
                                  };
                                }),
                              ]}
                              value={conversationAssignedAgent}
                            />
                          </div>
                          <div className="has-float-label mb-3">
                            <Label>
                              <IntlMessages id="CONVERSATION.ASSIGNED_TEAM" />
                            </Label>
                            <Select
                              className="react-select"
                              classNamePrefix="react-select"
                              placeholder={
                                <IntlMessages id="CONVERSATION.SELECT_TEAM" />
                              }
                              name="form-field-name"
                              onChange={(e) => handleAssignTeam(e)}
                              options={[
                                { label: 'None', value: '', id: 0 },
                                ...teams.map((item) => {
                                  return {
                                    label: item.name,
                                    value: item.name,
                                    id: item.id,
                                  };
                                }),
                              ]}
                              value={conversationAssignedTeam}
                            />
                          </div>
                          <div className="has-float-label mb-3">
                            <Label>
                              <IntlMessages id="CONVERSATION.CONVERSATION_LABELS" />
                            </Label>
                            <Select
                              className="react-select"
                              classNamePrefix="react-select"
                              isMulti
                              placeholder={
                                <IntlMessages id="CONVERSATION.SELECT_LABEL" />
                              }
                              name="form-field-name"
                              onChange={(e) => addConversationLabel(e)}
                              options={labels.map((item) => {
                                return {
                                  label: item.title,
                                  value: item.title,
                                  color: item.color,
                                };
                              })}
                              value={getConversionLabelValues()}
                              components={{ Option: IconOption }}
                              styles={conversationLabelCustomStyle}
                            />
                          </div>
                        </section>
                      </CollapsibleSection>
                    )}
                    {showContactAttributes && (
                      <CollapsibleSection
                        title="contacts.contact_attributes"
                        collapseSectionId="contactAttributes"
                        toggleGroupCollapseClick={toggleContactGroupCollapse}
                        openCollapse={activeCollapseSection}
                      >
                        <ContactAttributes
                          contactId={selectedContactId}
                          customAttributes={
                            editFormData?.custom_attributes ?? {}
                          }
                        />
                      </CollapsibleSection>
                    )}
                    {showContactLabels && (
                      <CollapsibleSection
                        title="contacts.contact_labels"
                        collapseSectionId="contactLabels"
                        toggleGroupCollapseClick={toggleContactGroupCollapse}
                        openCollapse={activeCollapseSection}
                      >
                        <CardBody className="pb-0">
                          <Formik
                            initialValues={initialValues}
                            enableReinitialize
                            onSubmit={onSubmit}
                          >
                            {({
                              setFieldValue,
                              setFieldTouched,
                              values,
                              errors,
                              touched,
                            }) => (
                              <Form className="av-tooltip tooltip-label-right">
                                <FormGroup className="error-l-100 has-float-label">
                                  <Label>
                                    <IntlMessages id="CONVERSATION.CONTACT_LABELS" />
                                  </Label>
                                  <Select
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    dataTestID="label-select"
                                    placeholder={
                                      <IntlMessages id="CONVERSATION.SELECT_LABEL" />
                                    }
                                    options={labels.map((val) => {
                                      return {
                                        value: val.title,
                                        label: val.title,
                                        color: val.color,
                                      };
                                    })}
                                    isMulti
                                    onBlur={setFieldTouched}
                                    value={getContactLabelValues(
                                      values.reactSelect
                                    )}
                                    onChange={(val) => {
                                      setFieldValue('reactSelect', val);
                                      onChangeLabel(val);
                                    }}
                                    components={{ Option: IconOption }}
                                    styles={conversationLabelCustomStyle}
                                  />
                                  {formErrorLabel &&
                                    formErrorLabel.errorMsg && (
                                      <Alert color="danger" className="rounded">
                                        {formErrorLabel.errorMsg}
                                      </Alert>
                                    )}
                                  {errors.reactSelect && touched.reactSelect ? (
                                    <div className="invalid-feedback d-block">
                                      {errors.reactSelect}
                                    </div>
                                  ) : null}
                                </FormGroup>
                              </Form>
                            )}
                          </Formik>
                        </CardBody>
                      </CollapsibleSection>
                    )}
                    {showPreviousConversations && (
                      <CollapsibleSection
                        title="contacts.prev_conversations"
                        collapseSectionId="previousConversations"
                        toggleGroupCollapseClick={toggleContactGroupCollapse}
                        openCollapse={activeCollapseSection}
                      >
                        <ContactConversations
                          id={selectedContactId}
                          selectedConversation={selectedConversation}
                        />
                      </CollapsibleSection>
                    )}
                  </div>
                </Card>
              </PerfectScrollbar>
            </Colxx>
          </Row>
          <AddNewModal
            modalOpen={editContectModalOpen}
            toggleModal={() => {
              setEditContectModalOpen(!editContectModalOpen);
            }}
            editFormData={editFormData}
            onSaveSuccess={refreshContactData}
          />
          <DeleteModal
            modalOpen={modalOpenDelete}
            toggleModal={() => {
              setModalOpenDelete(!modalOpenDelete);
            }}
            editFormData={editFormData || {}}
            onDeleteSuccess={onDeleteSuccess}
          />
          <MergeModal
            modalOpen={modalOpenMerge}
            toggleModal={(isSuccess) => {
              setModalOpenMerge(!modalOpenMerge);
              if (isSuccess === 'yes') {
                reloadDetailPage();
              }
            }}
            editFormData={editFormData}
            selectedSuggestion={selectedSuggestion}
            setSelectedSuggestion={setSelectedSuggestion}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};
const mapStateToProps = ({
  contactsApp,
  labelsApp,
  agentsApp,
  teamsApp,
  inboxApp,
}) => {
  const {
    successDetails,
    errorDetails,
    loadingDetails,
    item,
    labelSelected,
    labelSelectedLoaded,
    successLabel,
    errorLabel,
    loadingLabel,
  } = contactsApp;
  const { lastSeenData } = inboxApp;
  const { labels, loadedLabels } = labelsApp;
  const { loadedAgents, agents } = agentsApp;
  const { teams, loadedTeams } = teamsApp;
  return {
    formSuccess: successDetails,
    formError: errorDetails,
    formLoading: loadingDetails,
    editFormData: item,
    labels,
    loadedLabels,
    loadedAgents,
    agents,
    teams,
    loadedTeams,
    labelSelected,
    labelSelectedLoaded,
    formSuccessLabel: successLabel,
    formErrorLabel: errorLabel,
    formLoadingLabel: loadingLabel,
    lastSeenData,
  };
};
export default connect(mapStateToProps, {
  detailsContactItemAction: detailsContactItem,
  detailsContactItemCleanBeforeLoadAction: detailsContactItemCleanBeforeLoad,
  getAgentsAction: getAgents,
  getTeamsAction: getTeams,
  assignConversationAgent: assignAgent,
  assignConversationTeam: assignTeam,
  addConversationLabelAction: conversationLabel,
  addLabelContactItemAction: addLabelContactItem,
  getLabelContactItemAction: getLabelContactItem,
  addLabelContactItemCleanAction: addLabelContactItemClean,
})(ContactDetails);
