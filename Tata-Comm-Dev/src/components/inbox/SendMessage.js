/* eslint-disable no-use-before-define */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Nav,
  NavItem,
  TabPane,
  TabContent,
  Input,
  InputGroup,
  InputGroupText,
  Alert,
  CustomInput,
  FormGroup,
} from 'reactstrap';
import { NotificationManager } from 'components/common/react-notifications';
import IconChannel from 'components/common/IconChannel';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import { getUuid } from 'helpers/TringReactHelper';
import IntlMessages from 'helpers/IntlMessages';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { sendMessage, sendMessageClean } from 'redux/actions';
import CannedResponse from './CannedResponse';
import RichTextEditor from 'react-rte';
import AttachmentPreview from './AttachmentPreview';
import AudioRecorder from './AudioRecorder';
import ConversationEnums from 'enums/conversations/conversationEnums';
import EmojiPicker from 'emoji-picker-react';
import { Separator } from 'components/common/CustomBootstrap';
import { injectIntl } from 'react-intl';
import { adminRoot } from 'constants/defaultValues';
import HTMLReactParser from 'html-react-parser';
import { updateTypingStatus } from 'redux/inbox/actions';
import TypingImg from 'assets/img/typing.gif';
import { getTypingUsersText } from 'helpers/Utils';

const inReplyTo = false;
const directUploadsEnabled = false;

