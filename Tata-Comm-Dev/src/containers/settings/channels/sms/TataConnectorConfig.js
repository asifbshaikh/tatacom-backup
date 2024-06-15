import React from 'react';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { onChangeDefault } from 'helpers/TringReactHelper';
import {
  Formik,
  Form,
} from 'formik';
import {
  Row
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import TataConfigForm from './TataConfigForm';


const TataConnectorConfig = ({
  fields, formRef, next,
  setFieldsCoustom,
}) => {
  const initialValues = {
    type: 'sms',
    provider: 'tata',
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validateOnMount
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form className="av-tooltip tooltip-label-right">
            <Row>
              <Colxx xxs="12">
                <FormGroupCoustom
                  identifier='provider'
                  errors={errors}
                  touched={touched}
                  dataTestId="providerSelect"
                  identifierLabel='inboxes.whatsapp.providers.label'
                  type='select'
                  className="provider-lable"
                  options={[
                    { id: 'tata', value: 'inboxes.sms.providers.tata' },
                    { id: 'Kaleyra', value: 'CHANNEL_MGMT.SMS_CHANNEL.KALEYRA' },
                  ]}
                  value={values.provider}
                  onChange={event => {
                    onChangeDefault(event, 'provider', setFieldValue)
                  }}
                />
              </Colxx>
            </Row>
          </Form>
        )}
      </Formik>
      {<TataConfigForm
        fields={fields}
        formRef={formRef}
        next={next}
        setFieldsCoustom={setFieldsCoustom}
        type="sms" />}
    </>
  );
}

export default TataConnectorConfig;