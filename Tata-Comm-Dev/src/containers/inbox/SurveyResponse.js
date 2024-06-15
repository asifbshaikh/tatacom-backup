import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { Formik } from 'formik';
import IntlMessages from 'helpers/IntlMessages';
import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, Card, CardBody, Form, Label, Row, Spinner } from 'reactstrap';
import { addSurveyResponse, getSurveyResponse } from 'redux/actions';

const SurveyResponse = ({
  addSurveyResponseAction,
  getSurveyResponseAction,
  existingSurveyResp,
  updateLoading,
  showOptionalFb,
  getSurveyLoader,
}) => {
  const [activeFace, setActiveFace] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const { id } = useParams();
  const faces = [
    {
      id: 1,
      faceName: 'face-wtf',
    },
    {
      id: 2,
      faceName: 'face-disappointed',
    },
    {
      id: 3,
      faceName: 'face-sad',
    },
    {
      id: 4,
      faceName: 'face-happy',
    },
    {
      id: 5,
      faceName: 'face-love',
    },
  ];

  const sentToServer = (emojiVal, textVal) => {
    const payload = {
      id: id,
      newParams: {
        message: {
          submitted_values: {
            csat_survey_response: {
              rating: emojiVal,
              feedback_message: textVal,
            },
          },
        },
      },
    };
    addSurveyResponseAction(payload);
  };

  const handleRateInputChange = (e) => {
    setActiveFace(e.target.value);
    sentToServer(e.target.value, '');
  };

  const handleSubmitBtn = () => {
    sentToServer(activeFace, feedbackText);
  };

  useEffect(() => {
    getSurveyResponseAction({ id: id });
  }, []);

  useEffect(() => {
    if (Object.keys(existingSurveyResp).length > 0) {
      setActiveFace(existingSurveyResp?.csat_survey_response?.rating);
      setFeedbackText(
        existingSurveyResp?.csat_survey_response?.feedback_message
      );
    }
  }, [existingSurveyResp]);

  return (
    <>
      {getSurveyLoader ? (
        <div className="loading" />
      ) : (
        <div className="survey-parent">
          <Colxx xxs="6" md="6">
            <Card className="m-0">
              <CardBody className="p-3">
                <Row>
                  <Colxx xxs="6" md="12">
                    {!activeFace && (
                      <div className="m-4">
                        <p className="note-style">
                          <IntlMessages id="CONVERSATION.SUVERY_MSG" />
                        </p>
                      </div>
                    )}
                    <div className="d-flex flex-row mt-2">
                      <div className="feedback-wrapper">
                        <div className="feedback-content">
                          {!activeFace ? (
                            <p className="mb-0 ml-4 note-style bold-text">
                              <IntlMessages id="CONVERSATION.RATE_CONVERSATION" />
                            </p>
                          ) : (
                            <div className="ml-4 mt-2">
                              <p className="note-style mb-0">
                                <IntlMessages id="CONVERSATION.RATING_SUBMITTED" />
                              </p>
                            </div>
                          )}
                          <div className="feedback-faces d-flex">
                            {faces.map((item) => {
                              return (
                                <div
                                  className="face-wrapper"
                                  key={item.faceName}
                                >
                                  <div className="face-counter invisible"></div>
                                  <input
                                    className="rate-input hidden"
                                    id={`rate-${item.id}`}
                                    type="radio"
                                    name="rating"
                                    value={item.id}
                                    data-testid="rateInput"
                                    onClick={handleRateInputChange}
                                  />
                                  <Label
                                    className={`face ${
                                      activeFace != item.id ? 'grayscale' : ''
                                    } ${item.faceName} ${
                                      activeFace ? 'disabled' : ''
                                    }`}
                                    htmlFor={`rate-${item.id}`}
                                    data-hint="Oh God! Why?!"
                                  >
                                    <div className="eyes-wrapper">
                                      <div className="eye">
                                        <div className="pupil">
                                          <div className="eyelid"></div>
                                        </div>
                                      </div>
                                      <div className="eye">
                                        <div className="pupil">
                                          <div className="eyelid"></div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="mouth-wrapper">
                                      <div className="mouth"></div>
                                    </div>
                                  </Label>
                                </div>
                              );
                            })}
                            <div
                              className="faces-hint text-center text-gray"
                              data-default-hint=""
                            ></div>
                          </div>

                          {activeFace && showOptionalFb && (
                            <div className="ml-4 mr-4">
                              <p className="note-style">
                                <IntlMessages id="CONVERSATION.FEEDBACK_TEXT_NOTE" />
                              </p>
                              <Formik>
                                {() => (
                                  <Form>
                                    <FormGroupCoustom
                                      noLable
                                      type="textarea"
                                      identifierLabel="CONVERSATION.YOUR_FEEDBACK"
                                      placeholder="CONVERSATION.YOUR_FEEDBACK"
                                      value={feedbackText}
                                      onChange={(event) =>
                                        setFeedbackText(event.target.value)
                                      }
                                      dataTestId="feedbackTextArea"
                                    />
                                    <div className="d-flex justify-content-end">
                                      <Button
                                        color="primary"
                                        data-testid="submitBtn"
                                        onClick={handleSubmitBtn}
                                        disabled={feedbackText ? false : true}
                                      >
                                        {updateLoading && (
                                          <Spinner
                                            size="sm"
                                            className="mr-2"
                                          ></Spinner>
                                        )}
                                        <IntlMessages id="CONVERSATION.SUBMIT_FEEDBACK" />
                                      </Button>
                                    </div>
                                  </Form>
                                )}
                              </Formik>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Colxx>
                </Row>
              </CardBody>
            </Card>
          </Colxx>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ inboxApp }) => {
  const {
    surveyResponse,
    existingSurveyResponse,
    updateFeedbackLoading,
    showOptionalFeedback,
    getSurveyLoading,
  } = inboxApp;

  return {
    surveyResp: surveyResponse,
    existingSurveyResp: existingSurveyResponse,
    updateLoading: updateFeedbackLoading,
    showOptionalFb: showOptionalFeedback,
    getSurveyLoader: getSurveyLoading,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    addSurveyResponseAction: addSurveyResponse,
    getSurveyResponseAction: getSurveyResponse,
  })(SurveyResponse)
);
