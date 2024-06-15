import IntlMessages from 'helpers/IntlMessages';
import React from 'react';
import { Button } from 'reactstrap';
import '../../../assets/css/sass/views/campaign.scss';

const ScheduleAndGoalsCampaignBtnGroup = ({ btnLists, form, activeBtn }) => {
  const { setFieldValue } = form;
  return (
    <div className="schedule-campaign-btn-group">
      {btnLists.length > 0 &&
        btnLists.map((list) => {
          return (
            <Button
              key={list.value}
              className="mln-2"
              active={activeBtn === list.value}
              onClick={(event) => setFieldValue(list.id, event.target.value)}
              value={list.value}
              outline
              color="info"
            >
              <IntlMessages id={list.label} />
            </Button>
          );
        })}
    </div>
  );
};

export default ScheduleAndGoalsCampaignBtnGroup;