const SendMessage = ({
  selectedConversationId,
  formSuccess,
  formError,
  formLoading,
  sendMessageAction,
  sendMessageCleanAction,
  showModal,
  setShowModal,
  setActiveMsgTab,
  textValue,
  setTextValue,
  setHtmlText,
  activeFirstTab,
  setActiveFirstTab,
  selectedConversation,
  ccEmails,
  bccEmails,
  setBccEmails,
  setccEmails,
  setccErrMsg,
  setBccErrMsg,
  showBccBtn,
  ccErrMsg,
  setShowBccBtn,
  bccErrMsg,
  intl,
  updateChatSectionHeight,
  currentUser,
  updateTypingStatusAction,
  typinyUsersList,
  agents,
}) => {
  const [messageInput, setMessageInput] = useState('');
  const [mentionSearchKey, setMentionSearchKey] = useState(null);
  const [showMentions, setShowMentions] = useState(null);
  const [showMentionPopup, setShowMentionPopup] = useState(false);
  const [mentionInputs, setMentionInputs] = useState([]);
  const [hasSlashCommand, setHasSlashCommand] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showAudioRecorderEditor, setShowAudioRecorderEditor] = useState(false);
  const [btnIcons, setBtnIcons] = useState([]);
  const [blob, setBlob] = useState(null);
  const isOnPrivateNote = false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+(?:,[^\s@]+@[^\s@]+\.[^\s@]+)*$/;
  const { messages } = intl;
  const refVideo = useRef(null);

  const [enterSendChecked, setEnterSendChecked] = useState(false);
  const [isRichTextEditorVisible, setIsRichTextEditorVisible] = useState(false);
  const [textQuillStandart, setTextQuillStandart] = useState(
    RichTextEditor?.createValueFromString(textValue, 'html')
  );
  const [typingState, setTypingState] = useState(
    ConversationEnums.TYPING_STATUS.OFF
  );
  const isSignatureEnabledStored = localStorage.getItem('isSignatureEnable');
  const [isSignatureEnable, setIsSignatureEnable] = useState(
    isSignatureEnabledStored !== null
      ? JSON.parse(isSignatureEnabledStored)
      : true
  );
  const [agentsList, setAgentsList] = useState(agents);
  const [currentAgentFromList, setCurrentAgentFromList] = useState(0);
  const [valueToReplace, setValueToReplace] = useState('');
  const idleTimer = useRef(null);
  const resetTimer = () => {
    setTypingState(ConversationEnums.TYPING_STATUS.OFF);
    idleTimer.current = null;
  };
  const turnOffIdleTimer = () => {
    if (idleTimer?.current) {
      clearTimeout(idleTimer.current);
    }
  };
  const startTimer = () => {
    setTypingState(ConversationEnums.TYPING_STATUS.TYPING_ON);
    if (idleTimer?.current) {
      turnOffIdleTimer();
    }
    idleTimer.current = setTimeout(
      () => resetTimer(),
      ConversationEnums.TYPING_STATUS.TIMER
    );
  };
  useEffect(() => {
    switch (selectedConversation?.meta?.channel) {
      case ConversationEnums.SMS_CHANNEL:
        activeFirstTab === ConversationEnums.PRIVATE
          ? setBtnIcons([
              ConversationEnums.BUTTON.SHOW_EMOJI_SELECTOR,
              ConversationEnums.BUTTON.ATTACH_FILES,
            ])
          : setBtnIcons([ConversationEnums.BUTTON.SHOW_EMOJI_SELECTOR]);
        break;
      case ConversationEnums.EMAIL_CHANNEL:
        activeFirstTab === ConversationEnums.PRIVATE
          ? setBtnIcons([
              ConversationEnums.BUTTON.SIGNATURE,
              ConversationEnums.BUTTON.SHOW_EMOJI_SELECTOR,
              ConversationEnums.BUTTON.ATTACH_FILES,
            ])
          : setBtnIcons([
              ConversationEnums.BUTTON.RECORD_AUDIO,
              ConversationEnums.BUTTON.SHOW_EMOJI_SELECTOR,
              ConversationEnums.BUTTON.ATTACH_FILES,
              ConversationEnums.BUTTON.SHOW_TEXT_EDITOR,
              ConversationEnums.BUTTON.SIGNATURE,
            ]);
        break;
      case ConversationEnums.WHATSAPP_CHANNEL:
        activeFirstTab === ConversationEnums.PRIVATE
          ? setBtnIcons([
              ConversationEnums.BUTTON.SHOW_EMOJI_SELECTOR,
              ConversationEnums.BUTTON.ATTACH_FILES,
            ])
          : setBtnIcons([
              ConversationEnums.BUTTON.SHOW_EMOJI_SELECTOR,
              ConversationEnums.BUTTON.ATTACH_FILES,
              ConversationEnums.BUTTON.RECORD_AUDIO,
            ]);
        break;
      default:
        break;
    }
    if (activeFirstTab === ConversationEnums.PRIVATE) {
      setAttachedFiles(
        attachedFiles.filter((file) => file.resource.type !== 'audio/wav')
      );
      setShowAudioRecorderEditor(false);
    }
  }, [selectedConversation, activeFirstTab]);
  useEffect(() => {
    if (typingState && selectedConversationId) {
      updateTypingStatusAction({
        typing_status:
          typingState === ConversationEnums.TYPING_STATUS.TYPING_ON
            ? ConversationEnums.TYPING_STATUS.ON
            : ConversationEnums.TYPING_STATUS.OFF,
        is_private: activeFirstTab === ConversationEnums.PRIVATE,
        conversationId: selectedConversationId,
      });
    }
  }, [typingState]);

  useEffect(() => {
    return () => {
      turnOffIdleTimer();
    };
  }, []);

  const toolbarConfig = {
    display: [
      'INLINE_STYLE_BUTTONS',
      'BLOCK_TYPE_BUTTONS',
      'LINK_BUTTONS',
      'HISTORY_BUTTONS',
    ],
    INLINE_STYLE_BUTTONS: [
      { label: 'Bold', style: 'BOLD', className: 'text-editor__button' },
      { label: 'Italic', style: 'ITALIC', className: 'text-editor__button' },
      { label: 'Code', style: 'CODE', className: 'text-editor__button' },
    ],
    BLOCK_TYPE_DROPDOWN: [
      {
        label: 'Normal',
        style: 'unstyled',
        className: 'text-editor__button',
      },
      {
        label: 'Heading Large',
        style: 'header-one',
        className: 'text-editor__button',
      },
      {
        label: 'Heading Medium',
        style: 'header-two',
        className: 'text-editor__button',
      },
      {
        label: 'Heading Small',
        style: 'header-three',
        className: 'text-editor__button',
      },
    ],
    BLOCK_TYPE_BUTTONS: [
      {
        label: 'UL',
        style: 'unordered-list-item',
        className: 'text-editor__button',
      },
      {
        label: 'OL',
        style: 'ordered-list-item',
        className: 'text-editor__button',
      },
    ],
    LINK_BUTTONS: [
      {
        label: 'Link',
        style: 'LINK',
        className: 'text-editor__button',
        target: '_blank',
      },
    ],
  };
  const inputFile = useRef(null);
  const navLinkRef = useRef();
  const emojiPickerRef = useRef();
  const [showEmoji, setShowEmoji] = useState(false);
  const toggleAudioRecorder = () => {
    setShowAudioRecorderEditor(!showAudioRecorderEditor);
  };

  const validateEmails = (value, type) => {
    let err = emailRegex.test(value) ? '' : ConversationEnums.VALID_EMAIL;
    type === ConversationEnums.CC && setccErrMsg(err);
    type === ConversationEnums.BCC && setBccErrMsg(err);
  };

  const showRichContentEditor = activeFirstTab === ConversationEnums.PRIVATE;
  const messageChange = (updatedMessage) => {
    if (!updatedMessage) {
      if (showMentions) {
        setShowMentions(!showMentions);
      }
      return false;
    }
    const hasSlashCommandTemp =
      updatedMessage[0] === '/' && !showRichContentEditor;
    const hasNextWord = updatedMessage.includes(' ');
    const isShortCodeActive = hasSlashCommandTemp && !hasNextWord;
    setHasSlashCommand(hasSlashCommandTemp);
    if (isShortCodeActive) {
      setMentionSearchKey(updatedMessage.substr(1, updatedMessage.length));
      setShowMentions(true);
    } else {
      setMentionSearchKey('');
      setShowMentions(false);
    }
    return false;
  };

  const handleChatInputChange = (e) => {
    if (e.target.value !== messageInput) {
      setMessageInput(e.target.value);
      setTextValue(e.target.value);
      setHtmlText(e.target.value);
      messageChange(e.target.value);
    }
  };
  const clearMessage = () => {
    if (messageInput) {
      setMessageInput('');
      setTextValue('');
      setHtmlText('');
      setTextQuillStandart(RichTextEditor.createValueFromString('', 'html'));
    }
    if (attachedFiles.length) {
      setAttachedFiles([]);
    }
    if (showAudioRecorderEditor) {
      toggleAudioRecorder();
    }
  };

  const getMessagePayload = (message) => {
    const messagePayload = {
      conversationId: selectedConversationId,
      message,
      isPrivate: activeFirstTab === ConversationEnums.PRIVATE,
      echoId: getUuid(),
    };

    if (inReplyTo) {
      messagePayload.contentAttributes = { in_reply_to: inReplyTo };
    }

    if (attachedFiles && attachedFiles.length) {
      messagePayload.files = [];
      attachedFiles.forEach((attachment) => {
        if (directUploadsEnabled) {
          messagePayload.files.push(attachment.blobSignedId);
        } else {
          messagePayload.files.push(
            attachment.resource.file
              ? attachment.resource.file
              : attachment.resource
          );
        }
      });
    }

    if (ccEmails && !isOnPrivateNote) {
      messagePayload.ccEmails = ccEmails;
    }

    if (bccEmails && !isOnPrivateNote) {
      messagePayload.bccEmails = bccEmails;
    }

    return messagePayload;
  };

  const sendMessageBtn = () => {
    if (formLoading) {
      return false;
    }
    let newMessage =
      activeFirstTab === ConversationEnums.REPLY
        ? isRichTextEditorVisible
          ? textQuillStandart.toString('html')
          : messageInput
        : textQuillStandart.toString('html');
    agents.map((ag) => {
      let temp = newMessage;
      const regex = new RegExp('@' + ag.name.trim(), 'g');
      newMessage = temp.replace(
        regex,
        `[@${ag.name}](mention://user/${ag.id}/${ag.name.replace(/ /g, '%20')})`
      );
    });

    if (
      isSignatureEnable &&
      activeFirstTab === ConversationEnums.REPLY &&
      currentUser.message_signature
    ) {
      newMessage += `<br>${currentUser.message_signature}`;
    }
    const messagePayload = getMessagePayload(newMessage);
    sendMessageAction(messagePayload);
    sendMessageCleanAction({});
    return false;
  };
  useEffect(() => {
    if (formSuccess) {
      sendMessageCleanAction({ successSendMessage: false });
      clearMessage();
      setShowModal(false);
    }
  }, [formSuccess]);

  useEffect(() => {
    if (formError && formError.errorMsg) {
      NotificationManager.error(
        formError.errorMsg,
        'Error',
        6000,
        null,
        null,
        ''
      );
      sendMessageCleanAction({});
      clearMessage();
    }
  }, [formError]);

  const handleChatInputPress = (e) => {
    if (e.key === ConversationEnums.ENTER && !e.shiftKey) {
      if (messageInput.length > 0) {
        sendMessageBtn();
        clearMessage();
      }
    }
  };
  const handleSendButtonClick = () => {
    if (messageInput.length > 0 || attachedFiles.length > 0) {
      sendMessageBtn();
      clearMessage();
      setBccEmails('');
      setccEmails('');
    }
  };
  const replaceText = (message) => {
    setTimeout(() => {
      setMessageInput(message);
    }, 100);
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const removeAttachment = (itemIndex) => {
    setAttachedFiles(
      attachedFiles.filter((item, index) => itemIndex !== index)
    );
    setBlob(null);
  };
  const uploadFile = (event) => {
    onFileUpload(event.target.files[0]);
  };

  const onFileUpload = (file) => {
    onIndirectFileUpload(file);
  };
  const onIndirectFileUpload = (file) => {
    if (!file) {
      return;
    }
    attachFile({ file });
  };
  const attachFile = ({ blob, file }) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.file ? file.file : file);
    reader.onloadend = () => {
      const newAttachment = {
        currentChatId: selectedConversationId,
        resource: blob || file,
        isPrivate: activeFirstTab === ConversationEnums.PRIVATE,
        thumb: reader.result,
        blobSignedId: blob ? blob.signed_id : undefined,
        size: blob?.size || file?.size,
        name: blob?.name || file?.name,
      };
      setAttachedFiles([...attachedFiles, newAttachment]);
    };
  };
  const onRecorderBlob = (file) => {
    if (file) {
      onFileUpload(file);
    }
  };

  const handleShowEmojiPicker = () => {
    setShowEmoji(!showEmoji);
  };

  useEffect(() => {
    setMessageInput(textValue.replace(/<[^>]*>/g, ''));
    if (textQuillStandart?.toString('html') !== textValue) {
      setTextQuillStandart(
        RichTextEditor?.createValueFromString(
          textValue.replace(/<[^>]*>/g, ''),
          'html'
        )
      );
    }
  }, [textValue]);

  useEffect(() => {
    if (updateChatSectionHeight) {
      updateChatSectionHeight();
    }
  });
  const handleEmoji = (e) => {
    setTextValue((textValue) => textValue + e.emoji);
    messageChange(e.emoji);
  };

  const handlePrivateNote = (val) => {
    setTextQuillStandart(val);
    const htmlString = val.toString('html');
    setTextValue(htmlString);
    const contentState = val?.getEditorState().getCurrentContent();
    const blocks = contentState.getBlocksAsArray();
    const lastBlock = blocks[blocks.length - 1];
    const lastBlockText = lastBlock.getText();
    const lastIndex = lastBlockText.lastIndexOf('@');
    const splitSearchText = lastBlockText.substring(lastIndex + 1).split(' ');
    setValueToReplace(splitSearchText[0]);
    const listToShow = agents.filter((item) => {
      return item.name.toUpperCase().includes(splitSearchText[0].toUpperCase());
    });
    setAgentsList(listToShow);
    const mentions = lastBlockText.match(/@[^\s@]*/g) || [];
    if (mentions.length > 0) {
      const lastMention = mentions[mentions.length - 1];
      if (lastMention === '@') {
        setShowMentionPopup(true);
      }
      const mentionInput = lastMention.substring(1);
      setMentionInputs([...new Set([...mentionInputs, mentionInput])]);
    } else {
      setShowMentionPopup(false);
      setMentionInputs([]);
    }
    setCurrentAgentFromList(0);
  };
  const sanitizeAndConvertToReact = (text) => {
    const sanitizedReactElement = HTMLReactParser(text);
    return sanitizedReactElement;
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (
        navLinkRef.current &&
        !navLinkRef.current.contains(event.target) &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        hideEmojiPicker();
      }
    };
    document.body.addEventListener('click', handleDocumentClick);
    return () => {
      document.body.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (showMentionPopup) {
        const agentListLength = agentsList.length;
        if (e.key.toLowerCase() === ConversationEnums.ARROW_DOWN) {
          e.preventDefault();
          const nextIndex = (currentAgentFromList + 1) % agentListLength;
          setCurrentAgentFromList(nextIndex);
          const nextAgentElement = document.querySelector(
            `.agent-list-wrapper div:nth-child(${nextIndex + 1})`
          );
          if (nextAgentElement) {
            nextAgentElement.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            });
          }
        } else if (e.key.toLowerCase() === ConversationEnums.ARROW_UP) {
          e.preventDefault();
          const prevIndex =
            (currentAgentFromList - 1 + agentListLength) % agentListLength;
          setCurrentAgentFromList(prevIndex);
          const prevAgentElement = document.querySelector(
            `.agent-list-wrapper div:nth-child(${prevIndex + 1})`
          );
          if (prevAgentElement) {
            prevAgentElement.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            });
          }
        }
      }
    },
    [showMentionPopup, agentsList, currentAgentFromList]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const hideEmojiPicker = () => {
    setShowEmoji(false);
  };

  const isAnyoneTpying = () => {
    return (
      Object.keys(typinyUsersList).length > 0 &&
      typinyUsersList[selectedConversationId]?.length !== 0
    );
  };

  const typingUserNames = () => {
    if (isAnyoneTpying()) {
      const userListAsName = getTypingUsersText(
        typinyUsersList[selectedConversationId]
      );
      return userListAsName;
    }
    return '';
  };

  const placeholderForRichTextEditor =
    activeFirstTab === ConversationEnums.REPLY
      ? isRichTextEditorVisible
        ? 'CONVERSATION.FOOTER.MSG_INPUT'
        : null
      : activeFirstTab === ConversationEnums.PRIVATE
      ? 'CONVERSATION.FOOTER.PRIVATE_MSG_INPUT'
      : null;

  const updateRTEditor = (item) => {
    const updatedText = textValue.replace(`@${valueToReplace}<`, `@${item}<`);
    setTextValue(updatedText);
    setTextQuillStandart(
      RichTextEditor.createValueFromString(updatedText, 'html')
    );
    setShowMentionPopup(false);
    const editorContentElement = document.querySelector(
      '.DraftEditor-root .DraftEditor-editorContainer'
    );
    if (editorContentElement) {
      const range = document.createRange();
      range.selectNodeContents(editorContentElement);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };
  const handleKeyPress = useCallback(() => {
    startTimer();
  }, [typingState]);

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
  }, [handleKeyPress, typingState]);

  return (
    <div className="position-relative">
      {/* uncomment below while implementing showing user name who is typing */}
      {isAnyoneTpying() && (
        <div className="typing-wrapper">
          <span className="typing-message-box">
            <span>{typingUserNames()} </span>
            <img src={TypingImg} alt="..." />
          </span>
        </div>
      )}
      {showEmoji && (
        <div className="emoji-picker" ref={emojiPickerRef}>
          <EmojiPicker
            height={370}
            width={320}
            onEmojiClick={(e) => handleEmoji(e)}
          />
        </div>
      )}
      <div
        className={`p-1 border color-light ${!showModal && 'reply-section'}`}
      >
        <input
          type="file"
          onChange={uploadFile}
          ref={inputFile}
          style={{ display: 'none' }}
        />
        {showMentions && (
          <CannedResponse
            showMentions={showMentions}
            setShowMentions={setShowMentions}
            mentionSearchKey={mentionSearchKey}
            replaceText={replaceText}
          />
        )}
        <div className="chat-input-container1 pl-3 mb-1 d-flex justify-content-between align-items-center">
          <Nav tabs className="card-header-tabs mb-0">
            <NavItem>
              <NavLink
                to="#"
                location={{}}
                className={`${classnames({
                  active: activeFirstTab === ConversationEnums.REPLY,
                  'nav-link pt-1 pb-0': true,
                })} `}
                onClick={() => {
                  setActiveMsgTab(ConversationEnums.REPLY);
                  setActiveFirstTab(ConversationEnums.REPLY);
                }}
              >
                {ConversationEnums.REPLY_BUTTON}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="#"
                location={{}}
                className={classnames({
                  active: activeFirstTab === ConversationEnums.PRIVATE,
                  'nav-link pt-1 pb-0': true,
                })}
                onClick={() => {
                  setActiveMsgTab(ConversationEnums.PRIVATE);
                  setActiveFirstTab(ConversationEnums.PRIVATE);
                }}
              >
                {ConversationEnums.PRIVATE_NOTE}
              </NavLink>
            </NavItem>
          </Nav>
          <div>
            {showModal ? (
              <div
                role="presentation"
                className="p-0 mr-2"
                title="Show Full Screen"
                onClick={() => {
                  setShowModal(!showModal);
                }}
              >
                <i className="simple-icon-size-actual" />
              </div>
            ) : (
              <div
                role="presentation"
                className="p-0 mr-2"
                title="Show Full Screen"
                onClick={() => {
                  setShowModal(!showModal);
                }}
              >
                <i className="simple-icon-size-fullscreen" />
              </div>
            )}
          </div>
        </div>
        <div className="chat-input-container1 px-2 d-flex justify-content-between align-items-center">
          <TabContent activeTab={activeFirstTab} className="w-100">
            <TabPane tabId={ConversationEnums.REPLY}>
              {selectedConversation?.meta?.channel ===
                ConversationEnums.EMAIL_CHANNEL && (
                <>
                  <InputGroup>
                    <InputGroupText className="border-0">
                      <IntlMessages id={'CONVERSATION.FOOTER.CC'} />
                    </InputGroupText>
                    <Input
                      type="text"
                      id="cc"
                      placeholder={messages['inbox.email_placeholder']}
                      value={ccEmails}
                      onChange={(e) => {
                        setccEmails(e.target.value);
                        validateEmails(e.target.value, 'CC');
                      }}
                      className={'border-0'}
                    />
                    {!showBccBtn && (
                      <span
                        className="create-event"
                        role="button"
                        onClick={() => {
                          setShowBccBtn(true);
                        }}
                        tabIndex="0"
                      >
                        <IntlMessages id={'CONVERSATION.FOOTER.ADD_BCC'} />
                      </span>
                    )}
                  </InputGroup>
                  <Separator />
                  <span className="error-text">
                    {ccEmails.length && ccErrMsg?.length ? ccErrMsg : null}
                  </span>
                  {showBccBtn && (
                    <>
                      <InputGroup>
                        <InputGroupText className="border-0">
                          <IntlMessages id={'CONVERSATION.FOOTER.BCC'} />
                        </InputGroupText>
                        <Input
                          type="text"
                          id="bcc"
                          placeholder={messages['inbox.email_placeholder']}
                          value={bccEmails}
                          onChange={(e) => {
                            setBccEmails(e.target.value);
                            validateEmails(e.target.value, 'BCC');
                          }}
                          className={'border-0'}
                        />
                      </InputGroup>
                      <Separator />
                      <span className="error-text">
                        {bccEmails.length && bccErrMsg?.length
                          ? bccErrMsg
                          : null}
                      </span>
                    </>
                  )}
                </>
              )}
              {!isRichTextEditorVisible ? (
                <FormGroupCoustom
                  identifier={ConversationEnums.REPLY}
                  noLable
                  fieldWithoutGroup
                  className="form-control flex-grow-1 send-message-textarea"
                  type="textarea"
                  placeholder={'CONVERSATION.FOOTER.MSG_INPUT'}
                  value={messageInput}
                  onKeyPress={(e) => handleChatInputPress(e)}
                  onKeyUp={() => {
                    startTimer();
                  }}
                  onBlur={() => {
                    resetTimer();
                  }}
                  onChange={(e) => handleChatInputChange(e)}
                />
              ) : null}
              <div className="d-none">
                <Button
                  outline
                  color="primary"
                  className="icon-button large ml-1"
                >
                  <IconChannel
                    channelType="resize-large-outline"
                    width="25"
                    height="35"
                  />
                </Button>

                <Button
                  color="primary"
                  className="icon-button large ml-1"
                  onClick={() => handleSendButtonClick()}
                >
                  <i className="simple-icon-arrow-right" />
                </Button>
              </div>
            </TabPane>
            {showMentionPopup && agentsList.length ? (
              <div className="agents-list-modal">
                <div className="agent-list-wrapper">
                  {agentsList?.map((item, index) => (
                    <div
                      role="presentation"
                      key={index}
                      onClick={() => updateRTEditor(item.name)}
                      className={`text-truncate ${
                        index == currentAgentFromList
                          ? 'agent-list-background-color'
                          : 'agent-list-default-color'
                      }`}
                    >
                      <span className="font-weight-bold p-2">
                        {item.name} -
                      </span>
                      {item.email}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {activeFirstTab === ConversationEnums.PRIVATE ||
            isRichTextEditorVisible ? (
              <RichTextEditor
                placeholder={<IntlMessages id={placeholderForRichTextEditor} />}
                value={textQuillStandart}
                toolbarConfig={toolbarConfig}
                handleReturn={(e) => {
                  if (
                    showMentionPopup &&
                    e.key.toLowerCase() === ConversationEnums.ENTER_KEY &&
                    e.keyCode === 13
                  ) {
                    updateRTEditor(agentsList[currentAgentFromList]?.name);
                    return true;
                  }
                  if (enterSendChecked && e.shiftKey === false) {
                    handleSendButtonClick();
                    return true;
                  }
                  return false;
                }}
                onChange={(val) => {
                  handlePrivateNote(val);
                }}
                className="height send-message-editor"
                onBlur={() => resetTimer()}
              />
            ) : null}
            <TabPane tabId={ConversationEnums.PRIVATE}>
              <div className="d-none">
                <Button
                  outline
                  color="primary"
                  className="icon-button large ml-1"
                >
                  <IconChannel
                    channelType="resize-large-outline"
                    width="25"
                    height="35"
                  />
                </Button>

                <Button
                  color="primary"
                  className="icon-button large ml-1"
                  onClick={() => handleSendButtonClick()}
                >
                  <i className="simple-icon-arrow-right" />
                </Button>
              </div>
            </TabPane>
          </TabContent>
        </div>
        {attachedFiles && attachedFiles.length > 0 && (
          <AttachmentPreview
            attachments={attachedFiles}
            removeAttachment={removeAttachment}
          />
        )}

        <div className="chat-input-container1 pt-1 px-2 ">
          {isSignatureEnable && activeFirstTab === ConversationEnums.REPLY && (
            <div className="hover-background" title="Message Signature">
              {!currentUser?.message_signature ||
              currentUser?.message_signature === '' ? (
                <>
                  <Alert className="message-signature-alert">
                    <div>
                      <IntlMessages id="CONVERSATION.MESSAGE_SIGNATURE" />
                      <a
                        href={`${adminRoot}/profile/settings`}
                        className="signature-update"
                      >
                        <IntlMessages id="CONVERSATION.SIGNATURE_UPDATE" />
                      </a>
                    </div>
                  </Alert>
                </>
              ) : (
                <Alert className="message-signature-alert">
                  {sanitizeAndConvertToReact(currentUser.message_signature)}
                </Alert>
              )}
            </div>
          )}
        </div>
        <div>
          {showAudioRecorderEditor && blob && (
            <audio
              src={URL.createObjectURL(blob)}
              controls
              autoPlay={false}
              loop={false}
              ref={refVideo}
            />
          )}
        </div>
        <div className="chat-input-container1 d-flex justify-content-between align-items-center  p-1">
          <div className="d-flex align-items-center chat-controls-btns">
            {btnIcons.includes(
              ConversationEnums.BUTTON.SHOW_EMOJI_SELECTOR
            ) && (
              <NavLink
                className="emoji-button pl-1 mr-1 de-icon-btn-secondary"
                to="#"
                title={messages['CONVERSATION.SHOW_EMOJI_SELECTOR']}
                ref={navLinkRef}
                onClick={() => {
                  handleShowEmojiPicker();
                }}
              >
                <IconChannel
                  channelType="emoji-outline"
                  width="18"
                  height="18"
                />
              </NavLink>
            )}
            {btnIcons.includes(ConversationEnums.BUTTON.ATTACH_FILES) && (
              <NavLink
                className="pl-1 mr-1 de-icon-btn-secondary"
                to="#"
                title={messages['CONVERSATION.ATTACH_FILES']}
                onClick={() => {
                  onButtonClick();
                }}
              >
                <IconChannel
                  channelType="attach-outline"
                  width="18"
                  height="18"
                />
              </NavLink>
            )}

            <>
              {btnIcons.includes(ConversationEnums.BUTTON.SHOW_TEXT_EDITOR) && (
                <NavLink
                  className="pl-1 mr-1 pb-1 de-icon-btn-secondary"
                  to="#"
                  title={messages['CONVERSATION.SHOW_TEXT_EDITOR']}
                  onClick={() => {
                    setIsRichTextEditorVisible(!isRichTextEditorVisible);
                  }}
                >
                  <IconChannel
                    channelType="quote-outline"
                    width="18"
                    height="18"
                  />
                </NavLink>
              )}

              {btnIcons.includes(ConversationEnums.BUTTON.RECORD_AUDIO) && (
                <NavLink
                  className="pl-1 pb-1 mr-1 de-icon-btn-secondary"
                  to="#"
                  title={messages['CONVERSATION.RECORD_AUDIO']}
                  onClick={toggleAudioRecorder}
                >
                  <IconChannel
                    channelType="microphone-outline"
                    width="18"
                    height="18"
                  />
                </NavLink>
              )}
              {btnIcons.includes(ConversationEnums.BUTTON.SIGNATURE) && (
                <NavLink
                  className="pl-1 mr-1 de-icon-btn-secondary"
                  to="#"
                  title={
                    isSignatureEnable
                      ? messages['CONVERSATION.DISABLED_SIGNATURE']
                      : messages['CONVERSATION.ENABLED_SIGNATURE']
                  }
                  onClick={() => {
                    const updatedPreference = !isSignatureEnable;
                    setIsSignatureEnable(!isSignatureEnable);
                    localStorage.setItem(
                      'isSignatureEnable',
                      JSON.stringify(updatedPreference)
                    );
                  }}
                >
                  <IconChannel
                    channelType="signature-outline"
                    width="18"
                    height="18"
                  />
                </NavLink>
              )}
              {showAudioRecorderEditor && (
                <AudioRecorder
                  onRecorderBlob={onRecorderBlob}
                  toggleAudioRecorder={toggleAudioRecorder}
                  showAudioRecorderEditor={showAudioRecorderEditor}
                  setBlob={setBlob}
                />
              )}
            </>
          </div>
          <div className="d-flex align-items-center mr-4">
            {isRichTextEditorVisible ||
            activeFirstTab === ConversationEnums.PRIVATE ? (
              <FormGroup className="mx-2 mb-0">
                <CustomInput
                  type="checkbox"
                  id="enterToSend"
                  checked={enterSendChecked}
                  onChange={(e) => {
                    setEnterSendChecked(e.target.checked);
                  }}
                  label={
                    <IntlMessages id="CONVERSATION.FOOTER.ENTER_TO_SEND" />
                  }
                />
              </FormGroup>
            ) : null}
            {activeFirstTab === ConversationEnums.REPLY ? (
              <Button
                color="primary"
                size="sm"
                onClick={() => handleSendButtonClick()}
                disabled={attachedFiles.length == 0 && !messageInput}
              >
                <IntlMessages id="CONVERSATION.REPLYBOX.SEND" />
              </Button>
            ) : (
              <Button
                color="primary"
                size="sm"
                onClick={() => handleSendButtonClick()}
                disabled={
                  textValue.replace(/<[^>]*>/g, '') === '' &&
                  attachedFiles.length == 0
                }
              >
                {<IntlMessages id={'CONVERSATION.FOOTER.ADD_NOTE'} />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = ({ inboxApp, authUser, agentsApp }) => {
  const {
    successSendMessage,
    errorSendMessage,
    loadingSendMessage,
    typingUsersRecords,
  } = inboxApp;
  const { currentUser } = authUser;
  const { agents } = agentsApp;
  return {
    formSuccess: successSendMessage,
    formError: errorSendMessage,
    formLoading: loadingSendMessage,
    currentUser,
    typinyUsersList: typingUsersRecords,
    agents,
  };
};
export default connect(mapStateToProps, {
  sendMessageAction: sendMessage,
  sendMessageCleanAction: sendMessageClean,
  updateTypingStatusAction: updateTypingStatus,
})(injectIntl(SendMessage));
