import React, { useEffect, useState } from 'react';
import IntlMessages from 'helpers/IntlMessages';
import { Card, CardBody, Container, CustomInput, Input, Row } from 'reactstrap';
import { connect } from 'react-redux';
import {
  getColumnAttributeList,
  getImportUsersUploadData,
} from 'redux/actions';
import ImportUserEnums from 'enums/importUser/importUserEnums';

const ColumnCards = React.lazy(() => import('./ColumnCards'));

const MapUsers = ({
  headerKeys,
  userDetails,
  selectUser,
  colAttributesList,
  loadedColAttributes,
  getColumnAttributeListAction,
  getImportUsersUploadDataAction,
  skippedColumns,
  colAttributeWithType,
  checkColumnAttributes,
  selectedColumnType,
  customAttributeName,
  segmentName,
  showSegmentName,
  invalid,
  setInvalid,
}) => {
  const [showSkipCol, setShowSkipCol] = useState(false);
  const [updateInitialState, setUpdateInitialState] = useState(true);
  const colType = [
    {
      label: <IntlMessages id="IMPORT_USERS.COLUMN_TYPE_OPTIONS.STRING" />,
      value: 'string',
    },
    {
      label: <IntlMessages id="IMPORT_USERS.COLUMN_TYPE_OPTIONS.DATE_TIME" />,
      value: 'datetime',
    },
    {
      label: <IntlMessages id="IMPORT_USERS.COLUMN_TYPE_OPTIONS.NUMBER" />,
      value: 'number',
    },
    {
      label: <IntlMessages id="IMPORT_USERS.COLUMN_TYPE_OPTIONS.BOOLEAN" />,
      value: 'boolean',
    },
    {
      label: <IntlMessages id="IMPORT_USERS.COLUMN_TYPE_OPTIONS.DATE" />,
      value: 'date',
    },
  ];

  useEffect(() => {
    if (
      checkColumnAttributes &&
      !Array.isArray(checkColumnAttributes) &&
      Object.keys(checkColumnAttributes).length > 0 &&
      updateInitialState === true
    ) {
      if (selectUser === ImportUserEnums.REGISTERED) {
        getImportUsersUploadDataAction({
          colAttributeWithType: {
            ...colAttributeWithType,
            0: {
              [checkColumnAttributes[0]?.value]: checkColumnAttributes[0].type,
            },
          },
        });
        setUpdateInitialState(false);
      }
    }
  }, [checkColumnAttributes]);

  const handleColTypeAndColAttribute = (value) => {
    if (showSkipCol === false) {
      if (selectUser === ImportUserEnums.REGISTERED) {
        getImportUsersUploadDataAction({
          colAttributeWithType: {
            ...colAttributeWithType,
            0: {
              [checkColumnAttributes[0].value]: checkColumnAttributes[0].type,
            },
            ...value,
          },
        });
      } else {
        getImportUsersUploadDataAction({
          colAttributeWithType: { ...colAttributeWithType, ...value },
        });
      }
    }
  };

  const handleSkippedColumns = (colIndex) => {
    if (!skippedColumns.includes(colIndex)) {
      // eslint-disable-next-line no-unused-vars
      const { [colIndex]: selectedAttr, ...colAttributeWithTypeRest } =
        colAttributeWithType;
      getImportUsersUploadDataAction({
        skippedColumns: [...skippedColumns, colIndex],
        colAttributeWithType: colAttributeWithTypeRest,
      });
    } else {
      const colName =
        checkColumnAttributes[colIndex]?.value === ImportUserEnums.CUSTOM
          ? customAttributeName[colIndex]
          : checkColumnAttributes[colIndex]?.value;
      if (colName === undefined) {
        getImportUsersUploadDataAction({
          skippedColumns: skippedColumns.filter(
            (skipped) => skipped !== colIndex
          ),
        });
      } else {
        getImportUsersUploadDataAction({
          skippedColumns: skippedColumns.filter(
            (skipped) => skipped !== colIndex
          ),
          colAttributeWithType: {
            ...colAttributeWithType,
            ...{
              [colIndex]: {
                [colName]: selectedColumnType[colIndex]?.value,
              },
            },
          },
        });
      }
    }
  };

  const handleSegmentName = (e) => {
    getImportUsersUploadDataAction({ segmentName: e.target.value });
    if (e.target.value.match(/[*%]/)) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  };

  useEffect(() => {
    if (!loadedColAttributes && colAttributesList.length === 0) {
      getColumnAttributeListAction();
    }
  }, []);

  const handleShowSegmentName = (e) => {
    if (e.target.checked) {
      getImportUsersUploadDataAction({ showSegmentName: true });
    } else {
      getImportUsersUploadDataAction({
        showSegmentName: false,
        segmentName: '',
      });
    }
  };

  return (
    <Container className="container">
      <h2>
        <b>
          <IntlMessages id="IMPORT_USERS.MAP_CSV_DATA.MAP" />
        </b>
      </h2>
      <Card className="scrolling-wrapper white-card">
        <CardBody className="map-data-container">
          {headerKeys.length > 0 &&
            !showSkipCol &&
            headerKeys.map(
              (hname, i) =>
                !skippedColumns.includes(i) && (
                  <ColumnCards
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${hname}-${i}`}
                    headerName={hname}
                    csvHeaderKeys={headerKeys}
                    colIndex={i}
                    userDetails={userDetails}
                    handleSkippedColumns={handleSkippedColumns}
                    showSkipCol={showSkipCol}
                    selectUser={selectUser}
                    colAttributesList={colAttributesList}
                    colType={colType}
                    handleColTypeAndColAttribute={handleColTypeAndColAttribute}
                  />
                )
            )}

          {showSkipCol &&
            (skippedColumns.length > 0 ? (
              headerKeys.map(
                (hname, i) =>
                  skippedColumns.includes(i) && (
                    <ColumnCards
                      // eslint-disable-next-line react/no-array-index-key
                      key={`${hname}-${i}`}
                      csvHeaderKeys={headerKeys}
                      headerName={hname}
                      colIndex={i}
                      userDetails={userDetails}
                      handleSkippedColumns={handleSkippedColumns}
                      showSkipCol={showSkipCol}
                      selectUser={selectUser}
                      colAttributesList={colAttributesList}
                      colType={colType}
                      handleColTypeAndColAttribute={
                        handleColTypeAndColAttribute
                      }
                    />
                  )
              )
            ) : (
              <h4 className="message-popup">No data found</h4>
            ))}
        </CardBody>
      </Card>
      <Row className="show-skipped-col">
        <CustomInput
          data-testid="showSkippedColumns"
          id="show-skipped-col"
          name="show-skipped-col"
          type="checkbox"
          onChange={() => setShowSkipCol(!showSkipCol)}
          label={<IntlMessages id="IMPORT_USERS.CHECKBOXES.SKIPPED_COLUMNS" />}
        />
      </Row>
      <Row>
        <CustomInput
          data-testid="createCutsomSegment"
          id="create-custom-segment"
          name="create-custom-segment"
          type="checkbox"
          checked={showSegmentName}
          onChange={handleShowSegmentName}
          label={
            <IntlMessages id="IMPORT_USERS.CHECKBOXES.CREATE_CUSTOM_SEGMENTS" />
          }
        />
        {showSegmentName && (
          <Input
            data-testid="segmentName"
            id="custom-segment-name"
            name="custom-segment-name"
            placeholder="Enter Segment Name"
            type="text"
            value={segmentName}
            onChange={handleSegmentName}
            invalid={invalid}
          />
        )}
        {invalid && (
          <p className="error-msg">
            {' '}
            <IntlMessages id="IMPORT_USERS.ERROR_MSG.FILE_NAME_ERROR" />
          </p>
        )}
      </Row>
    </Container>
  );
};

const mapStateToProps = ({ importusersApp }) => {
  const {
    selectUser,
    colAttributesList,
    loadedColAttributes,
    skippedColumns,
    segmentName,
    showSegmentName,
    colAttributeWithType,
    checkColumnAttributes,
    selectedColumnType,
    customAttributeName,
  } = importusersApp;
  return {
    selectUser,
    colAttributesList,
    loadedColAttributes,
    skippedColumns,
    segmentName,
    showSegmentName,
    colAttributeWithType,
    checkColumnAttributes,
    selectedColumnType,
    customAttributeName,
  };
};

export default connect(mapStateToProps, {
  getColumnAttributeListAction: getColumnAttributeList,
  getImportUsersUploadDataAction: getImportUsersUploadData,
})(MapUsers);
