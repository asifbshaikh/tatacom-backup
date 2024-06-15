/* eslint-disable react/display-name */
import React, { useContext } from 'react';
import { getCustomSegListData } from 'redux/actions';
import { connect } from 'react-redux';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import {
  CleanFieldValuesProvider,
  daysOptions,
  durationDropdownOptions,
  durationUserBehaviorOptions,
  userBehaviorDaysOptions,
} from 'data/segments/createSegmentFilterData';
import { Colxx } from 'components/common/CustomBootstrap';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import IntlMessages from 'helpers/IntlMessages';
import Datetime from 'react-datetime';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { DATE_FORMAT_WITHOUT_TIME } from 'constants/appConstant';

const DurationFilterCriteria = ({
  durationFilterCriteriaIdentifier,
  form,
  durationFilterCriteriaValues,
  intl,
  filterType,
  durationFilterIdentifier,
  filterFormErrors,
  filterFormTouched,
}) => {
  const { messages } = intl;

  const { cleanFieldValues, getErrorMessageOfField } = useContext(
    CleanFieldValuesProvider
  );

  const returnDatePicker = () => {
    return (
      <>
        <Datetime
          closeOnSelect={true}
          inputProps={{
            placeholder: messages['CREATE_SEGMENT.USER_AFFINITY.SELECT_DATE'],
            onBlur: () =>
              form.setFieldTouched(
                `${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.value`
              ),
          }}
          identifier={`${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.value`}
          dateFormat={DATE_FORMAT_WITHOUT_TIME}
          timeFormat={false}
          onChange={(val) => {
            if (moment(val).format() === 'Invalid date') {
              form.setFieldValue(
                `${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.value`,
                ''
              );
            } else {
              form.setFieldValue(
                `${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.value`,
                moment(val).format(DATE_FORMAT_WITHOUT_TIME)
              );
            }
          }}
          value={durationFilterCriteriaValues[durationFilterIdentifier].value}
        />
        {getErrorMessageOfField(
          filterFormErrors?.[durationFilterIdentifier],
          filterFormTouched?.[durationFilterIdentifier],
          'value'
        )}
      </>
    );
  };

  const handleOnTypeChange = (event) => {
    form.setFieldValue(
      `${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.type`,
      event.target.value
    );
    cleanFieldValues(
      `${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}`,
      'type'
    );
    if (
      durationFilterCriteriaValues.filter_type ===
        createSegementEnums.CONDITION.USER_AFFINITY &&
      event.target.value === createSegementEnums.CONDITION.IN_THE_LAST
    ) {
      form.setFieldValue(
        `${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.period_unit`,
        createSegementEnums.CONDITION.DAYS
      );
    } else if (
      event.target.value === createSegementEnums.CONDITION.AFTER ||
      event.target.value === createSegementEnums.CONDITION.TODAY ||
      event.target.value === createSegementEnums.CONDITION.YESTERDAY
    ) {
      form.setFieldValue(
        `${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.period_unit`,
        createSegementEnums.CONDITION.DATE
      );
    } else if (
      event.target.value === createSegementEnums.CONDITION.THIS_WEEK ||
      event.target.value === createSegementEnums.CONDITION.LAST_WEEK ||
      event.target.value === createSegementEnums.CONDITION.THIS_MONTH ||
      event.target.value === createSegementEnums.CONDITION.LAST_MONTH
    ) {
      form.setFieldValue(
        `${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.period_unit`,
        createSegementEnums.CONDITION.NULL
      );
      form.setFieldValue(
        `${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.value`,
        createSegementEnums.CONDITION.NULL
      );
    } else {
      return;
    }
  };

  const handleOnPeriodUnitChange = (event) => {
    cleanFieldValues(
      `${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}`,
      'period_unit'
    );
    form.setFieldValue(
      `${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.period_unit`,
      event.target.value
    );
  };

  const getIsDateValid = (currentDate) => {
    return durationFilterCriteriaValues[durationFilterIdentifier].value
      ? currentDate.isAfter(
          durationFilterCriteriaValues[durationFilterIdentifier].value
        )
      : true;
  };

  return (
    <>
      <Colxx xxs="12" md="2">
        <FormGroupCoustom
          noLable
          options={
            filterType === createSegementEnums.CONDITION.USER_AFFINITY_COND
              ? durationDropdownOptions
              : durationUserBehaviorOptions
          }
          identifier={`${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.type`}
          type="select"
          onChange={handleOnTypeChange}
          className="disable-first-option"
          dataTestId="typeDropdown"
          value={durationFilterCriteriaValues[durationFilterIdentifier].type}
        />
        {getErrorMessageOfField(
          filterFormErrors?.[durationFilterIdentifier],
          filterFormTouched?.[durationFilterIdentifier],
          'type'
        )}
      </Colxx>

      {durationFilterCriteriaValues[durationFilterIdentifier].type ===
        createSegementEnums.CONDITION.IN_THE_LAST && (
        <>
          <Colxx xxs="12" md="2">
            <FormGroupCoustom
              identifier={`${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.value`}
              type="number"
              noLable
            />
            {getErrorMessageOfField(
              filterFormErrors?.[durationFilterIdentifier],
              filterFormTouched?.[durationFilterIdentifier],
              'value'
            )}
          </Colxx>
          <Colxx xxs="12" md="2">
            {filterType === createSegementEnums.CONDITION.USER_BEHAVIOR_COND ? (
              <>
                <FormGroupCoustom
                  noLable
                  options={userBehaviorDaysOptions}
                  identifier={`${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.period_unit`}
                  type="select"
                  className="disable-first-option"
                />
                {getErrorMessageOfField(
                  filterFormErrors?.[durationFilterIdentifier],
                  filterFormTouched?.[durationFilterIdentifier],
                  'period_unit'
                )}
              </>
            ) : (
              <div className="form-group has-float-label d-flex">
                <IntlMessages id="CREATE_SEGMENT.USER_AFFINITY.DAYS" />
              </div>
            )}
          </Colxx>
        </>
      )}

      {durationFilterCriteriaValues[durationFilterIdentifier].type ===
        createSegementEnums.CONDITION.IN_BETWEEN && (
        <>
          <Colxx xxs="12" md="2">
            {durationFilterCriteriaValues[durationFilterIdentifier]
              .period_unit === createSegementEnums.CONDITION.DATE ? (
              <div className="form-group has-float-label">
                {returnDatePicker()}
              </div>
            ) : (
              <>
                <FormGroupCoustom
                  dataTestId="valueFieldForDaysAgo"
                  identifier={`${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.value`}
                  type="number"
                  noLable
                />
                {getErrorMessageOfField(
                  filterFormErrors?.[durationFilterIdentifier],
                  filterFormTouched?.[durationFilterIdentifier],
                  'value'
                )}
              </>
            )}
          </Colxx>

          <Colxx xxs="12" md="1">
            <div className="form-group has-float-label d-flex justify-content-center">
              <IntlMessages id="CREATE_SEGMENT.USER_AFFINITY.AND" />
            </div>
          </Colxx>
          <Colxx xxs="12" md="2">
            <div className="form-group has-float-label">
              {durationFilterCriteriaValues[durationFilterIdentifier]
                .period_unit === createSegementEnums.CONDITION.DATE ? (
                <>
                  <Datetime
                    closeOnSelect={true}
                    inputProps={{
                      placeholder:
                        messages['CREATE_SEGMENT.USER_AFFINITY.SELECT_DATE'],
                      onBlur: () =>
                        form.setFieldTouched(
                          `${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.value1`
                        ),
                    }}
                    identifier={`${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.value1`}
                    dateFormat={DATE_FORMAT_WITHOUT_TIME}
                    timeFormat={false}
                    onChange={(val) => {
                      if (moment(val).format() === 'Invalid date') {
                        form.setFieldValue(
                          `${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.value1`,
                          ''
                        );
                      } else {
                        form.setFieldValue(
                          `${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.value1`,
                          moment(val).format(DATE_FORMAT_WITHOUT_TIME)
                        );
                      }
                    }}
                    isValidDate={getIsDateValid}
                    value={
                      durationFilterCriteriaValues[durationFilterIdentifier]
                        .value1
                    }
                  />
                  {getErrorMessageOfField(
                    filterFormErrors?.[durationFilterIdentifier],
                    filterFormTouched?.[durationFilterIdentifier],
                    'value1'
                  )}
                </>
              ) : (
                <>
                  <FormGroupCoustom
                    dataTestId="value1FieldForDaysAgo"
                    identifier={`${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.value1`}
                    type="number"
                    noLable
                  />
                  {getErrorMessageOfField(
                    filterFormErrors?.[durationFilterIdentifier],
                    filterFormTouched?.[durationFilterIdentifier],
                    'value1'
                  )}
                </>
              )}
            </div>
          </Colxx>
          <Colxx xxs="12" md="2">
            <FormGroupCoustom
              noLable
              dataTestId="periodUnitDropDown"
              onChange={handleOnPeriodUnitChange}
              options={daysOptions}
              identifier={`${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.period_unit`}
              type="select"
              value={
                durationFilterCriteriaValues[durationFilterIdentifier]
                  .period_unit
              }
              className="disable-first-option"
            />
            {getErrorMessageOfField(
              filterFormErrors?.[durationFilterIdentifier],
              filterFormTouched?.[durationFilterIdentifier],
              'period_unit'
            )}
          </Colxx>
        </>
      )}

      {(durationFilterCriteriaValues[durationFilterIdentifier].type ===
        createSegementEnums.CONDITION.BEFORE ||
        durationFilterCriteriaValues[durationFilterIdentifier].type ===
          createSegementEnums.CONDITION.ON) && (
        <>
          <Colxx xxs="12" md="2">
            {durationFilterCriteriaValues[durationFilterIdentifier]
              .period_unit === createSegementEnums.CONDITION.DATE ? (
              <div className="form-group has-float-label">
                {returnDatePicker()}
              </div>
            ) : (
              <>
                <FormGroupCoustom
                  identifier={`${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.value`}
                  type="number"
                  noLable
                />
                {getErrorMessageOfField(
                  filterFormErrors?.[durationFilterIdentifier],
                  filterFormTouched?.[durationFilterIdentifier],
                  'value'
                )}
              </>
            )}
          </Colxx>

          <Colxx xxs="12" md="2">
            <FormGroupCoustom
              noLable
              onChange={handleOnPeriodUnitChange}
              options={daysOptions}
              identifier={`${durationFilterCriteriaIdentifier}.${durationFilterIdentifier}.period_unit`}
              type="select"
              value={
                durationFilterCriteriaValues[durationFilterIdentifier]
                  .period_unit
              }
              className="disable-first-option"
            />
            {getErrorMessageOfField(
              filterFormErrors?.[durationFilterIdentifier],
              filterFormTouched?.[durationFilterIdentifier],
              'period_unit'
            )}
          </Colxx>
        </>
      )}

      {durationFilterCriteriaValues[durationFilterIdentifier].type ===
        createSegementEnums.CONDITION.AFTER && (
        <>
          <Colxx xxs="12" md="2">
            <div className="form-group has-float-label">
              {returnDatePicker()}
            </div>
          </Colxx>
        </>
      )}
    </>
  );
};

const mapStateToProps = ({ segmentationApp }) => {
  const { customSegList } = segmentationApp;
  return { customSegListData: customSegList };
};

export default connect(mapStateToProps, {
  getCustomSegListDataAction: getCustomSegListData,
})(injectIntl(DurationFilterCriteria));
