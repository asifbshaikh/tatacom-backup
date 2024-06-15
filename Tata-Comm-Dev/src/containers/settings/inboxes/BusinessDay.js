import React, { useState } from 'react';

import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { generateTimeSlots } from 'helpers/businessHour';
import IntlMessages from 'helpers/IntlMessages';
import parse from 'date-fns/parse';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import { Colxx } from 'components/common/CustomBootstrap';

const BusinessDay = ({ dayName, timeSlot, errors, touched, update }) => {
  const [isDayEnabled, setIsDayEnabled] = useState(
    timeSlot.from && timeSlot.to
  );
  const [isOpenAllDay, setIsOpenAllDay] = useState(timeSlot.openAllDay);

  const timeSlots = generateTimeSlots(30, true);
  const fromTimeSlots = () => {
    return timeSlots;
  };
  const toTimeSlots = () => {
    return timeSlots.filter((slot) => {
      return slot !== '12:00 AM';
    });
  };
  const totalHours = ({ from, to }) => {
    if (isOpenAllDay) {
      return 24;
    }
    const fromDate = parse(from, 'hh:mm a', new Date());
    const toDate = parse(to, 'hh:mm a', new Date());
    const totalHoursText = differenceInMinutes(toDate, fromDate) / 60;
    return totalHoursText;
  };
  const onChangeIp = (event, ipName) => {
    const { value } = event.target;
    const fromDate = parse(
      ipName === 'from' ? value : timeSlot.from,
      'hh:mm a',
      new Date()
    );
    const toDate = parse(
      ipName === 'to' ? value : timeSlot.to,
      'hh:mm a',
      new Date()
    );
    const valid = differenceInMinutes(toDate, fromDate) / 60 > 0;
    update({
      ...timeSlot,
      [ipName]: value,
      valid,
    });
  };
  const onChangeAllDay = (event) => {
    setIsOpenAllDay(event.target.checked);
    update({
      ...timeSlot,
      from: event.target.checked ? '12:00 AM' : '09:00 AM',
      to: event.target.checked ? '11:59 PM' : '05:00 PM',
      valid: true,
      openAllDay: event.target.checked,
    });
  };
  return (
    <div className="row no-gutters mb-2 align-items-center">
      <Colxx className="col-sm-auto">
        <FormGroupCoustom
          identifier="selectedFeatureFlags"
          className="mb-0"
          errors={errors}
          touched={touched}
          type="checkboxMulti"
          noLable
          radioMultiOptions={[
            {
              id: `day_enabled_${timeSlot.day}`,
              value: 'enabled',
              label: '',
            },
          ]}
          onChange={(event) => {
            setIsDayEnabled(event.target.checked);
            if (!event.target.checked) {
              setIsOpenAllDay(false);
            }
            update({
              ...timeSlot,
              from: event.target.checked ? '12:00 AM' : '',
              to: event.target.checked ? '08:00 AM' : '',
              valid: event.target.checked ? true : false,
              openAllDay: !event.target.checked && false,
            });
          }}
          value={isDayEnabled ? ['enabled'] : []}
        />
      </Colxx>
      <Colxx className="col-sm-1">
        <span>{dayName}</span>
      </Colxx>
      {isDayEnabled ? (
        <>
          <Colxx className="col-sm-auto ml-4">
            <FormGroupCoustom
              identifier="selectedFeatureFlags"
              className="mb-0"
              errors={errors}
              touched={touched}
              type="checkboxMulti"
              noLable
              radioMultiOptions={[
                {
                  id: `fullday_enabled_${timeSlot.day}`,
                  value: 'enabled',
                  label: 'inboxes.all-day',
                },
              ]}
              onChange={onChangeAllDay}
              value={isOpenAllDay ? ['enabled'] : []}
            />
          </Colxx>
          <Colxx className="col-sm-auto ml-3">
            <FormGroupCoustom
              identifier="fromTime"
              errors={errors}
              touched={touched}
              type="select"
              options={fromTimeSlots().map((item) => {
                return { id: item, value: item };
              })}
              value={timeSlot.from}
              disabled={isOpenAllDay}
              noLable
              className="mb-0"
              onChange={(event) => onChangeIp(event, 'from')}
            />
          </Colxx>

          <Colxx className="col-sm-auto ml-3">
            <h2 className="mb-0">-</h2>
          </Colxx>
          <Colxx className="col-sm-auto ml-3">
            <FormGroupCoustom
              identifier="toTime"
              errors={errors}
              touched={touched}
              type="select"
              options={toTimeSlots().map((item) => {
                return { id: item, value: item };
              })}
              value={timeSlot.to}
              disabled={isOpenAllDay}
              noLable
              className="mb-0"
              onChange={(event) => onChangeIp(event, 'to')}
            />
          </Colxx>
          <Colxx className="ml-3">
            {timeSlot.valid ? (
              <span className="label text-primary">
                {totalHours(timeSlot)}{' '}
                <IntlMessages id="inboxes.business_hours_hours" />
              </span>
            ) : (
              <div className="date-time-error">
                <IntlMessages id="inboxes.date_time_error" />
              </div>
            )}
          </Colxx>
        </>
      ) : (
        <Colxx className="col-sm-auto ml-4">
          <div className="text-muted">Unavailable</div>
        </Colxx>
      )}
    </div>
  );
};

export default BusinessDay;
