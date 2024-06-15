import React from 'react';

// import FormGroupCoustom from 'components/common/FormGroupCoustom';
import IntlMessages from 'helpers/IntlMessages';
// import { connect } from 'react-redux';

// import {
//     Formik,
//     Form,
//     // Field
// } from 'formik';

import {
  // FormGroup,
  // Label,
  Row,
  Button,
  // NavLink,
  // Alert,
  // Card, CardBody
} from 'reactstrap';
// import { injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';

import { adminRoot } from 'constants/defaultValues';

import { Colxx } from 'components/common/CustomBootstrap';
import { INBOX_TYPES } from 'helpers/TringIconHelper';

const Website = ({
  fields,
  // formRef,
  // next,
  // setFieldsCoustom,
}) => {
  let secondaryMsg = 'inboxes.finish_message';
  if (fields?.currentInbox?.channel_type === INBOX_TYPES.EMAIL) {
    secondaryMsg = 'inboxes.email_channel.finish_message';
  } else if (fields?.currentInbox?.web_widget_script) {
    secondaryMsg = 'inboxes.finish_website_success';
  }

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <h2 className="mb-4 font-weight-bold">
            {/* INBOX_MGMT.FINISH.TITLE
                                INBOX_MGMT.FINISH.BUTTON_TEXT
                                currentInbox.web_widget_script
                                isATwilioInbox currentInbox.callback_webhook_url
                                isATataInbox currentInbox.callback_webhook_url
                                isAViberInbox  currentInbox.callback_webhook_url
                                isALineInbox
                                isASmsInbox
                                isAEmailInbox => fields.currentInbox.forward_to_email ONLY (currentInbox.channel_type === 'Channel::Email')  */}

            {/* if (this.isATwilioInbox) {
        return `${this.$t('INBOX_MGMT.FINISH.MESSAGE')}. ${this.$t(
          'INBOX_MGMT.ADD.TWILIO.API_CALLBACK.SUBTITLE'
        )}`;
        
      } */}

            <IntlMessages id="inboxes.finish_title" />
          </h2>
          <p>
            <IntlMessages id={secondaryMsg} />
          </p>

          {fields?.currentInbox?.web_widget_script && (
            <div className="directContent">
              {/* <i */}
              <div className="position-absolute  pt-1 pl-2 l-0">
                <NavLink
                  className="p-0"
                  href="#"
                  to={{}}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      fields.currentInbox.web_widget_script
                    );
                  }}
                >
                  <i className="simple-icon-docs large-icon1 initial-height1 ml-1" />
                </NavLink>
              </div>
              <code>{fields.currentInbox.web_widget_script}</code>
            </div>
          )}

          <div>
            <NavLink
              className="ml-2 text-primary1 active1"
              to={`${adminRoot}/settings/inboxes/${fields.inbox_id}`}
            >
              <Button color="secondary">
                <IntlMessages id="inboxes.moresettings" />
              </Button>
            </NavLink>
            <NavLink
              className="ml-2 text-primary1 active1"
              to={`${adminRoot}/settings/inboxes`}
            >
              <Button color="primary">
                <IntlMessages id="inboxes.takemethere" />
              </Button>
            </NavLink>
          </div>
        </Colxx>
      </Row>
    </>
  );
};

export default Website;

// const mapStateToProps = ({ channelsApp }) => {
//     const { successAdd, errorAdd, loadingAdd, addData } = channelsApp;
//     return { formSuccess: successAdd, formError: errorAdd, formLoading: loadingAdd, addData };
// };
// export default connect(mapStateToProps, {
//     // addChannelWebsiteAction: addChannelWebsite,
//     // addChannelWebsiteCleanAction: addChannelWebsiteClean,
//     addChannelWebsiteAction: addChannel,
//     addChannelWebsiteCleanAction: addChannelClean,
// })(Website);
