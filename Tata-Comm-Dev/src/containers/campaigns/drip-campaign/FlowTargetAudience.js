import React from 'react';
import { Card } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Form, Formik } from 'formik';
import CreateSegmentFilter from 'components/create-segment/CreateSegmentFilter';
import CreateSegmentPopover from 'views/app/segments/create-segment/widgets/CreateSegmentPopover';
import { segmentCreate } from 'redux/segmentation/actions';
import { isFiltersValidForCampaign } from 'helpers/campaignHelper';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { filterUsersSchema } from 'components/create-segment/createSegmentValidationSchema';
import { createSegmentFiltersInitialValues } from 'data/segments/createSegmentFilterData';
import StepperNavigationButtons from '../StepperNavigationButtons';

const FlowTargetAudience = ({
  formRef,
  next,
  previous,
  lastExecutedFilterId,
  segmentCreateAction,
}) => {
  const createSegment = (campaign) => {
    segmentCreateAction({
      name: campaign,
      type: 'Filter',
      filter_id: lastExecutedFilterId,
      created_from: 'direct_from_query',
    });
  };
  const history = useHistory();
  const state = history.location;
  const segmentName = state?.segmentName;

  const initialValues = {
    selectedUserAttribute: '',
    globalControlGroup: false,
    campaignControlGroup: false,
    ...createSegmentFiltersInitialValues,
  };
  const handleSubmit = () => {
    next();
  };

  const handlePreviousBtnClick = () => {
    previous();
  };

  const makeSchema = Yup.object().shape({
    included_filters: Yup.object().when('segmentId', {
      is: (value) => value && segmentName,
      then: Yup.object().notRequired(),
      otherwise: Yup.object().shape({
        ...filterUsersSchema,
      }),
    }),
    exclude_users: Yup.boolean(),
    excluded_filters: Yup.object().when('exclude_users', {
      is: true,
      then: Yup.object().shape({
        ...filterUsersSchema,
      }),
    }),
  });
  return (
    <div className="mt-2">
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={makeSchema}
      >
        {(form) => (
          <Form>
            <Card>
              <div className="user-filter">
                <br />
                <CreateSegmentFilter segmentName={segmentName} form={form} />
                <div className="float-right mr-1">
                  <CreateSegmentPopover
                    createSegment={createSegment}
                    segmentName={segmentName}
                    form={form}
                    hideCreateButton
                    isFiltersValid={isFiltersValidForCampaign(form.errors)}
                  />
                </div>
              </div>
            </Card>

            <StepperNavigationButtons
              className="m-2"
              leftBtnLabel={
                <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.PREVIOUS" />
              }
              handleLeftBtnClick={handlePreviousBtnClick}
              rightBtnLabel={
                <IntlMessages id="CAMPAIGN.CREATE_CAMPAIGN.FORM.BUTTON.NEXT" />
              }
              handleRightBtnClick={form.handleSubmit}
              rightBtnLabelDisable={
                !form.isValid && !(Object.keys(form.errors) > 0)
              }
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, {
  segmentCreateAction: segmentCreate,
})(injectIntl(FlowTargetAudience));
