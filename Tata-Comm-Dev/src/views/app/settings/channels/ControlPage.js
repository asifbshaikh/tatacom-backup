import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { CustomInput, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { createControlGroups } from 'redux/actions';
import { Colxx } from 'components/common/CustomBootstrap';
import { Formik, Form } from 'formik';
import { convertCSVFileDataToArray } from 'helpers/Utils';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import ControlGroupsEnums from 'enums/controlgroups/controlgroupsEnums';
import IntlMessages from 'helpers/IntlMessages';
import FormGroupCoustom from 'components/common/FormGroupCoustom';
import ControlGroupUploadCSV from './ControlGroupUploadCSV';
import StepperNavigationButtons from 'containers/campaigns/StepperNavigationButtons';
import { NotificationManager } from 'components/common/react-notifications';
import ControlDetails from './ControlDetails';

const ControlPage = ({
  createControlGroupsAction,
  controlGroups,
  controlGroupsSuccess,
  controlGroupID,
}) => {
  const [uploadedFile, setUploadedFile] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [csvData, setCSVData] = useState([]);
  const headerKeys = Object.keys(Object.assign({}, ...csvData));
  const selectAudienceRadioOptions = [
    {
      id: 'allUsers',
      label: 'CONTROL_GROUPS.RANDOM',
      value: 'random allocation',
    },
    {
      id: 'filterByUsers',
      label: 'CONTROL_GROUPS.UPLOAD',
      value: 'uploading users list',
    },
  ];
  const initialValues = {
    controlGroups: ControlGroupsEnums.RANDOM,
    random: 0,
  };
  const controlGroupsSchema = Yup.object().shape({
    random: Yup.number(),
  });
  const getCVSFile = (data) => {
    setUploadedFile(data);
  };
  useEffect(() => {
    if (uploadedFile[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const text = event.target;
        const fileData = convertCSVFileDataToArray(text.result);
        const filteredRows = fileData.filter((item) => {
          let valueExists = false;
          for (let iKey in item) {
            if (item[iKey]) {
              valueExists = true;
            }
          }
          return valueExists;
        });
        setCSVData(filteredRows);
      };

      fileReader.readAsText(uploadedFile[0]);
    }
  }, [uploadedFile[0]]);
  const createPayload = (form) => {
    let payload = {};
    if (form.controlGroups === ControlGroupsEnums.RANDOM) {
      payload = {
        global_control_group: {
          random_allocation_percentage: Number(form.random),
          apply_global: false,
          allow_marketers: false,
          active: true,
          control_group: ControlGroupsEnums.RANDOM_ALLOCATION,
        },
      };
    } else {
      const formData = new FormData();
      formData.append('global_control_group[user_list_file]', uploadedFile[0]);
      formData.append('global_control_group[apply_global]', false);
      formData.append('global_control_group[allow_marketers]', false);
      formData.append('global_control_group[active]', true);
      formData.append(
        'global_control_group[control_group]',
        'upload_user_list'
      );
      payload = formData;
    }
    return payload;
  };
  const handleSubmit = (form) => {
    let payload;
    let edit = false;
    let groupID;
    if (controlGroupID) {
      edit = true;
      groupID = controlGroups[0].global_control_group.id;
      payload = createPayload(form);
    } else {
      payload = createPayload(form);
    }
    let param = {
      payload,
      edit,
      groupID,
    };
    createControlGroupsAction(param);
  };
  useEffect(() => {
    if (controlGroupsSuccess) {
      const successMsg = controlGroupsSuccess.message;
      NotificationManager.success(
        <IntlMessages id={successMsg} />,
        'Success',
        6000,
        null,
        null,
        ''
      );
      setShowDetail(true);
    }
  }, [controlGroupsSuccess]);

  return (
    <>
      {showDetail ? (
        <ControlDetails />
      ) : (
        <div className="app-row1">
          <Row className="pb-2">
            <Colxx xxs="12">
              <div className="font-weight-bold mt-4 ml-4 align-items-center">
                <IntlMessages id={'CONTROL_GROUPS.CONTROL_GROUP_ALLOCATION'} />
              </div>
            </Colxx>
          </Row>
          <div className="tab-content control-tabContent">
            <Formik
              initialValues={initialValues}
              validationSchema={controlGroupsSchema}
              onSubmit={handleSubmit}
              validateOnBlur
              validateOnChange
              validateOnMount
            >
              {(form) => {
                return (
                  <Form>
                    <Colxx xxs="12">
                      <Row className="radio-select-background pt-4">
                        <Colxx xxs="10">
                          <FormGroupCoustom
                            dataTestId="audienceType"
                            noLable
                            type="radioMulti"
                            radioMultiOptions={selectAudienceRadioOptions}
                            value={form.values.controlGroups}
                            identifier={'controlGroups'}
                            className="select-audience"
                            onChange={(event) =>
                              form.setFieldValue(
                                'controlGroups',
                                event.target.value
                              )
                            }
                          />
                        </Colxx>
                      </Row>
                    </Colxx>
                    {form.values.controlGroups ===
                      ControlGroupsEnums.RANDOM && (
                      <Colxx xxs="12">
                        <Row className="pl-2 pt-2 page-background">
                          <Colxx xxs="12" md="4">
                            <div className="d-flex align-items-center justify-content between mr-2">
                              <span className="random">
                                <FormGroupCoustom
                                  type="number"
                                  noLable
                                  minNumberValue="0"
                                  identifierLabel="CONTROL_GROUPS.RANDOM"
                                  identifier={ControlGroupsEnums.RANDOM_FIELD}
                                  required={true}
                                  value={form.values.random}
                                  onChange={(e) => {
                                    if (e.target.value >= 0) {
                                      form.setFieldValue(
                                        'random',
                                        e.target.value
                                      );
                                    }
                                  }}
                                />
                              </span>
                              <span className="pl-2 pb-3">
                                <IntlMessages
                                  id={'CONTROL_GROUPS.PERCENTAGE_USERS'}
                                />
                              </span>
                            </div>
                          </Colxx>
                        </Row>
                      </Colxx>
                    )}
                    {form.values.controlGroups ===
                      ControlGroupsEnums.UPLOAD && (
                      <Colxx xxs="12">
                        <Row className="page-background">
                          <Colxx xxs="12">
                            <ControlGroupUploadCSV
                              getCVSFile={getCVSFile}
                              uploadedFile={uploadedFile}
                              headerKeys={headerKeys}
                            />
                          </Colxx>
                        </Row>
                      </Colxx>
                    )}
                    <div className="mt-2 ml-4">
                      <CustomInput
                        id="update-users"
                        name="update-users"
                        type="checkbox"
                        data-testid="check-update-users"
                        label={
                          <IntlMessages id="Apply Global Control Group to all existing campaigns" />
                        }
                      />
                    </div>
                    <div className="d-inline-flex mt-1 ml-4">
                      <CustomInput
                        id="update-users"
                        name="update-users"
                        type="checkbox"
                        data-testid="check-update-users"
                        label={
                          <IntlMessages id="Allow marketers to send campaigns to these users" />
                        }
                      />
                      <i
                        className="simple-icon-info mt-1 ml-2"
                        id="updateUserInfo"
                      />
                    </div>

                    <StepperNavigationButtons
                      className="m-2"
                      rightBtnLabel={
                        controlGroupID ? (
                          <IntlMessages id="CONTROL_GROUPS.UPDATE" />
                        ) : (
                          <IntlMessages id="CONTROL_GROUPS.SAVE" />
                        )
                      }
                      handleRightBtnClick={form.handleSubmit}
                    />
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};
const mapStateToProps = ({ controlGroupsApp }) => {
  const { controlGroups, controlGroupsSuccess } = controlGroupsApp;
  return {
    controlGroups,
    controlGroupsSuccess,
  };
};
export default connect(mapStateToProps, {
  createControlGroupsAction: createControlGroups,
})(ControlPage);
