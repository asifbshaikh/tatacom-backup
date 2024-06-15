import { useState, useEffect } from 'react';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import {
  Row,
  Button,
  FormGroup,
  Label,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import HelpCenterFormHeading from './HelpCenterFormHeading';
import { getColAttributesDropDownValues } from 'helpers/campaignHelper';
import { useDropzone } from 'react-dropzone';
import { IMPORTUSER_UPLOAD_FILE_CHARACTER_LENGTH } from 'constants/appConstant';
import { productOptions, priorityOptions } from 'data/createCampaignData';
import { getEmailSubmit } from 'redux/actions';
import { connect } from 'react-redux';
import { NotificationManager } from 'components/common/react-notifications';

const HelpCenterForm = ({
  match,
  form,
  getEmailSubmitAction,
  emailSuccess,
}) => {
  const [showFile, setShowFile] = useState(true);
  const [csvFile, setCSVFile] = useState([]);
  const [csvFileError, setCSVFileError] = useState(false);
  const [isValidFileName, setIsValidFileName] = useState(true);
  const [isValidFileSize, setIsValidFileSize] = useState(true);
  const removeFile = () => {
    setCSVFile([]);
    setShowFile(true);
  };
  const files = csvFile.map((file) => (
    <div key={file.path}>
      {file.path} - {file.size} bytes{' '}
    </div>
  ));
  const onDrop = (acceptedFiles) => {
    const fileSize = acceptedFiles[0].size / (1024 * 1024);
    if (fileSize < 10) {
      setCSVFile([...csvFile, ...acceptedFiles]);
      if (acceptedFiles.length !== 0) {
        setShowFile(false);
      }
    } else {
      NotificationManager.error(
        <IntlMessages id={'HELP_CENTER.FILE_SIZE_MSG'} />,
        'Error',
        6000,
        null,
        null,
        ''
      );
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'text/xlsx': ['.xlsx'],
    },
    maxFiles: 1,
  });
  const hanldeEmailIDOnChange = (event) => {
    form.setFieldValue('emailID', event.target.value);
  };

  const hanldeAdditionalEmailsOnChange = (event) => {
    form.setFieldValue('addtionalEmails', event.target.value);
  };

  const hanldeSubjectOnChange = (event) => {
    form.setFieldValue('subject', event.target.value);
  };

  const hanldeDescriptionOnChange = (event) => {
    form.setFieldValue('description', event.target.value);
  };

  const handleOnChangeProduct = (event) => {
    form.setFieldValue('product', event.target.value);
  };

  const handleOnChangePriority = (event) => {
    form.setFieldValue('priority', event.target.value);
  };

  const triggerEmail = () => {
    const formData = new FormData();
    if (form.values.addtionalEmails) {
      const emailArray = form.values.addtionalEmails.split(',');
      emailArray.forEach((value, index) => {
        formData.append('contact_support_mail[bcc_users][]', value);
      });
    }
    if (form.values.product) {
      formData.append(
        'contact_support_mail[product_area]',
        form.values.product
      );
    }
    if (form.values.priority) {
      formData.append('contact_support_mail[priority]', form.values.priority);
    }
    if (form.values.subject) {
      formData.append('contact_support_mail[subject]', form.values.subject);
    }
    if (form.values.description) {
      formData.append(
        'contact_support_mail[description]',
        form.values.description
      );
    }
    if (form.values.emailID) {
      const emailArray = form.values.emailID.split(',');
      emailArray.forEach((value, index) => {
        formData.append('contact_support_mail[cc_users][]', value);
      });
    }
    if (csvFile.length > 0) {
      formData.append('contact_support_mail[attachment_file]', csvFile[0]);
    }
    if (Object.keys(form.errors).length === 0) {
      getEmailSubmitAction(formData);
    } else {
      const requiredMsg = 'HELP_CENTER.REQUIRED_MSG';
      NotificationManager.error(
        <IntlMessages id={requiredMsg} />,
        'Error',
        6000,
        null,
        null
      );
    }
    if (emailSuccess.message) {
      form.handleSubmit();
    }
  };

  return (
    <>
      <ModalBody>
        <FormGroup>
          <HelpCenterFormHeading match={match} />
          <Separator className="mb-5" />
          <Row className="pl-4 pr-4">
            <Colxx xxs="12" md="12">
              <Label htmlFor="attribute">
                <IntlMessages id="HELP_CENTER.SUBJECT" />
                <span className="required-star-mark">{`*`}</span>
              </Label>
              <FormGroupCoustom
                identifierLabel="HELP_CENTER.SUBJECT"
                placeholder="HELP_CENTER.SUBJECT"
                identifier="subject"
                className="rounded-3"
                noLable
                errors={form.errors}
                touched={form.touched}
                onChange={hanldeSubjectOnChange}
                value={form.values.subject}
                onFocus={() => {
                  form.setFieldTouched('subject', false);
                }}
              />
            </Colxx>
          </Row>
          <Row className="pl-4 pr-4">
            <Colxx xxs="6" md="6">
              <Label htmlFor="attribute">
                <IntlMessages id="HELP_CENTER.CC" />
              </Label>
              <FormGroupCoustom
                identifierLabel="HELP_CENTER.ADD_EMAIL"
                placeholder="HELP_CENTER.ADD_EMAIL"
                identifier="emailID"
                className="rounded-3"
                noLable
                errors={form.errors}
                touched={form.touched}
                onChange={hanldeEmailIDOnChange}
                value={form.values.emailID}
                onFocus={() => {
                  form.setFieldTouched('emailID', false);
                }}
              />
            </Colxx>
            <Colxx xxs="6" md="6">
              <Label htmlFor="attribute">
                <IntlMessages id="HELP_CENTER.ADDITIONAL_EMAILS" />
                <IntlMessages id="HELP_CENTER.ADDITIONAL_EMAILS_SUBTITLE" />
              </Label>
              <FormGroupCoustom
                identifierLabel="HELP_CENTER.ADDITIONAL_EMAILS"
                placeholder="HELP_CENTER.ADDITIONAL_EMAILS"
                identifier="addtionalEmails"
                className="rounded-3"
                noLable
                errors={form.errors}
                touched={form.touched}
                onChange={hanldeAdditionalEmailsOnChange}
                value={form.values.addtionalEmails}
                onFocus={() => {
                  form.setFieldTouched('addtionalEmails', false);
                }}
              />
            </Colxx>
          </Row>
          <Row className="pl-4 pr-4">
            <Colxx>
              <Label htmlFor="attribute">
                <IntlMessages id="HELP_CENTER.DESCRIPTION" />
                <IntlMessages id="HELP_CENTER.DESCRIPTION_SUBTITLE" />
                <span className="required-star-mark">{`*`}</span>
              </Label>
              <FormGroupCoustom
                identifierLabel="HELP_CENTER.DESCRIPTION"
                placeholder="HELP_CENTER.DESCIPTION"
                identifier="description"
                className="rounded-3"
                type="textarea"
                noLable
                errors={form.errors}
                touched={form.touched}
                onChange={hanldeDescriptionOnChange}
                value={form.values.description}
                onFocus={() => {
                  form.setFieldTouched('description', false);
                }}
                required={true}
              />
            </Colxx>
          </Row>
          <Row className="pl-4 pr-4">
            <Colxx xxs="6" md="6">
              <Label htmlFor="attribute">
                <IntlMessages id="HELP_CENTER.PRODUCT_AREA" />
                <span className="required-star-mark">{`*`}</span>
              </Label>
              <FormGroupCoustom
                identifierLabel="HELP_CENTER.PRODUCT_AREA"
                placeholder="HELP_CENTER.PRODUCT_AREA"
                className="react-select"
                identifier="product"
                type="select"
                noLable
                value={form.values.product}
                options={getColAttributesDropDownValues(productOptions)}
                onChange={handleOnChangeProduct}
                errors={form.errors}
                touched={form.touched}
                onFocus={() => {
                  form.setFieldTouched('product', false);
                }}
              />
              <Label htmlFor="attribute">
                <IntlMessages id="HELP_CENTER.PRODUCT_SUBTITLE" />
              </Label>
            </Colxx>
            <Colxx xxs="6" md="6">
              <Label htmlFor="attribute">
                <IntlMessages id="HELP_CENTER.PRIORITY" />
                <span className="required-star-mark">{`*`}</span>
              </Label>
              <FormGroupCoustom
                identifierLabel="HELP_CENTER.PRIORITY"
                placeholder="HELP_CENTER.PRIORITY"
                className="react-select"
                identifier="priority"
                type="select"
                noLable
                value={form.values.priority}
                options={getColAttributesDropDownValues(priorityOptions)}
                onChange={handleOnChangePriority}
                errors={form.errors}
                touched={form.touched}
                onFocus={() => {
                  form.setFieldTouched('priority', false);
                }}
              />
            </Colxx>
          </Row>
        </FormGroup>
        <Row className="pl-4 pr-4">
          <Colxx>
            <Label htmlFor="attribute">
              <IntlMessages id="HELP_CENTER.ATTACHMENT" />
            </Label>
            <div className="upload-sections pl-4 pr-4">
              <div {...getRootProps()}>
                <input name="dropzone-upload-file" {...getInputProps()} />
                {showFile && (
                  <div className="drag-and-drop-edit-file">
                    <IntlMessages id="HELP_CENTER.DRAG_AND_DROP" />
                  </div>
                )}
              </div>
              {!showFile && (
                <div data-testid="files" className="file-name-edit-file">
                  {files}
                  <div aria-hidden className="remove" onClick={removeFile}>
                    (<i className="simple-icon-trash" />
                    <IntlMessages id="ALL_SEGMENTS.EDIT_FILE_SEGMENT.TITLE.REMOVE_CSV" />
                    )
                  </div>
                </div>
              )}
            </div>
          </Colxx>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={() => {
            triggerEmail();
          }}
          disabled={!form.isValid}
        >
          <IntlMessages id="DASHBOARD.CAMPAIGN.BUTTONS.SUBMIT" />
        </Button>
      </ModalFooter>
    </>
  );
};

const mapStateToProps = ({ dashboardCampaignsApp }) => {
  const { emailSuccess } = dashboardCampaignsApp;
  return {
    emailSuccess,
  };
};
const mapActionsToProps = {
  getEmailSubmitAction: getEmailSubmit,
};
export default connect(mapStateToProps, mapActionsToProps)(HelpCenterForm);
