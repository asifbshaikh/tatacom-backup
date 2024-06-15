import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import {
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalHeader,
  NavLink,
} from 'reactstrap';
import Thumbnail from 'components/common/Thumbnail';
import {
  generateBotMessageContent,
  stripStyleCharacters,
  formatMessage,
  MESSAGE_TYPE,
} from 'helpers/TringReactHelper';
import IntlMessages from 'helpers/IntlMessages';
import HTMLReactParser from 'html-react-parser';
import moment from 'moment';
import { DATE_AND_TIME } from 'constants/appConstant';
import ConversationEnums from 'enums/conversations/conversationEnums';
import { NotificationManager } from 'components/common/react-notifications';
import { getContent } from 'helpers/Utils';

const InboxMessageCard = ({ item, deleteMessageAction }) => {
  const [imageClicked, setImageClicked] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const toggle = () => {
    setImageClicked(!imageClicked);
  };
  let senderClass = 'w-100';
  if (!item.sender && item.content_type === ConversationEnums.INPUT_CSAT) {
    senderClass = 'float-right';
  }
  if (item.sender) {
    senderClass = item.sender.type === 'contact' ? 'float-left' : 'float-right';
  }
  const noProperMessage =
    item.content_attributes.deleted ||
    (!item.sender && item.content_type !== ConversationEnums.INPUT_CSAT);

  const getMessage = () => {
    const botMessageContent = generateBotMessageContent(
      item.content_type,
      item.content_attributes,
      {
        noResponseText: 'No response',
        csat: {
          ratingTitle: 'Rating',
          feedbackTitle: 'Feedback',
        },
      }
    );

    const {
      html_content: { full: fullHTMLContent } = {},
      text_content: { full: fullTextContent } = {},
    } = item.content_attributes.email || {};
    const contentToBeParsed = fullHTMLContent || fullTextContent || '';
    const isIncoming = item.message_type === MESSAGE_TYPE.INCOMING;
    const { email: { content_type: contentType = '' } = {} } =
      item.content_attributes;
    if (contentToBeParsed && isIncoming) {
      const parsedContent = stripStyleCharacters(contentToBeParsed);
      if (parsedContent) {
        // This is a temporary fix for line-breaks in text/plain emails
        // Now, It is not rendered properly in the email preview.
        // FIXME: Remove this once we have a better solution for rendering text/plain emails
        return contentType.includes('text/plain')
          ? parsedContent.replace(/\n/g, '<br />')
          : parsedContent;
      }
    }
    return formatMessage(item.content, item.isATweet) + botMessageContent;
  };
  const MESSAGE_STATUS = {
    PROGRESS: 'progress',
  };
  const isPending = (data) => {
    return data.status === MESSAGE_STATUS.PROGRESS;
  };
  const hasAttachments = (data) => {
    return !!(data.attachments && data.attachments.length > 0);
  };
  const fileName = (data) => {
    const filename = data.data_url.substring(
      data.data_url.lastIndexOf('/') + 1
    );
    return filename;
  };

  return (
    <>
      <Card
        className={`d-inline-block mb-3 ${senderClass}`}
        {...(item.private ? { color: 'theme-3' } : {})}
      >
        <div className="position-absolute  pt-1 pr-2 r-0">
          <span className="text-extra-small text-muted d-flex">
            {item.private && (
              <NavLink className="p-0">
                <i className="simple-icon-lock mr-1 large-icon1" />
              </NavLink>
            )}
            {item.content_attributes.deleted && (
              <NavLink className="p-0">
                <i title="deleted" className="simple-icon-close mr-1" />
              </NavLink>
            )}
            {moment.unix(item?.created_at).format(DATE_AND_TIME)}
            {!noProperMessage && (
              <>
                <NavLink
                  className="p-0"
                  href="#"
                  onClick={() => {
                    navigator.clipboard.writeText(item.content);
                    NotificationManager.success(
                      <IntlMessages id={'CONVERSATION.COPIED'} />,
                      'Success',
                      2000,
                      null,
                      null
                    );
                  }}
                  onMouseDown={() => setOpacity(0.5)}
                  onMouseUp={() => setOpacity(1)}
                >
                  <i
                    className="simple-icon-docs large-icon1 initial-height1 ml-1"
                    style={{ opacity: opacity }}
                  />
                </NavLink>
                <NavLink
                  className="p-0"
                  href="#"
                  onClick={() => {
                    deleteMessageAction(item);
                  }}
                >
                  <i className="simple-icon-trash large-icon1 initial-height1 ml-1" />
                </NavLink>
              </>
            )}
          </span>
        </div>
        <CardBody
          className={`${item.sender ? 'p-3' : 'p-1'} ${
            noProperMessage ? 'bg-semi-muted' : ''
          }`}
        >
          {item.sender && (
            <div className="d-flex flex-row pb-1">
              <div className="small-thumbnail">
                <Thumbnail
                  source={item.sender.thumbnail}
                  name={item.sender.name}
                />
              </div>
              <div className=" d-flex flex-grow-1 min-width-zero">
                <div className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                  <div className="min-width-zero">
                    <p className="mb-0 truncate list-item-heading custom-sender-name">
                      {item.sender.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!item.sender &&
            item.message_type === 3 &&
            item.content_type === ConversationEnums.INPUT_CSAT && (
              <div className="d-flex flex-row pb-1">
                <div className=" d-flex flex-grow-1 min-width-zero justify-content-end mt-4">
                  <div className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                    <div className="min-width-zero">
                      <p className="mb-0 truncate list-item-heading">
                        {HTMLReactParser(DOMPurify.sanitize(getMessage()))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          <div
            className={`${item.sender ? 'chat-text-left' : 'text-center'} ${
              item.sender ? '' : 'pr-5 pl-0'
            }`}
          >
            {item.content_attributes?.cc_emails?.length > 0 && (
              <div>
                <span>
                  <IntlMessages id="CONVERSATION.FOOTER.CC" />
                </span>
                {item.content_attributes?.cc_emails?.map((ccMail, index) => {
                  return (
                    `${ccMail}` +
                    (index != item.content_attributes.cc_emails.length - 1
                      ? ', '
                      : '')
                  );
                })}
              </div>
            )}
            {item.content_attributes?.bcc_emails?.length > 0 && (
              <div>
                <span>
                  <IntlMessages id="CONVERSATION.FOOTER.BCC" />
                </span>
                {item.content_attributes?.bcc_emails?.map((bccMail, index) => {
                  return (
                    `${bccMail}` +
                    (index != item.content_attributes.bcc_emails.length - 1
                      ? ', '
                      : '')
                  );
                })}
              </div>
            )}

            {item.content_type !== ConversationEnums.INPUT_CSAT && (
              <p className="m-0 text-semi-muted pr-4">
                {getContent(item.content, HTMLReactParser)}
              </p>
            )}
            {isPending(item) && hasAttachments(item) && (
              <div>
                <IntlMessages id="CONVERSATION.UPLOADING_ATTACHMENTS" />
              </div>
            )}
            {!isPending(item) && hasAttachments(item) && (
              <div className="inbox-attachment">
                {item.attachments.map((attachment) => {
                  return (
                    <div key={attachment.id}>
                      {attachment.file_type === 'image' && (
                        <div className="image-grid">
                          <NavLink
                            className="image-container button-pointer-cursor"
                            onClick={(e) => {
                              if (e.target.tagName === ConversationEnums.IMG) {
                                setImageClicked(!imageClicked);
                              }
                            }}
                          >
                            <img
                              src={attachment.data_url}
                              alt={attachment.file_type}
                            />
                          </NavLink>
                        </div>
                      )}
                      {attachment.file_type === 'audio' && (
                        <audio controls>
                          <source src={attachment.data_url} />
                        </audio>
                      )}
                      {attachment.file_type === 'file' && (
                        <a
                          href={attachment.data_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {decodeURI(fileName(attachment))}
                        </a>
                      )}
                      {attachment.file_type === 'video' && (
                        <video src="url" muted playsInline />
                      )}
                      {imageClicked && (
                        <>
                          <Modal
                            isOpen={imageClicked}
                            toggle={toggle}
                            size="xl"
                          >
                            <ModalHeader toggle={toggle} />
                            <ModalBody>
                              <img
                                src={attachment.data_url}
                                alt={attachment.file_type}
                                className="img-fluid"
                              />
                            </ModalBody>
                          </Modal>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
      <div className="clearfix" />
    </>
  );
};

export default InboxMessageCard;
