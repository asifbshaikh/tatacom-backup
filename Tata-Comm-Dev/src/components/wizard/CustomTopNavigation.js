/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import CampaignRoutesEnums from 'enums/campaigns/campaignRoutesEnums';
import React, { useEffect } from 'react';
import { WithWizard, withWizard } from 'react-albus';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

const CustomTopNavigation = ({
  className,
  disableNav,
  topNavClick,
  wizard,
}) => {
  const location = useLocation();

  useEffect(() => {
    return () => {
      wizard.push(CampaignRoutesEnums.SELECT_CHANNEL);
    };
  }, [location.key]);

  const getClassName = (steps, step, index, stepItem) => {
    if (steps.indexOf(step) === index) {
      return 'step-doing';
    }
    if (steps.indexOf(step) > index) {
      stepItem.isDone = true;
      return 'step-done';
    }
    return 'step';
  };

  const itemClick = (steps, step, stepItem, push) => {
    if (disableNav) {
      return;
    }
    topNavClick(steps, step, stepItem, push);
  };

  return (
    <WithWizard
      render={({ next, previous, step, steps, go, push }) => (
        <ul
          className={`nav nav-tabs ${className}${
            disableNav ? ' disabled' : ''
          }`}
        >
          {steps.map((stepItem, index) => {
            if (!stepItem.hideTopNav) {
              return (
                <li
                  key={`topNavStep_${index}`}
                  className={`nav-item ${getClassName(
                    steps,
                    step,
                    index,
                    stepItem
                  )}`}
                >
                  <NavLink
                    to="#"
                    location={{}}
                    className="nav-link"
                    onClick={() => itemClick(steps, step, stepItem, push)}
                  >
                    <span>{stepItem.name}</span>
                    <small>{stepItem.desc}</small>
                  </NavLink>
                </li>
              );
            }
            return <span key={`topNavStep_${index}`} />;
          })}
        </ul>
      )}
    />
  );
};

export default withWizard(CustomTopNavigation);
