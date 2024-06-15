import React from 'react';
import { Row, Button, Label } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { adminRoot } from 'constants/defaultValues';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import StepperNavigationButtons from 'containers/campaigns/StepperNavigationButtons';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { injectIntl } from 'react-intl';
import { createMemoryHistory } from 'history';
import Select from 'react-select';
import { connect } from 'react-redux';
import { setFlowName, setFlowDetails } from 'redux/flows/actions';

const DetailsAndGoals = ({
  form,
  next,
  intl,
  formRef,
  flowName,
  flowTag,
  setFlowNameAction,
  setFlowDetailsAction,
}) => {
  const history = createMemoryHistory();
  const { messages } = intl;

  const handleSubmit = (values) => {
    setFlowDetailsAction(values);
    next();
  };

  const handlePreviousBtnClick = () => {
    history.push(`${adminRoot}/campaigns/flows/list`);
  };

  const initialValues = {
    flowName: flowName ?? '',
    flowTag: flowTag ?? '',
  };

  const getValidationMessage = (text) => {
    return <IntlMessages id={text} />;
  };

  const schema = Yup.object({
    flowName: Yup.string().required(
      getValidationMessage('forms.required-message')
    ),
    flowTag: Yup.array().of(Yup.string()),
  });

  const tagDropDownData = [
    {
      value: 1,
      label: 'activation',
    },
    {
      value: 2,
      label: 'all users',
    },
    {
      value: 3,
      label: 'engagement',
    },
    {
      value: 4,
      label: 'incentive',
    },
    {
      value: 5,
      label: 'onboarding',
    },
  ];

  const handleOnChange = (data, form) => {
    const tagSelect = data?.map((item) => item.label);
    form.setFieldValue('flowTag', tagSelect);
  };

  const getTagSelectValues = (form) => {
    return tagDropDownData.filter((eventData) => {
      return form.values.flowTag.includes(eventData.label);
    });
  };

  const handleFlowNameOnChange = (event, form) => {
    setFlowNameAction(event.target.value);
    form.setFieldValue('flowName', event.target.value);
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={schema}
      validateOnBlur
      validateOnChange
      validateOnMount
    >
      {(form) => (
        <Form className="av-tooltip tooltip-label-bottom">
          <p>
            <b>
              <IntlMessages id="DRIP_CAMPAIGN.DETAILS.LABEL.FLOW_INFO" />
            </b>
          </p>
          <Row className="p-2">
            <Colxx xxs="12" md="4">
              <FormGroupCoustom
                identifier="flowName"
                errors={form.errors}
                touched={form.touched}
                identifierLabel="DRIP_CAMPAIGN.DETAILS.LABEL.FLOW_NAME"
                value={form.values.flowName}
                onChange={(e) => handleFlowNameOnChange(e, form)}
                className="form-group has-float-label"
                placeholder={'DRIP_CAMPAIGN.DETAILS.PLACEHOLDERS.FLOW_NAME'}
                dataTestId="flowName"
                required={true}
              />
            </Colxx>
          </Row>

          <Row className="p-2">
            <Colxx xxs="12" md="4" className="mt-3">
              <div className="has-float-label mb-3">
                <Label>
                  <IntlMessages id="DRIP_CAMPAIGN.DETAILS.LABEL.FLOW_TAGS" />
                </Label>
                <Select
                  className="react-select"
                  classNamePrefix="react-select"
                  placeholder={
                    messages['DRIP_CAMPAIGN.DETAILS.PLACEHOLDERS.FLOW_TAGS']
                  }
                  onChange={(e) => handleOnChange(e, form)}
                  options={tagDropDownData}
                  isMulti
                  value={getTagSelectValues(form)}
                  identifier="flowTag"
                />
              </div>
            </Colxx>
          </Row>

          <br />
          <StepperNavigationButtons
            className="m-2  md=4"
            rightBtnLabel={<IntlMessages id="DRIP_CAMPAIGN.BUTTONS.NEXT" />}
            handleLeftBtnClick={handlePreviousBtnClick}
            handleRightBtnClick={() => {
              form.handleSubmit();
            }}
            rightBtnLabelDisable={
              !form.isValid && !(Object.keys(form.errors) > 0)
            }
          />
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = ({ flowsApp }) => {
  const { flowName, flowTag } = flowsApp;

  return {
    flowName,
    flowTag,
  };
};

export default connect(mapStateToProps, {
  setFlowNameAction: setFlowName,
  setFlowDetailsAction: setFlowDetails,
})(injectIntl(DetailsAndGoals));
