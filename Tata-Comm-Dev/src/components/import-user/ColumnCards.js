import {
  Card,
  CardBody,
  CardLink,
  CardText,
  CardTitle,
  Input,
  ListGroup,
  FormGroup,
  ListGroupItem,
  Label,
} from 'reactstrap';
import Select from 'react-select';
import React, { useEffect, useState } from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { connect } from 'react-redux';
import { getImportUsersUploadData } from 'redux/actions';
import ImportUserEnums from 'enums/importUser/importUserEnums';

const ColumnCards = ({
  headerName,
  colIndex,
  userDetails,
  handleSkippedColumns,
  showSkipCol,
  selectUser,
  colAttributesList,
  colType,
  handleColTypeAndColAttribute,
  getImportUsersUploadDataAction,
  newCustomAttributes,
  columnAttributeOptions,
  firstRowHeaders,
  checkColumnAttributes,
  selectedColumnType,
  customAttributeName,
  csvHeaderKeys,
  skippedColumns,
}) => {
  const [selectedColType, setSelectedColType] = useState('');
  const [showCustAttributeName, setShowCustAttributeName] = useState(false);
  const [custAttributeName, setCustAttributeName] = useState('');
  const [error, setError] = useState({});
  const [disableTypeDropdown, setDisableTypeDropdown] = useState(true);
  const [disableCustomerId, setDisableCustomerId] = useState(false);

  const getDropDownValues = () => {
    const arr = [{ label: 'Custom', value: 'custom', isdisabled: false }];
    Object.keys(colAttributesList).map((data) => {
      return arr.push({
        label: colAttributesList[data].name,
        value: data,
        isdisabled: false,
        type:
          colAttributesList[data].type !== ImportUserEnums.INTEGER
            ? colAttributesList[data].type
            : 'number',
      });
    });
    return arr;
  };

  useEffect(() => {
    if (
      columnAttributeOptions.length === 0 ||
      columnAttributeOptions.length === 1
    ) {
      getImportUsersUploadDataAction({
        columnAttributeOptions: getDropDownValues(),
      });
    }

    if (checkColumnAttributes[colIndex]?.value === ImportUserEnums.CUSTOM) {
      setDisableTypeDropdown(false);
    }
  }, [colAttributesList, columnAttributeOptions]);

  const emailIntl = <IntlMessages id="IMPORT_USERS.COLUMN_CARDS.EMAIL" />;
  const phoneNoIntl = (
    <IntlMessages id="IMPORT_USERS.COLUMN_CARDS.PHONE_NUMBER" />
  );
  const custIdIntl = <IntlMessages id="IMPORT_USERS.COLUMN_CARDS.CUST_ID" />;
  const stringIntl = <IntlMessages id="IMPORT_USERS.COLUMN_CARDS.STRING" />;

  useEffect(() => {
    let initialColumnAttributes = {
      0: {
        label: emailIntl,
        value: ImportUserEnums.EMAIL,
        isdisabled: true,
        type: 'string',
      },
      1: {
        label: phoneNoIntl,
        value: ImportUserEnums.PHONE_NUMBER,
        isdisabled: true,
        type: 'string',
      },
    };
    let initialColumnType = {
      0: {
        label: stringIntl,
        value: 'string',
      },
      1: {
        label: stringIntl,
        value: 'string',
      },
    };
    let initialColAttributeWithType = {};

    if (selectUser === ImportUserEnums.REGISTERED) {
      initialColumnAttributes = {
        0: {
          label: custIdIntl,
          value: ImportUserEnums.CUSTOMER_ID,
          isdisabled: true,
          type: 'string',
        },
      };
      initialColumnType = {
        0: {
          label: stringIntl,
          value: 'string',
        },
      };
      let initialColAttributeWithType = {
        0: { customer_id: 'string' },
      };

      let registeredAllData =
        columnAttributeOptions.length > 1
          ? columnAttributeOptions
          : getDropDownValues();

      if (registeredAllData && registeredAllData.length > 1) {
        csvHeaderKeys.forEach((key, index) => {
          const result = registeredAllData?.find((data) => {
            return data.label == key;
          });
          if (result) {
            initialColumnType[index] = {
              label: result.type,
              value: result.type,
            };
            initialColumnAttributes[index] = result;
            initialColAttributeWithType[index] = {
              [result['value']]: result['type'],
            };
          }
        });
      }

      if (skippedColumns.length > 0) {
        skippedColumns.forEach((item) => {
          if (initialColAttributeWithType[item]) {
            delete initialColAttributeWithType[item];
          }
        });
      }

      const updatedColumnType =
        Object.values(selectedColumnType)?.length > 1
          ? selectedColumnType
          : initialColumnType;
      const updatedColumnAttributes =
        Object.values(checkColumnAttributes)?.length > 1
          ? checkColumnAttributes
          : initialColumnAttributes;

      getImportUsersUploadDataAction({
        checkColumnAttributes: {
          ...updatedColumnAttributes,
        },
        selectedColumnType: {
          ...updatedColumnType,
        },
        colAttributeWithType: {
          ...initialColAttributeWithType,
        },
      });

      setDisableCustomerId(true);

      if (colIndex !== 0) {
        setDisableCustomerId(false);
      }
    }

    if (selectUser === ImportUserEnums.ANONYMOUS) {
      let allDataAnonymous =
        columnAttributeOptions.length > 2
          ? columnAttributeOptions
          : getDropDownValues();

      if (allDataAnonymous && allDataAnonymous.length > 2) {
        allDataAnonymous = allDataAnonymous.filter((obj) => {
          return (
            obj.label !== ImportUserEnums.EMAIL_CONDITION &&
            obj.label !== ImportUserEnums.PHONE_NO_CONDITION
          );
        });

        csvHeaderKeys.forEach((key, index) => {
          const val = allDataAnonymous?.find((data) => {
            return data.label == key;
          });
          if (val) {
            initialColumnType[index] = {
              label: val.type,
              value: val.type,
            };
            initialColumnAttributes[index] = val;
            initialColAttributeWithType[index] = {
              [val['value']]: val['type'],
            };
          }
        });
      }

      if (skippedColumns.length > 0) {
        skippedColumns.forEach((item) => {
          if (initialColAttributeWithType[item]) {
            delete initialColAttributeWithType[item];
          }
        });
      }

      const updatedColumnType =
        Object.values(selectedColumnType)?.length > 2
          ? selectedColumnType
          : initialColumnType;
      const updatedColumnAttributes =
        Object.values(checkColumnAttributes)?.length > 2
          ? checkColumnAttributes
          : initialColumnAttributes;

      getImportUsersUploadDataAction({
        selectedColumnType: {
          ...updatedColumnType,
        },
        checkColumnAttributes: {
          ...updatedColumnAttributes,
        },
        colAttributeWithType: {
          ...initialColAttributeWithType,
        },
      });
      if (colIndex !== 0 && colIndex !== 1) {
        setDisableCustomerId(false);
      } else {
        setDisableCustomerId(true);
      }
    }
  }, [colAttributesList]);

  const filterTypeOption = (event) => {
    return colType.filter((item) => item.value === event.type);
  };

  useEffect(() => {
    const options = Object.values(checkColumnAttributes);
    const opts = columnAttributeOptions.map((val) => {
      const updatedAttributes = options.find(
        (option) => option?.value === val?.value
      );
      if (updatedAttributes) {
        if (val.value === 'custom') {
          return { ...val, isdisabled: false };
        }
        return { ...val, isdisabled: true };
      }
      return { ...val, isdisabled: false };
    });
    getImportUsersUploadDataAction({ columnAttributeOptions: opts });
  }, [checkColumnAttributes, selectedColumnType]);

  const handleTypeSelect = (e) => {
    setSelectedColType(e);
    getImportUsersUploadDataAction({
      selectedColumnType: { ...selectedColumnType, [colIndex]: e },
    });
  };

  const handleCustAtrribute = (e) => {
    const index = getDropDownValues().findIndex(
      (option) => option.value === e.value
    );
    if (e.value !== ImportUserEnums.CUSTOM) {
      const columnOptions = [...columnAttributeOptions];
      columnOptions[index].isdisabled = false;
      getImportUsersUploadDataAction({ columnAttributeOptions: columnOptions });
      getImportUsersUploadDataAction({
        selectedColumnType: {
          ...selectedColumnType,
          [colIndex]: filterTypeOption(e)[0],
        },
      });
      getImportUsersUploadDataAction({
        checkColumnAttributes: {
          ...checkColumnAttributes,
          [colIndex]: columnOptions[index],
        },
      });

      setSelectedColType(filterTypeOption(e));
      setDisableTypeDropdown(true);
    }
    if (e.value === ImportUserEnums.CUSTOM) {
      const columnOptions = [...columnAttributeOptions];
      columnOptions[index].isdisabled = false;
      getImportUsersUploadDataAction({ columnAttributeOptions: columnOptions });
      getImportUsersUploadDataAction({
        checkColumnAttributes: {
          ...checkColumnAttributes,
          [colIndex]: columnOptions[index],
        },
      });
      setShowCustAttributeName(true);
      getImportUsersUploadDataAction({
        selectedColumnType: {
          ...selectedColumnType,
          [colIndex]: {
            label: '',
            value: '',
          },
        },
      });
      setSelectedColType({
        label: '',
        value: '',
      });
      setDisableTypeDropdown(false);
    }
  };

  const createCustomSegment = () => {
    setShowCustAttributeName(true);
  };

  const addCustomAttributeName = (e) => {
    setCustAttributeName(e.target.value);
    getImportUsersUploadDataAction({
      customAttributeName: {
        ...customAttributeName,
        [colIndex]: e.target.value,
      },
    });
  };

  const handleAddCustomAttribute = () => {
    if (!customAttributeName[colIndex]) {
      setError({
        message: (
          <IntlMessages id="IMPORT_USERS.ERROR_MSG.CUSTOM_ATTRIBUTE_NAME_REQUIRED" />
        ),
      });
      return;
    }
    const optionValues = Object.keys(colAttributesList).map((key) =>
      colAttributesList[key].name.toLowerCase()
    );
    const existingCustomKeys = Object.keys(customAttributeName);
    const existingCustomAttributes = existingCustomKeys.reduce((acc, item) => {
      if (parseInt(item, 10) !== colIndex) {
        return [...acc, customAttributeName[item].toLowerCase()];
      }
      return acc;
    }, []);
    const lowerCustName = custAttributeName.toLowerCase();
    if (
      optionValues.includes(lowerCustName) ||
      existingCustomAttributes.includes(lowerCustName)
    ) {
      setError({
        message: (
          <IntlMessages id="IMPORT_USERS.ERROR_MSG.ATTRIBUTE_ALREADY_EXISTS" />
        ),
      });
      return;
    }

    getImportUsersUploadDataAction({
      newCustomAttributes: [...newCustomAttributes, custAttributeName],
    });
    setShowCustAttributeName(false);
  };

  useEffect(() => {
    if (checkColumnAttributes[colIndex]?.value === ImportUserEnums.CUSTOM) {
      if (selectedColType.value === '') {
        setError({
          type: <IntlMessages id="IMPORT_USERS.ERROR_MSG.SELECT_TYPE" />,
          name: (
            <IntlMessages id="IMPORT_USERS.ERROR_MSG.SET_CUSTOM_ATTRIBUTE" />
          ),
        });
      } else {
        setError({});
        handleColTypeAndColAttribute(
          {
            [colIndex]: {
              [customAttributeName[colIndex] !== ''
                ? customAttributeName[colIndex]
                : headerName]: selectedColumnType[colIndex]?.value,
            },
          },
          colIndex
        );
      }
    } else if (selectedColType.length > 0) {
      if (
        checkColumnAttributes[colIndex]?.value &&
        selectedColumnType[colIndex].value
      ) {
        setError({});
        handleColTypeAndColAttribute(
          {
            [colIndex]: {
              [checkColumnAttributes[colIndex]?.value]:
                selectedColumnType[colIndex].value,
            },
          },
          colIndex
        );
      } else {
        setError({});
      }
    }
  }, [selectedColType, checkColumnAttributes[colIndex]]);

  return (
    <Colxx xxs="12" sm="6" md="6" lg="4" xl="4">
      <Card className="map-data">
        <CardBody>
          <CardText>
            <IntlMessages id="IMPORT_USERS.MAP_CSV_DATA.MAP_COLUMN" />
          </CardText>
          <div className="csv-columns">
            {showCustAttributeName &&
            checkColumnAttributes[colIndex]?.value ===
              ImportUserEnums.CUSTOM ? (
              <div>
                <Input
                  data-testid="customAttributName"
                  className="add-custom-attribute"
                  id="custom-attribute-name"
                  name="custom-attribute-name"
                  placeholder="Enter Custom Attribute Name"
                  type="text"
                  onChange={addCustomAttributeName}
                  defaultValue={custAttributeName}
                />
                {error.message && (
                  <span className="error-msg">{error.message}</span>
                )}
              </div>
            ) : (
              <div className="text">
                <CardTitle tag="h6" className="font-weight-bold">
                  {checkColumnAttributes[colIndex]?.value ===
                  ImportUserEnums.CUSTOM ? (
                    <>
                      {customAttributeName[colIndex] ? (
                        customAttributeName[colIndex]
                      ) : (
                        <>
                          {firstRowHeaders ? (
                            <>
                              {!checkColumnAttributes[colIndex]?.value
                                ? headerName
                                : checkColumnAttributes[colIndex]?.label}
                            </>
                          ) : (
                            checkColumnAttributes[colIndex]?.label
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {firstRowHeaders ? (
                        <>
                          {!checkColumnAttributes[colIndex]?.value
                            ? headerName
                            : checkColumnAttributes[colIndex]?.label}
                        </>
                      ) : (
                        checkColumnAttributes[colIndex]?.label
                      )}
                    </>
                  )}
                </CardTitle>
              </div>
            )}
            {checkColumnAttributes[colIndex]?.value ===
              ImportUserEnums.CUSTOM && (
              <div className="icons">
                {!showCustAttributeName ? (
                  <i
                    className="iconsminds-close"
                    onClick={createCustomSegment}
                    tabIndex="0"
                    data-testid="createCustomSegment"
                    role="button"
                  />
                ) : (
                  <i
                    className="iconsminds-add"
                    onClick={handleAddCustomAttribute}
                    tabIndex="0"
                    data-testid="addCustomAttribute"
                    role="button"
                  />
                )}
              </div>
            )}
          </div>
          <div>
            <Select
              aria-label={headerName}
              className="custom-attribute-list"
              options={columnAttributeOptions}
              isOptionDisabled={(option) => option.isdisabled}
              placeholder={
                <IntlMessages id="IMPORT_USERS.PLACEHOLDER.SELECT_ATTRIBUTE" />
              }
              onChange={(e) => handleCustAtrribute(e)}
              defaultValue={
                Object.prototype.hasOwnProperty.call(
                  checkColumnAttributes,
                  colIndex
                ) && checkColumnAttributes[colIndex]
              }
              value={
                colIndex === 0 && selectUser === ImportUserEnums.REGISTERED
                  ? {
                      label: custIdIntl,
                      value: ImportUserEnums.CUSTOMER_ID,
                      isdisabled: true,
                      type: 'string',
                    }
                  : colIndex === 0 && selectUser === ImportUserEnums.ANONYMOUS
                  ? {
                      label: emailIntl,
                      value: ImportUserEnums.EMAIL,
                      isdisabled: true,
                      type: 'string',
                    }
                  : colIndex === 1 && selectUser === ImportUserEnums.ANONYMOUS
                  ? {
                      label: phoneNoIntl,
                      value: ImportUserEnums.PHONE_NUMBER,
                      isdisabled: true,
                      type: 'string',
                    }
                  : (colIndex > 0 &&
                      selectUser === ImportUserEnums.REGISTERED) ||
                    (colIndex > 1 && selectUser === ImportUserEnums.ANONYMOUS)
                  ? checkColumnAttributes[colIndex]?.value && {
                      label: !checkColumnAttributes[colIndex]?.value
                        ? headerName
                        : checkColumnAttributes[colIndex]?.label,
                      value: columnAttributeOptions.find((data) => {
                        return data.label === headerName;
                      })?.value,
                      isdisabled: true,
                      type: columnAttributeOptions.find((data) => {
                        return data.label === headerName;
                      })?.type,
                    }
                  : Object.prototype.hasOwnProperty.call(
                      checkColumnAttributes,
                      colIndex
                    ) && checkColumnAttributes[colIndex]
              }
              isDisabled={disableCustomerId}
            />
            {error.name ? (
              <span className="error-msg">{error.name}</span>
            ) : (
              <></>
            )}
          </div>

          <Select
            aria-label={`${headerName}_selectType`}
            className={`custom-attribute-list ${
              disableTypeDropdown ? 'disabled-dropdown' : ''
            }`}
            classNamePrefix="react-select"
            options={colType.map((val, _i) => {
              return { value: val.value, label: val.label, key: _i };
            })}
            placeholder={
              <IntlMessages id="IMPORT_USERS.PLACEHOLDER.SELECT_TYPE" />
            }
            onChange={handleTypeSelect}
            defaultValue={
              Object.prototype.hasOwnProperty.call(
                selectedColumnType,
                colIndex
              ) && selectedColumnType[colIndex]
            }
            value={
              Object.prototype.hasOwnProperty.call(
                selectedColumnType,
                colIndex
              ) && selectedColumnType[colIndex]
            }
            isDisabled={disableTypeDropdown}
          />
          {error.type && <span className="error-msg">{error.type}</span>}
          {!showSkipCol ? (
            <>
              {(selectUser === ImportUserEnums.REGISTERED &&
                checkColumnAttributes[colIndex]?.value !==
                  ImportUserEnums.CUSTOMER_ID) ||
              (selectUser === ImportUserEnums.ANONYMOUS &&
                checkColumnAttributes[colIndex]?.value !==
                  ImportUserEnums.EMAIL &&
                checkColumnAttributes[colIndex]?.value !==
                  ImportUserEnums.PHONE_NUMBER) ? (
                <CardLink
                  data-testid={headerName}
                  className="skip-column"
                  onClick={() => handleSkippedColumns(colIndex)}
                >
                  <IntlMessages id="IMPORT_USERS.MAP_CSV_DATA.SKIP_COLUMN" />
                </CardLink>
              ) : (
                <div className="custom-col-empty-div"> </div>
              )}
            </>
          ) : (
            <CardLink
              className="include-skip-column"
              onClick={() => handleSkippedColumns(colIndex)}
            >
              <IntlMessages id="IMPORT_USERS.MAP_CSV_DATA.ADD_SKIPPED_COLUMN" />
            </CardLink>
          )}

          {selectUser === ImportUserEnums.ANONYMOUS &&
          (checkColumnAttributes[colIndex]?.value === ImportUserEnums.EMAIL ||
            checkColumnAttributes[colIndex]?.value ===
              ImportUserEnums.PHONE_NUMBER) ? (
            <FormGroup check className="identifier-checkbox">
              <Label className="anonymous-id">
                <IntlMessages id="IMPORT_USERS.CHECKBOXES.ANONYMOUS_IDENTIFIER" />
              </Label>
            </FormGroup>
          ) : (
            <div className="custom-empty-col"> </div>
          )}
        </CardBody>
        <ListGroup flush>
          <ListGroupItem className="list-header">
            {checkColumnAttributes[colIndex]?.value ===
            ImportUserEnums.CUSTOM ? (
              <>
                {customAttributeName[colIndex] ? (
                  customAttributeName[colIndex]
                ) : (
                  <>
                    {firstRowHeaders ? (
                      <>
                        {!checkColumnAttributes[colIndex]?.value
                          ? headerName
                          : headerName}
                      </>
                    ) : (
                      checkColumnAttributes[colIndex]?.label
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {firstRowHeaders ? (
                  <>
                    {!checkColumnAttributes[colIndex]?.value
                      ? headerName
                      : headerName}
                  </>
                ) : (
                  checkColumnAttributes[colIndex]?.label
                )}
              </>
            )}
          </ListGroupItem>
          {userDetails.length > 0 &&
            userDetails.map((e, _i) => (
              <ListGroupItem className="list-items" key={`${e}-${_i}`}>
                {e[headerName]?.replace(/["]/g, '')}
              </ListGroupItem>
            ))}
        </ListGroup>
      </Card>
    </Colxx>
  );
};

const mapStateToProps = ({ importusersApp }) => {
  const {
    loadedColAttributes,
    newCustomAttributes,
    selectedCheckbox,
    columnAttributeOptions,
    firstRowHeaders,
    colAttributeWithType,
    checkColumnAttributes,
    selectedColumnType,
    customAttributeName,
    skippedColumns,
  } = importusersApp;
  return {
    loadedColAttributes,
    newCustomAttributes,
    selectedCheckbox,
    columnAttributeOptions,
    firstRowHeaders,
    colAttributeWithType,
    checkColumnAttributes,
    selectedColumnType,
    customAttributeName,
    skippedColumns,
  };
};

export default connect(mapStateToProps, {
  getImportUsersUploadDataAction: getImportUsersUploadData,
})(ColumnCards);
