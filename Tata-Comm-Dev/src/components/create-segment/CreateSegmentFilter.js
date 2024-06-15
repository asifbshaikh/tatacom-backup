import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { Colxx } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import IntlMessages from 'helpers/IntlMessages';
import { Row, CustomInput, ListGroupItem, Button } from 'reactstrap';
import createSegementEnums from 'enums/createSegment/createSegementEnums';
import {
  CleanFieldValuesProvider,
  createSegmentFiltersInitialValues,
  getUserPropertyFieldList,
} from 'data/segments/createSegmentFilterData';
import '../../assets/css/sass/views/campaign.scss';
import { selectAudienceRadioOptions } from '../../data/createCampaignData';
import FilterByUsers from './FilterByUsers';
import { getEditSegmentData } from 'redux/segmentation/actions';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { connect } from 'react-redux';

const CreateSegmentFilter = ({
  form,
  segmentName,
  getEditSegmentData,
  editSegmentData,
  isCreateSegment = true,
}) => {
  const { values, setFieldValue } = form;

  const handleSelectAudienceRadioBtnClick = (event) => {
    setFieldValue(
      createSegementEnums.INITIALVALUES.SELECT_AUDIENCE,
      event.target.value
    );
    const payload = {
      filter_operator: createSegementEnums.INITIALVALUES.AND,
      filters: [
        {
          filter_operator: createSegementEnums.INITIALVALUES.OR,
          filter_type: createSegementEnums.INITIALVALUES.NESTED_FILTERS,
          filters: [
            {
              filter_type: createSegementEnums.INITIALVALUES.ALL_USERS,
              name: createSegementEnums.LABEL.ALL_USERS,
              id: createSegementEnums.INITIALVALUES.DIGO_ALL_USERS,
            },
          ],
        },
      ],
    };
    if (event.target.value === createSegementEnums.CONDITION.ALL_USERS) {
      setFieldValue(
        createSegementEnums.INITIALVALUES.INCLUDED_FILTERS,
        payload
      );
    } else {
      delete payload.filters[0].filters[0].id;
      payload.filters[0].filters[0].name = '';
      payload.filters[0].filters[0].filter_type = 'user_property';

      setFieldValue(
        createSegementEnums.INITIALVALUES.INCLUDED_FILTERS,
        payload
      );
    }
  };

  const cleanFieldValues = (fieldIdentifier, fieldType) => {
    form.setTouched({}, false, true);
    const filedArrayList = getUserPropertyFieldList(fieldType);
    if (filedArrayList.length > 0) {
      filedArrayList.forEach((list) => {
        form.setFieldValue(`${fieldIdentifier}.${list}`, '');
      });
    }
  };

  const getErrorMessageOfField = (
    errorFilterObject,
    touchedFilteredObject,
    fieldName
  ) => {
    return (
      errorFilterObject?.[fieldName] &&
      touchedFilteredObject?.[fieldName] && (
        <div className="invalid-feedback d-block">
          {errorFilterObject?.[fieldName].includes(
            createSegementEnums.LABEL.DATE_SHOULD_BE_GREATER
          ) ? (
            <IntlMessages id="CREATE_SEGMENT.THIS_FIELD_SHOULD_BE_GREATER_THAN_PREVIOUS_FILED" />
          ) : errorFilterObject?.[fieldName].includes(
              createSegementEnums.LABEL.DAYS_SHOULD_BE_LESS_THAN
            ) ? (
            <IntlMessages id="CREATE_SEGMENT.DAYS_SHOULD_BE_LESS_THAN" />
          ) : errorFilterObject?.[fieldName].includes(
              createSegementEnums.LABEL.NO_NEGATIVE_VALUES
            ) ? (
            <IntlMessages id="CREATE_SEGMENT.NO_NEGATIVE_VALUES" />
          ) : errorFilterObject?.[fieldName].includes(
              createSegementEnums.LABEL.PERCENT_VALIDATION
            ) ? (
            <IntlMessages id="CREATE_SEGMENT.PERCENT_VALIDATION" />
          ) : (
            <IntlMessages id="CREATE_SEGMENT.THIS_FIELD_IS_REQUIRED" />
          )}
        </div>
      )
    );
  };

  const handleResetFilters = () => {
    Object.entries(createSegmentFiltersInitialValues).forEach(
      ([key, value]) => {
        form.setFieldValue(key, value);
      }
    );
    form.setTouched({}, false, true);
  };

  const history = useHistory();
  const { search } = history.location;
  const params = new URLSearchParams(search);
  const fromSegmentId = params.get('segmentId');

  useEffect(() => {
    if (fromSegmentId) {
      getEditSegmentData(fromSegmentId);
    }
  }, []);

  return (
    <CleanFieldValuesProvider.Provider
      value={{ cleanFieldValues, getErrorMessageOfField }}
    >
      <Row className="mt-4 pl-3 pr-3">
        <Colxx xxs="12">
          <h2 className="font-weight-bold">
            <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.SELECT_AUDIIENCE" />
          </h2>
        </Colxx>
      </Row>
      <Row className="p-4">
        {values?.segmentId && segmentName ? (
          <>
            <Colxx xxs="12" md="3">
              <FormGroupCoustom
                dataTestId="segmentName"
                disabled
                value={segmentName}
                identifierLabel="CREATE_SEGMENT.SEGMENT_NAME"
              />
              <p>{editSegmentData?.segment_filter?.description}</p>
            </Colxx>
            <Colxx md="7" />
            {values.exclude_users && isCreateSegment && (
              <Colxx xxs="2" className="text-right">
                <Button
                  className="filter-by-list-close mb-2 mr-2 mt-0 bg-transparent border-0"
                  data-testid="resetBtn"
                  onClick={handleResetFilters}
                >
                  <IntlMessages id="CREATE_SEGMENT.BUTTONS.RESET_FILTER" />
                </Button>
              </Colxx>
            )}
          </>
        ) : (
          <>
            <Colxx xxs="12">
              <Row>
                <Colxx xxs="10">
                  <FormGroupCoustom
                    dataTestId="audienceType"
                    onChange={handleSelectAudienceRadioBtnClick}
                    noLable
                    type="radioMulti"
                    radioMultiOptions={selectAudienceRadioOptions}
                    value={values.audience_type}
                    identifier={
                      createSegementEnums.INITIALVALUES.SELECT_AUDIENCE
                    }
                    className="select-audience"
                  />
                </Colxx>
                {(values.audience_type ===
                  createSegementEnums.CONDITION.FILTER_BY_USERS ||
                  values.exclude_users) &&
                  isCreateSegment && (
                    <Colxx xxs="2" className="text-right">
                      <Button
                        className="filter-by-list-close mb-2 mr-2 mt-0 bg-transparent border-0"
                        data-testid="resetBtn"
                        onClick={handleResetFilters}
                      >
                        <IntlMessages id="CREATE_SEGMENT.BUTTONS.RESET_FILTER" />
                      </Button>
                    </Colxx>
                  )}
              </Row>
            </Colxx>
            {values.audience_type ===
              createSegementEnums.CONDITION.FILTER_BY_USERS && (
              <Colxx xxs="12">
                <FilterByUsers
                  form={form}
                  filterIdentifier={createSegementEnums.INITIALVALUES.FILTERS}
                  filterRootIdentifier={
                    createSegementEnums.INITIALVALUES.INCLUDED_FILTERS
                  }
                />
              </Colxx>
            )}

            {values.audience_type ===
              createSegementEnums.CONDITION.ALL_USERS && (
              <Colxx xxs="12" md="12" className="mt-3">
                <ListGroupItem
                  data-testid="allUsersHeading"
                  className="d-flex align-items-center font-weight-bold border-0"
                >
                  <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.TARGET_USERS.LABEL.ALL_USERS_SELECTED" />
                </ListGroupItem>
              </Colxx>
            )}
          </>
        )}

        <Colxx xxs="12" className="mt-3">
          <CustomInput
            type="checkbox"
            id="excludeUsers"
            checked={values.exclude_users}
            onChange={(event) =>
              setFieldValue(
                createSegementEnums.INITIALVALUES.EXCLUDE_FILTERS,
                event.target.checked
              )
            }
            label={<IntlMessages id="CREATE_SEGMENT.EXCLUDE_USERS" />}
          />
        </Colxx>
        {values.exclude_users && (
          <Colxx xxs="12">
            <FilterByUsers
              form={form}
              filterIdentifier={createSegementEnums.INITIALVALUES.FILTERS}
              filterRootIdentifier={
                createSegementEnums.INITIALVALUES.EXCLUDED_FILTERS
              }
            />
          </Colxx>
        )}
      </Row>
    </CleanFieldValuesProvider.Provider>
  );
};
const mapStateToProps = ({ segmentationApp }) => {
  const { editSegmentData } = segmentationApp;
  return { editSegmentData };
};

export default connect(mapStateToProps, {
  getEditSegmentData: getEditSegmentData,
})(injectIntl(CreateSegmentFilter));
