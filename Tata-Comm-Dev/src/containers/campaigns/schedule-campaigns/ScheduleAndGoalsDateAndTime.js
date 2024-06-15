import React from 'react';
import { FormGroup, Label, Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import moment from 'moment';
import Datetime from 'react-datetime';
import IntlMessages from 'helpers/IntlMessages';

const ScheduleAndGoalsDateAndTime = ({
  form,
  leftFieldID,
  leftFieldLabel = '',
  leftFieldPlaceholder,
  rightFieldId = '',
  rightFieldLabel,
  rightFieldPlaceholder,
  className,
}) => {
  const left = leftFieldID?.split('.');
  let leftValue = '';
  if (leftFieldID) {
    if (!left.includes('event_trigger')) {
      if (left.includes('endDate')) {
        leftValue = form.values[left[0]][left[1]]
          ? moment(form.values[left[0]][left[1]]?.on?.endDate).format(
              'MM/DD/YYYY'
            )
          : moment(form.values[left[0]]?.on?.endDate).format('MM/DD/YYYY');
      } else if (left.includes('startDate')) {
        leftValue = form.values[left[0]][left[1]]
          ? moment(form.values[left[0]][left[1]]?.startDate).format(
              'MM/DD/YYYY'
            )
          : moment(form.values[left[0]]?.startDate).format('MM/DD/YYYY');
      }
    }
    if (left.includes('event_trigger')) {
      if (left.includes('startDate')) {
        leftValue = form.values[left[0]][left[1]]
          ? moment(form.values[left[0]][left[1]]).format('MM/DD/YYYY')
          : moment(form.values[left[0]]?.startDate).format('MM/DD/YYYY');
      } else if (left.includes('endDate')) {
        leftValue = form.values[left[0]][left[1]]
          ? moment(form.values[left[0]][left[1]]).format('MM/DD/YYYY')
          : moment(form.values[left[0]]?.endDate).format('MM/DD/YYYY');
      }
    }
  }
  const right = rightFieldId?.split('.');
  let rightValue = '';
  if (rightFieldId) {
    if (right.includes('sendMessagesBasedOnBestTime')) {
      rightValue =
        form.values[right[0]][right[1]] &&
        form.values[right[0]][right[1]].sendMessagesBasedOnBestTime;
    } else if (right.includes('event_trigger')) {
      if (right.includes('sendTime') || right.includes('endTime')) {
        rightValue = form.values[right[0]][right[1]];
      }
    } else {
      rightValue = form.values[right[0]][right[1]]
        ? form.values[right[0]][right[1]].sendTime
        : form.values[right[0]].sendTime;
    }
  }
  const handleLeftFieldOnChange = (date) => {
    if (moment(date).format() === 'Invalid date') {
      form.setFieldValue(`${leftFieldID}`, '');
    } else {
      const data = moment(date).format('DD MMMM YYYY');
      form.setFieldValue(`${leftFieldID}`, data);
    }
  };

  const handleRightFieldOnChange = (time) => {
    if (moment(time).format() === 'Invalid date') {
      form.setFieldValue(`${rightFieldId}`, '');
    } else {
      const timeStamp = moment(time).format('LT');
      form.setFieldValue(`${rightFieldId}`, timeStamp);
    }
  };

  return (
    <Row className={className}>
      {leftFieldPlaceholder && (
        <Colxx xxs="12" md="4">
          <FormGroup floating className="has-float-label">
            <Label for={leftFieldID}>
              {leftFieldLabel}
              <span className="required-star-mark">{`*`}</span>
            </Label>
            <Datetime
              className="send-date"
              isValidDate={(current) => {
                return current.isAfter(moment().subtract(1, 'day'));
              }}
              id={leftFieldID}
              name="sendDate"
              input
              dateFormat
              initialValue={moment(form.values[leftFieldID])}
              timeFormat={false}
              value={leftValue}
              placeholder={<IntlMessages id={leftFieldPlaceholder} />}
              onChange={handleLeftFieldOnChange}
            />
            {form.errors?.[left[0]]?.[left[1]]?.on?.endDate &&
              left.includes('endDate') && (
                <div className="invalid-feedback d-block w-30">
                  <span>
                    <IntlMessages id="CHANNEL_MGMT.CHANNEL.END_DATE_ERROR_MESSAGE" />
                  </span>
                </div>
              )}
            {form.errors?.[left[0]]?.endDate && left.includes('endDate') && (
              <div className="invalid-feedback d-block w-30">
                <span>
                  <IntlMessages id="CHANNEL_MGMT.CHANNEL.END_DATE_ERROR_MESSAGE" />
                </span>
              </div>
            )}
          </FormGroup>
        </Colxx>
      )}
      {rightFieldLabel && (
        <Colxx xxs="12" md="4">
          <FormGroup floating className="has-float-label">
            <Label for={rightFieldId}>
              {rightFieldLabel}
              <span className="required-star-mark">{`*`}</span>
            </Label>
            <Datetime
              input
              id={rightFieldId}
              name="sendTime"
              closeOnSelect
              initialValue={moment(form.values[rightFieldId])}
              dateFormat={false}
              placeholder={<IntlMessages id={rightFieldPlaceholder} />}
              value={rightValue}
              onChange={handleRightFieldOnChange}
              required={true}
            />
          </FormGroup>
          {form.errors?.[right[0]]?.[right[1]]?.sendTime &&
            right.includes('sendTime') && (
              <div className="invalid-feedback d-block w-30">
                <span>
                  <IntlMessages id="CHANNEL_MGMT.CHANNEL.SEND_TIME_ERROR_MESSAGE" />
                </span>
              </div>
            )}

          {form.errors?.[right[0]]?.sendTime && right.includes('sendTime') && (
            <div className="invalid-feedback d-block w-30">
              <span>
                <IntlMessages id="CHANNEL_MGMT.CHANNEL.SEND_TIME_ERROR_MESSAGE" />
              </span>
            </div>
          )}

          {form.errors?.[right[0]]?.[right[1]]?.sendMessagesBasedOnBestTime &&
            right.includes('sendMessagesBasedOnBestTime') && (
              <div className="invalid-feedback d-block w-30">
                <span>
                  <IntlMessages id="CHANNEL_MGMT.CHANNEL.SEND_TIME_ERROR_MESSAGE" />
                </span>
              </div>
            )}
        </Colxx>
      )}
    </Row>
  );
};

export default ScheduleAndGoalsDateAndTime;
