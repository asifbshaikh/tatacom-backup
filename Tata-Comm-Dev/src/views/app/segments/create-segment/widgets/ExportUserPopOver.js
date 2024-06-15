import FormGroupCoustom from 'components/common/FormGroupCoustom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import IntlMessages from 'helpers/IntlMessages';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import {
  Button,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { getCategoryDropdownList } from 'redux/actions';
import {
  segmentUserExport,
  segmentUserExportBySegmentFilterId,
} from 'redux/segmentation/actions';
import { injectIntl } from 'react-intl';
import { getCurrentUser } from 'helpers/Utils';
import { NotificationManager } from 'components/common/react-notifications';
import SegmentationEnums from 'enums/segmentation/segmentationEnums';

const ExportUserPopOver = ({
  showExport,
  setShowExport,
  segmentId,
  segmentFilterId,
  getCategoryDropdownListAction,
  segmentUserExportAction,
  categoryList,
  intl,
  segmentExportSuccessMessage,
  loading,
  segmentUserExportBySegmentFilterIdAction,
}) => {
  const inputToggle = () => setShowExport(!showExport);
  const [emailDisabled] = useState(true);
  const { messages } = intl;
  const closeBtnForCustomSegment = (
    <button className="close" onClick={inputToggle} type="button">
      &times;
    </button>
  );
  useEffect(() => {
    getCategoryDropdownListAction();
  }, []);
  const user = getCurrentUser();
  const initialValues = {
    email: user.email,
    fileName: '',
    attribute: [],
  };
  const getFieldRequiredMessage = (message) => {
    return <IntlMessages id={message} />;
  };
  const exportUserSchema = Yup.object().shape({
    email: Yup.string(),
    fileName: Yup.string()
      .required(getFieldRequiredMessage('forms.required-message'))
      .min(
        4,
        getFieldRequiredMessage(
          'ALL_SEGMENTS.EXPORT.VALIDATION.FILE_NAME_MIN_LENGTH'
        )
      )
      .max(
        50,
        getFieldRequiredMessage(
          'ALL_SEGMENTS.EXPORT.VALIDATION.FILE_NAME_MAX_LENGTH'
        )
      ),
    attribute: Yup.array()
      .required(getFieldRequiredMessage('forms.required-message'))
      .min(
        1,
        getFieldRequiredMessage(
          'ALL_SEGMENTS.EXPORT.VALIDATION.USER_ATTRIBUTES'
        )
      ),
  });
  const onExport = (values) => {
    if (segmentId) {
      const payload = {
        segment_id: segmentId,
        file_name: values.fileName,
        file_headers: {
          contact_columns: values.attribute
            .filter(
              (attr) => attr.category === SegmentationEnums.USER_PROPERTIES
            )
            .map((attr) => attr.value),
          custom_columns: values.attribute
            .filter(
              (attr) => attr.category === SegmentationEnums.CUSTOM_ATTRIBUTES
            )
            .map((attr) => attr.value),
        },
      };
      segmentUserExportAction(payload);
    } else if (segmentFilterId) {
      const payload = {
        segment_filter_id: segmentFilterId,
        file_name: values.fileName,
        file_headers: {
          contact_columns: values.attribute.map((attr) => attr.value),
        },
      };
      segmentUserExportBySegmentFilterIdAction(payload);
    }
    return true;
  };

  const getDataTypeOptions = () => {
    const dataTypeOptions = [];
    if (categoryList?.length > 0) {
      categoryList?.forEach((list) => {
        list?.map((item) => {
          dataTypeOptions.push({
            value: item.value,
            label: item.label,
            category: item.category,
          });
        });
      });
    }
    return dataTypeOptions;
  };
  if (segmentExportSuccessMessage) {
    inputToggle();
    NotificationManager.success(
      segmentExportSuccessMessage,
      'Success',
      6000,
      null,
      null
    );
  }

  return (
    <div>
      <Modal isOpen={showExport} toggle={inputToggle}>
        <ModalHeader toggle={inputToggle} close={closeBtnForCustomSegment}>
          <IntlMessages id="ALL_SEGMENTS.EXPORT.TITLE.EXPORT_USER_DATA" />
        </ModalHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={exportUserSchema}
          onSubmit={onExport}
        >
          {({ errors, touched, isValid, dirty, setFieldValue, values }) => (
            <Form>
              <ModalBody>
                <FormGroupCoustom
                  identifier="email"
                  identifierLabel="ALL_SEGMENTS.EXPORT.TITLE.EMAIL_ID"
                  placeholder="ALL_SEGMENTS.EXPORT.PLACEHOLDER.EMAIL_ID"
                  errors={errors}
                  touched={touched}
                  disabled={emailDisabled}
                />
                <FormGroupCoustom
                  identifier="fileName"
                  identifierLabel="ALL_SEGMENTS.EXPORT.TITLE.FILE_NAME"
                  placeholder="ALL_SEGMENTS.EXPORT.PLACEHOLDER.FILE_NAME"
                  errors={errors}
                  touched={touched}
                  required={true}
                />
                <FormGroup className="has-float-label">
                  <Label htmlFor="attribute">
                    <IntlMessages id="ALL_SEGMENTS.EXPORT.TITLE.USER_ATTRIBUTE" />
                    <span className="required-star-mark">{`*`}</span>
                  </Label>
                  <Select
                    placeholder={
                      messages['ALL_SEGMENTS.EXPORT.PLACEHOLDER.USER_ATTRIBUTE']
                    }
                    onChange={(event) =>
                      event.map((e) => {
                        setFieldValue(
                          'attribute',
                          [
                            ...values.attribute,
                            { category: e.category, value: e.value },
                          ],
                          { category: e.category, value: e.value }
                        );
                      })
                    }
                    options={getDataTypeOptions()}
                    errors={errors}
                    touched={touched}
                    isMulti
                  />
                  {errors?.attribute && (
                    <div className="invalid-feedback d-block w-30">
                      <span>{errors?.attribute}</span>
                    </div>
                  )}
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  onClick={() => {
                    inputToggle();
                  }}
                >
                  <IntlMessages id="ALL_SEGMENTS.EXPORT.BUTTON.CANCEL" />
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  className={`btn-shadow btn-multiple-state ${
                    loading ? 'show-spinner' : ''
                  }`}
                  disabled={!isValid || !dirty}
                >
                  <span className="spinner d-inline-block">
                    <span className="bounce1" />
                    <span className="bounce2" />
                    <span className="bounce3" />
                  </span>
                  <span className="label">
                    <IntlMessages id="ALL_SEGMENTS.EXPORT.BUTTON.EXPORT" />
                  </span>
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};
const mapStateToProps = ({ segmentationApp }) => {
  const { exportCategoryDropdownList, segmentExportSuccessMessage, loading } =
    segmentationApp;
  return {
    segmentExportSuccessMessage,
    categoryList: exportCategoryDropdownList,
    loading,
  };
};

export default connect(mapStateToProps, {
  getCategoryDropdownListAction: getCategoryDropdownList,
  segmentUserExportAction: segmentUserExport,
  segmentUserExportBySegmentFilterIdAction: segmentUserExportBySegmentFilterId,
})(injectIntl(ExportUserPopOver));
