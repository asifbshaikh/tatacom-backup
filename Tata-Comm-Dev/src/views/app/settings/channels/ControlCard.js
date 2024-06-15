import { Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import moment from 'moment';
import ControlGroupsEnums from 'enums/controlgroups/controlgroupsEnums';

const ControlCard = ({ controlGroupDetails }) => {
  return (
    <>
      <div>
        <Row>
          <Colxx xxs="12" md="10">
            <div className="pt-3 pl-3">
              <h2 color="muted font-weight-bold">
                <IntlMessages id="CONTROL_GROUPS.GENERAL_INFO" />
              </h2>
            </div>
          </Colxx>
        </Row>
        <Colxx xxs="12" className="mt-3">
          <div className="controlTableStyle">
            <div className="controlTableSegmentStyle">
              <IntlMessages id="CONTROL_GROUPS.USERS_DEFINED" />
            </div>
            <div className="controlTableSegmentStyle">
              {controlGroupDetails[0]?.global_control_group?.control_group ===
              ControlGroupsEnums.RANDOM_ALLOCATION ? (
                <span>
                  <IntlMessages id={'CONTROL_GROUPS.RANDOM'} />
                  <span className="pl-1 pr-1">
                    {
                      controlGroupDetails[0]?.global_control_group
                        ?.random_allocation_percentage
                    }
                  </span>
                  <IntlMessages id={'CONTROL_GROUPS.PERCENTAGE'} />
                </span>
              ) : (
                <IntlMessages id="CONTROL_GROUPS.UPLOAD" />
              )}
            </div>
            <div className="controlTableSegmentStyle">
              <IntlMessages id="CONTROL_GROUPS.NUMBER_USERS" />
            </div>
            <div className="controlTableSegmentStyle"></div>
            <div className="controlTableSegmentStyle">
              <IntlMessages id="CONTROL_GROUPS.CREATED" />
            </div>
            <div className="controlTableSegmentStyle">
              {moment(
                controlGroupDetails[0]?.global_control_group?.created_at
              ).format('DD MMMM YYYY')}
            </div>
            <div className="controlTableSegmentStyle">
              <IntlMessages id="CONTROL_GROUPS.CREATED_BY" />
            </div>
            <div className="controlTableSegmentStyle"></div>
          </div>
        </Colxx>
      </div>
      <div className="mt-2">
        <Row>
          <Colxx xxs="12" md="10">
            <div className="pt-3 pl-3">
              <h2 color="muted font-weight-bold">
                <IntlMessages id="CONTROL_GROUPS.CONTROL_GROUP_CAMPAIGN" />
              </h2>
            </div>
          </Colxx>
        </Row>
        <Colxx xxs="12" className="mt-3">
          <div className="controlTableStyle">
            <div className="controlTableSegmentStyle">
              <IntlMessages id="CONTROL_GROUPS.RUNNING_CAMPAIGNS_WITH" />
            </div>
            <div className="controlTableSegmentStyle"></div>
            <div className="controlTableSegmentStyle">
              <IntlMessages id="CONTROL_GROUPS.RUNNING_CAMPAIGNS_WITHOUT" />
            </div>
            <div className="controlTableSegmentStyle"></div>
          </div>
        </Colxx>
      </div>
    </>
  );
};

export default ControlCard;
