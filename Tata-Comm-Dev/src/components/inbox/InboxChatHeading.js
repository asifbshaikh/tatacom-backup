import React, { useState } from 'react';
import { connect } from 'react-redux';

import Thumbnail from 'components/common/Thumbnail';
import IconChannel from 'components/common/IconChannel';
import { NavLink } from 'react-router-dom';

import IntlMessages from 'helpers/IntlMessages';

import SendConversationModal from 'containers/inbox/SendConversationModal';

import {
  getUnixTime,
  addHours,
  addWeeks,
  startOfTomorrow,
  startOfWeek,
  differenceInHours,
} from 'date-fns';

import {
  Button,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  ButtonDropdown,
} from 'reactstrap';

import { adminRoot } from 'constants/defaultValues';
import {
  changeConversationMuted,
  changeConversationStatus,
} from 'redux/actions';
import { NotificationManager } from 'components/common/react-notifications';

const ChatHeading = ({
  meta,
  metaChannelName,
  selectedConversation,
  changeConversationMutedAction,
  changeConversationStatusAction,
  showDetails,
  setShowDetails,
}) => {
  const [dropdownSplitOpen, setDropdownSplitOpen] = useState(false);
  const [modalOpenSend, setModalOpenSend] = useState(false);
  const changeConversationMutedLocal = (muted) => {
    const newStatus = !muted;
    changeConversationMutedAction({
      muted: newStatus,
      id: selectedConversation?.id,
    });
  };

  const changeStatusAction = (newStatus) => {
    const { status, snoozedUntil } = newStatus;
    changeConversationStatusAction({
      status,
      id: selectedConversation?.id,
      snoozed_until: snoozedUntil || null,
    });
    NotificationManager.success(
      <IntlMessages id={'CUSTOM_ATTRIBUTES.ALERT_MESSAGES.STATUS_SUCCESS'} />,
      'Success',
      6000,
      null,
      null,
      ''
    );
  };

  const ChatStatusDropdown = () => {
    let mainButton = {};
    let otherButtons = [];
    switch (selectedConversation?.status) {
      case 'pending':
      case 'snoozed':
        mainButton = {
          title: 'inbox.btn_open',
          status: 'open',
          iconTring: 'person-outline',
        };
        break;
      case 'open':
        mainButton = {
          title: 'inbox.btn_resolve',
          status: 'resolved',
          iconTring: 'checkmark-outline',
        };
        otherButtons = [
          {
            title: 'inbox.btn_pending',
            status: 'pending',
            iconTring: 'book-clock-outline',
          },
          { title: 'inbox.btn_snoozed_until', disabled: true, divider: true },
          {
            title: 'inbox.btn_snoozed_nextreply',
            status: 'snoozed',
            snoozedUntil: null,
            iconTring: 'send-clock-outline',
          },
          {
            title: 'inbox.btn_snoozed_tomorrow',
            status: 'snoozed',
            iconTring: 'dual-screen-clock-outline',
            snoozedUntil: getUnixTime(addHours(startOfTomorrow(), 9)),
          },
          {
            title: 'inbox.btn_snoozed_nextweek',
            status: 'snoozed',
            iconTring: 'calendar-clock-outline',
            snoozedUntil: getUnixTime(
              addHours(
                startOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 }),
                9
              )
            ),
          },
        ];
        break;
      case 'resolved':
        mainButton = {
          title: 'inbox.btn_reopen',
          status: 'open',
          iconTring: 'arrow-redo-outline',
        };
        otherButtons = [
          {
            title: 'inbox.btn_pending',
            status: 'pending',
            iconTring: 'book-clock-outline',
          },
        ];
        break;
      default:
        break;
    }
    if (!mainButton.title) {
      return 'NO_STATUS';
    }
    return (
      <ButtonDropdown
        className="top-right-button top-right-button-single"
        isOpen={dropdownSplitOpen}
        toggle={() => setDropdownSplitOpen(!dropdownSplitOpen)}
      >
        <Button
          className="flex-grow-1 mb-4"
          size="lg"
          color="primary"
          onClick={() => changeStatusAction(mainButton)}
        >
          {mainButton.iconTring && (
            <IconChannel channelType={mainButton.iconTring} widthheight="16" />
          )}
          <IntlMessages id={mainButton.title} />
        </Button>
        {otherButtons.length ? (
          <>
            <DropdownToggle
              className="dropdown-toggle-split btn-lg mb-4"
              caret
              color="primary"
            />
            <DropdownMenu right>
              {otherButtons.map((btn, index) => {
                return (
                  <div key={`otherButtons_${index}`}>
                    {btn.divider && <DropdownItem divider />}
                    <DropdownItem
                      onClick={() => changeStatusAction(btn)}
                      disabled={btn.disabled}
                    >
                      {btn.iconTring && (
                        <IconChannel
                          channelType={btn.iconTring}
                          widthheight="16"
                        />
                      )}
                      <IntlMessages id={btn.title} />
                    </DropdownItem>
                  </div>
                );
              })}
            </DropdownMenu>
          </>
        ) : (
          ''
        )}
      </ButtonDropdown>
      /*
            <ButtonDropdown
                className="top-right-button top-right-button-single"
                isOpen={dropdownSplitOpen}
                toggle={() => setDropdownSplitOpen(!dropdownSplitOpen)}
            >
                <Button outline className="flex-grow-1" size="lg" color="primary" onClick={changeStatus}>
                    SAVE
                </Button>
                <DropdownToggle
                    size="lg"
                    className="dropdown-toggle-split btn-lg"
                    caret
                    outline
                    color="primary"
                />
                <DropdownMenu right>
                    <DropdownItem>
                        <IntlMessages id="survey.delete" />
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem disabled>
                        <IntlMessages id="survey.edit" />
                    </DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>
            */
    );
  };

  const snoozedDisplayText = (snoozedUntil) => {
    if (snoozedUntil) {
      // When the snooze is applied, it schedules the unsnooze event to next day/week 9AM.
      // By that logic if the time difference is less than or equal to 24 + 9 hours we can consider it tomorrow.
      const MAX_TIME_DIFFERENCE = 33;
      const isSnoozedUntilTomorrow =
        differenceInHours(new Date(snoozedUntil), new Date()) <=
        MAX_TIME_DIFFERENCE;
      return isSnoozedUntilTomorrow
        ? 'inbox.snoozed_until_tomorrow'
        : 'inbox.snoozed_until_next_week';
    }
    return 'inbox.snoozed_until_next_reply';
  };

  return (
    <>
      <div className="d-flex flex-row chat-heading">
        <div className="d-flex">
          {/* <img
                        alt={name}
                        src={thumb}
                        className="img-thumbnail border-0 rounded-circle ml-0 mr-4 list-thumbnail align-self-center small"
                    /> */}
          <Thumbnail
            source={meta.contact.thumbnail}
            name={meta.contact.name ? meta.contact.name : meta.contact.email}
          />
        </div>
        <div className=" d-flex min-width-zero">
          <div className="card-body pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
            <div className="min-width-zero">
              <div>
                <p className="list-item-heading mb-1 truncate ">
                  {meta.contact.name}
                </p>
              </div>
              <p className="d-flex mb-0 text-muted text-small">
                <span>
                  <span className="w-40 truncate text-extra-small">
                    <IconChannel
                      channelName={metaChannelName}
                      channelType={metaChannelName}
                    />
                    {metaChannelName}
                  </span>
                  <span
                    role="presentation"
                    onClick={() => setShowDetails(!showDetails)}
                    className="ml-2 c-pointer text-primary active text-nowrap"
                  >
                    {!showDetails ? 'More Details' : 'Close Details'}
                  </span>
                </span>

                {/* {lastSeenDate === '0' ? '-' : lastSeenDate} */}
                {selectedConversation?.status === 'snoozed' && (
                  <span className="ml-2" style={{ color: '#f9841b' }}>
                    <IntlMessages
                      id={snoozedDisplayText(
                        selectedConversation?.snoozed_until
                      )}
                    />
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="header-icon position-absolute r-0 mr-5 mt-4">
            {/* <NavLink className='p-0 mr-3' to="#"
                            onClick={() => {
                                changeConversationMutedLocal(selectedConversation.muted)
                            }}>
                            <i
                                className={`${selectedConversation.muted ? 'simple-icon-volume-2' : 'simple-icon-volume-off'}`}
                                title={`${selectedConversation.muted ? 'Unmute Conversation' : 'Mute Conversation'}`}
                            />
                        </NavLink> */}
            <NavLink
              className="p-0 mr-2 "
              to="#"
              title={`${
                selectedConversation?.muted
                  ? 'Unmute Conversation'
                  : 'Mute Conversation'
              }`}
              onClick={() => {
                changeConversationMutedLocal(selectedConversation?.muted);
              }}
            >
              <IconChannel
                channelType={
                  selectedConversation?.muted
                    ? 'speaker-mute-outline'
                    : 'speaker-1-outline'
                }
                width="25"
                height="35"
              />
            </NavLink>
            <NavLink
              className="p-0 mr-3"
              to="#"
              title="Send Transcript"
              onClick={() => {
                setModalOpenSend(!modalOpenSend);
              }}
            >
              <IconChannel channelType="share-outline" width="25" height="35" />
            </NavLink>
            <SendConversationModal
              modalOpen={modalOpenSend}
              toggleModal={() => {
                setModalOpenSend(!modalOpenSend);
              }}
              selectedConversation={selectedConversation}
            />
            <div className="text-zero top-right-button-container">
              <ChatStatusDropdown />
            </div>
          </div>
        </div>
      </div>
      <div className="separator mb-5" />
    </>
  );
};

const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {
  changeConversationMutedAction: changeConversationMuted,
  changeConversationStatusAction: changeConversationStatus,
})(ChatHeading);
