import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Row, CardBody } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import {
  detailsContactItem,
  getLabelContactItem,
  addLabelContactItem,
  addLabelContactItemClean,
  detailsContactItemCleanBeforeLoad,
  getLabels,
} from 'redux/actions';

import ContactComments from 'containers/contacts/ContactComments';
import AddCommentsContact from 'containers/contacts/AddCommentsContact';
import NewMessageModal from 'containers/contacts/NewMessageModal';
import ContactDetails from 'containers/contacts/contactDetails';

const ContactsDetail = ({
  surveyid,
  match,
  detailsContactItemAction,
  editFormData,
  getLabelsAction,
  newConversationSuccess,
  newConversationError,
  detailsContactItemCleanBeforeLoadAction,
}) => {
  const [newMsgModal, setNewMsgModal] = useState(false);

  const reloadDetailPage = () => {
    detailsContactItemCleanBeforeLoadAction({});
  };
  useEffect(() => {
    reloadDetailPage(); // reload detail page first time page load
    getLabelsAction();
  }, []);

  if (!editFormData) {
    detailsContactItemAction({ id: match.params.surveyid });
  }

  return (
    <>
      <Row className="app-row1 survey-app1" data-id={surveyid}>
        <Colxx xxs="12" className="contact-details-custom">
          <h1>
            <span className="align-middle d-inline-block pt-1">
              <IntlMessages id="CONTACTS_PAGE.OPTION_LABELS.CONTACT_DETAILS" />
            </span>
          </h1>
          <NewMessageModal
            formSuccess={newConversationSuccess}
            formError={newConversationError}
            contactId={match.params.surveyid}
            modalOpen={newMsgModal}
            toggleModal={(isSuccess) => {
              setNewMsgModal(!newMsgModal);
              if (isSuccess === 'yes') {
                reloadDetailPage();
              }
            }}
            editFormData={editFormData}
          />
          <Breadcrumb match={match} />
          <Separator className="mb-5" />
          {editFormData && (
            <>
              <Row>
                <Colxx xxs="12" lg="3" md="4">
                  <ContactDetails
                    surveyid={match.params.surveyid}
                    showContactAttributes={true}
                    showContactLabels={true}
                    showPreviousConversations={true}
                    showMoreUserDetails={true}
                    showNewMessageButton={true}
                    setNewMsgModal={setNewMsgModal}
                  />
                </Colxx>
                <Colxx xxs="12" lg="8">
                  <CardBody>
                    <AddCommentsContact id={editFormData.id} />
                    <ContactComments id={match.params.surveyid} />
                  </CardBody>
                </Colxx>
              </Row>
            </>
          )}
        </Colxx>
      </Row>
    </>
  );
};

const mapStateToProps = ({ contactsApp, labelsApp }) => {
  const {
    successDetails,
    newConversationDetails,
    newConversationDetailsError,
    errorDetails,
    loadingDetails,
    item,
    labelSelected,
    labelSelectedLoaded,
    successLabel,
    errorLabel,
    loadingLabel,
  } = contactsApp;
  const { labels, loadedLabels } = labelsApp;
  return {
    formSuccess: successDetails,
    newConversationSuccess: newConversationDetails,
    newConversationError: newConversationDetailsError,
    formError: errorDetails,
    formLoading: loadingDetails,
    editFormData: item,
    labels,
    loadedLabels,
    labelSelected,
    labelSelectedLoaded,
    formSuccessLabel: successLabel,
    formErrorLabel: errorLabel,
    formLoadingLabel: loadingLabel,
  };
};
export default connect(mapStateToProps, {
  detailsContactItemAction: detailsContactItem,
  getLabelsAction: getLabels,
  getLabelContactItemAction: getLabelContactItem,
  addLabelContactItemAction: addLabelContactItem,
  addLabelContactItemCleanAction: addLabelContactItemClean,
  detailsContactItemCleanBeforeLoadAction: detailsContactItemCleanBeforeLoad,
})(ContactsDetail);
