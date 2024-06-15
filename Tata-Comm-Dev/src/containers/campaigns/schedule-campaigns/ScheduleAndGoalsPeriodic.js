import React, { useState } from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import { Card, Row } from 'reactstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import '../../../assets/css/sass/views/campaign.scss';
import IntlMessages from 'helpers/IntlMessages';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import S3SFTPImportEnums from 'enums/s3sftp/s3stfpImportEnums';
import {
  getSendCampaignTimeValue,
  getEndsFieldType,
  getOcurrenceType,
  getNumericValues,
  getSendCampaignTimeValueBasedOnEvent,
} from 'helpers/campaignHelper';
import moment from 'moment';
import ScheduleAndGoalsDateAndTime from './ScheduleAndGoalsDateAndTime';
import SendInUserTimeZone from '../SendInUserTimeZone';
// import ScheduleAndGoalsBestTimeForUser from './ScheduleAndGoalsBestTimeForUser'; // commented this as we are not using this feature now
import {
  periodicRadioLists,
  periodicEndsRadioLists,
  periodicMonthlyRadioLists,
  weekDaysList,
} from '../../../data/createCampaignData';

const ScheduleAndGoalsPeriodic = ({
  form,
  campaignType,
  setShowCampaignTimezone,
  moduleName,
}) => {
  const { values } = form;
  const [eventType, setEventType] = useState(
    ScheduleAndGoalsEnums.AT_FIXED_TIME
  );

  if (
    values.periodic.sendCampaignTime ===
      ScheduleAndGoalsEnums.SEND_IN_USER_TIME_ZONE ||
    values.periodic.sendCampaignTime ===
      ScheduleAndGoalsEnums.BEST_TIME_FOR_USER
  ) {
    setShowCampaignTimezone(true);
  } else {
    setShowCampaignTimezone(false);
  }

  const handleOnWeekBadgeClick = (id, value, type) => {
    if (value.length > 0 && value.includes(id)) {
      value.splice(value.indexOf(id), 1);
      form.setFieldValue(`${campaignType}.${type}`, value);
    } else {
      value.push(id);
      form.setFieldValue(`${campaignType}.${type}`, value);
    }
  };
  const setValues = (event) => {
    setEventType(event.target.value);
    form.setFieldValue(`${campaignType}.sendCampaignTime`, event.target.value);
    if (
      getSendCampaignTimeValueBasedOnEvent(event.target.value) ===
      ScheduleAndGoalsEnums.OBJECT_KEY_BEST_TIME_FOR_USER
    ) {
      form.setFieldValue(
        `${campaignType}.${ScheduleAndGoalsEnums.OBJECT_KEY_BEST_TIME_FOR_USER}.sendMessagesBasedOnBestTime`,
        moment().format('LT')
      );
    }
    form.setFieldValue(
      `${campaignType}.${getSendCampaignTimeValueBasedOnEvent(
        event.target.value
      )}.startDate`,
      moment().format('MM/DD/YYYY')
    );
    form.setFieldValue(
      `${campaignType}.${getSendCampaignTimeValueBasedOnEvent(
        event.target.value
      )}.sendTime`,
      moment().format('LT')
    );
    form.setFieldValue(
      `${campaignType}.${getSendCampaignTimeValueBasedOnEvent(
        event.target.value
      )}.on.endDate`,
      moment().format('MM/DD/YYYY')
    );
  };

  return (
    <div className="schedule-periodic">
      {moduleName === S3SFTPImportEnums.MODULE_NAME ? (
        ''
      ) : (
        <Row className="pl-3 pr-3 pt-2">
          <Colxx xxs="12">
            <FormGroupCoustom
              className="periodic-radio-btns-list"
              noLable
              type="radioMulti"
              radioMultiOptions={periodicRadioLists}
              value={values[campaignType].sendCampaignTime}
              identifier={`${campaignType}.sendCampaignTime`}
              onChange={(event) => {
                setValues(event);
              }}
            />
          </Colxx>
        </Row>
      )}

      <ScheduleAndGoalsDateAndTime
        className="mb-3 p-3"
        form={form}
        leftFieldID={`${campaignType}.${getSendCampaignTimeValue(
          form,
          campaignType
        )}.startDate`}
        leftFieldLabel={
          <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.START_DATE" />
        }
        leftFieldPlaceholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.START_DATE"
        rightFieldId={`${campaignType}.${getSendCampaignTimeValue(
          form,
          campaignType
        )}.sendTime`}
        rightFieldLabel={
          moduleName === S3SFTPImportEnums.MODULE_NAME ? (
            <IntlMessages id="S3SFTP.SCHEDULE.LABEL.START_TIME" />
          ) : (
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_TIME" />
          )
        }
        rightFieldPlaceholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_TIME"
      />
      <Row className="p-3">
        <Colxx xxs="12" md="4">
          <div className="d-flex align-items-baseline">
            <FormGroupCoustom
              className="mr-2"
              type="number"
              minNumberValue="0"
              identifierLabel="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.REPEAT_EVERY"
              placeholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.REPEAT_EVERY"
              identifier={`${campaignType}.repeatEvery`}
              required={true}
            />
            {getOcurrenceType(form, campaignType)}
          </div>
        </Colxx>
        {values[campaignType].sendCampaignType ===
          ScheduleAndGoalsEnums.WEEKLY && (
          <Colxx xxs="12" md="6" className="periodic-weekly-badges">
            <p>
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.REPEAT_ON" />
              <span className="required-star-mark">{`*`}</span>
            </p>
            <div className="d-flex day-of-week">
              {weekDaysList.map((day) => {
                const activeList = values[campaignType].daysOfWeek;
                return (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      handleOnWeekBadgeClick(day.id, activeList, 'daysOfWeek')
                    }
                    onKeyDown={() =>
                      handleOnWeekBadgeClick(day.id, activeList, 'daysOfWeek')
                    }
                    key={day.id}
                    className={`smsCampaignAvtar mr-1 
                      ${activeList.includes(day.id) ? 'active' : ''}
                    `}
                    id={day.id}
                  >
                    {day.label}
                  </div>
                );
              })}
            </div>
          </Colxx>
        )}
        {values[campaignType].sendCampaignType ===
          ScheduleAndGoalsEnums.MONTHLY && (
          <Colxx xxs="12" md="6" className="periodic-weekly-badges">
            <Row>
              <Colxx xxs="12">
                <p>
                  <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.REPEAT_ON" />
                  <span className="required-star-mark">{`*`}</span>
                </p>
              </Colxx>
              <Colxx xxs="12">
                <FormGroupCoustom
                  className="periodic-radio-btns-list"
                  noLable
                  type="radioMulti"
                  radioMultiOptions={periodicMonthlyRadioLists}
                  value={values[campaignType].repeatOn}
                  identifier={`${campaignType}.repeatOn`}
                  onChange={(event) =>
                    form.setFieldValue(
                      `${campaignType}.repeatOn`,
                      event.target.value
                    )
                  }
                />
              </Colxx>
              <Colxx xxs="12">
                {values[campaignType].repeatOn ===
                  ScheduleAndGoalsEnums.DAY_OF_MONTH && (
                  <div className="d-flex date-of-months">
                    <p className="mr-2">
                      <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SELECT_DATES" />
                      <span className="required-star-mark">{`*`}</span>
                    </p>
                    <Card className="p-2">
                      {getNumericValues(31, true).map((date) => {
                        const activeList = values[campaignType].daysOfMonth;
                        return (
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                              handleOnWeekBadgeClick(
                                date.value,
                                activeList,
                                'daysOfMonth'
                              )
                            }
                            onKeyDown={() =>
                              handleOnWeekBadgeClick(
                                date.value,
                                activeList,
                                'daysOfMonth'
                              )
                            }
                            key={date.id}
                            className={`smsCampaignAvtarDate mr-1 ${
                              activeList.includes(date.value) ? 'active' : ''
                            }
                            `}
                            id={date.id}
                          >
                            {date.value}
                          </div>
                        );
                      })}
                    </Card>
                  </div>
                )}
              </Colxx>
              <Colxx xxs="12">
                <div className="d-flex day-of-week">
                  {values[campaignType].repeatOn ===
                    ScheduleAndGoalsEnums.DAY_OF_WEEK &&
                    weekDaysList.map((day) => {
                      const activeList = values[campaignType].daysOfWeek;
                      return (
                        <div
                          tabIndex={0}
                          role="button"
                          onClick={() =>
                            handleOnWeekBadgeClick(
                              day.id,
                              activeList,
                              'daysOfWeek'
                            )
                          }
                          onKeyDown={() =>
                            handleOnWeekBadgeClick(
                              day.id,
                              activeList,
                              'daysOfWeek'
                            )
                          }
                          key={day.id}
                          className={`smsCampaignAvtar mr-1 ${
                            activeList.includes(day.id) ? 'active' : ''
                          }`}
                          id={day.id}
                        >
                          {day.label}
                        </div>
                      );
                    })}
                </div>
              </Colxx>
            </Row>
          </Colxx>
        )}
      </Row>
      {form.values[campaignType].sendCampaignTime ===
        ScheduleAndGoalsEnums.SEND_IN_USER_TIME_ZONE && (
        <SendInUserTimeZone form={form} campaignType={campaignType} />
      )}
      {/* commented this as we are not using this feature now */}
      {/* {form.values[campaignType].sendCampaignTime ===
        ScheduleAndGoalsEnums.BEST_TIME_FOR_USER && (
        <>
          <ScheduleAndGoalsDateAndTime
            className="p-3"
            form={form}
            rightFieldId={`${campaignType}.${getSendCampaignTimeValue(
              form,
              campaignType
            )}.sendMessagesBasedOnBestTime`}
            rightFieldLabel={
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_MESSAGE_BASED_ON_BEST_TIME" />
            }
            rightFieldPlaceholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.SEND_MESSAGE_BASED_ON_BEST_TIME"
          />

          <ScheduleAndGoalsBestTimeForUser
            form={form}
            campaignType={campaignType}
          />
        </>
      )} */}
      <Row className="pt-2 pl-3">
        <Colxx xxs="12">
          <h2 className="font-weight-bold">
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.ENDS" />
            <span className="required-star-mark">{`*`}</span>
          </h2>
        </Colxx>
        <Colxx xxs="12">
          <FormGroupCoustom
            noLable
            className="periodic-radio-btns-list"
            type="radioMulti"
            radioMultiOptions={periodicEndsRadioLists}
            value={
              values[campaignType][getSendCampaignTimeValue(form, campaignType)]
                .ends
            }
            identifier={`${campaignType}.${getSendCampaignTimeValue(
              form,
              campaignType
            )}.ends`}
            onChange={(event) => {
              form.setFieldValue(`${campaignType}.ends`, event.target.value);
              form.setFieldValue(
                `${campaignType}.${getSendCampaignTimeValueBasedOnEvent(
                  eventType
                )}.ends`,
                event.target.value
              );
            }}
          />
        </Colxx>
        {form.values[campaignType][getSendCampaignTimeValue(form, campaignType)]
          ?.ends === ScheduleAndGoalsEnums.ON && (
          <Colxx xxs="12">
            {' '}
            <ScheduleAndGoalsDateAndTime
              className="mb-3 pt-3 pb-3"
              form={form}
              leftFieldID={`${campaignType}.${getSendCampaignTimeValue(
                form,
                campaignType
              )}.${getEndsFieldType(form, campaignType)}.endDate`}
              leftFieldLabel={
                <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.END_DATE" />
              }
              leftFieldPlaceholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.END_DATE"
            />
          </Colxx>
        )}
        {form.values[campaignType][getSendCampaignTimeValue(form, campaignType)]
          .ends === ScheduleAndGoalsEnums.AFTER && (
          <Colxx xxs="12" md="4">
            <div
              style={{ maxWidth: '200px' }}
              className="d-flex align-items-center justify-content between mr-2"
            >
              <FormGroupCoustom
                type="number"
                className="mr-2"
                noLable
                placeholder="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.OCCURRENCES"
                minNumberValue="1"
                identifier={`${campaignType}.${getSendCampaignTimeValue(
                  form,
                  campaignType
                )}.${getEndsFieldType(form, campaignType)}.occurrences`}
              />{' '}
              <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.SCHEDULE_AND_GOALS.LABEL.OCCURRENCES" />
              <span className="required-star-mark">{`*`}</span>
            </div>
          </Colxx>
        )}
      </Row>
    </div>
  );
};

export default ScheduleAndGoalsPeriodic;
