import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavItem, Badge } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import AddLabelModal from 'containers/settings/labels/AddLabelModal';
import { ThemeColors } from 'helpers/ThemeColors';
import IntlMessages from 'helpers/IntlMessages';
import { getLabels } from 'redux/actions';
import { adminRoot } from 'constants/defaultValues';
import CustomUncontrolledToolTip from 'components/CustomUncontrolledToolTip';
import { getCurrentUserAccount } from 'helpers/Utils';
import CommonEnums from 'enums/commonEnums';

const PrintLabelFilter = function ({
  c,
  listingFilter,
  addFilter,
  customLink,
}) {
  const isActive =
    listingFilter &&
    typeof listingFilter.labels === 'object' &&
    listingFilter.labels.length &&
    listingFilter.labels[0] === c.title;
  const navParam = {
    to: `${adminRoot}/contacts/list`,
    onClick: () => addFilter('labels', c.title),
  };
  if (customLink) {
    navParam.to = customLink(c);
  }
  return (
    <NavItem key={c.id} className={`mb-1 ${isActive ? 'active' : ''}`}>
      <NavLink {...navParam} data-testid={`labels_${c.title}`}>
        <div className="d-flex align-items-center">
          <span
            className="log-indicator align-middle mr-1 "
            style={{
              borderColor: c.color,
              backgroundColor: c.color,
            }}
          />
          <>
            <span className="labels-wrap" id={`tooltip-label-${c.id}`}>
              <CustomUncontrolledToolTip
                label={c.title}
                target={`tooltip-label-${c.id}`}
              />
              {c.title}
            </span>
          </>
        </div>
      </NavLink>
    </NavItem>
  );
};

const LabelsFilter = ({
  listingFilter,
  setListingFilter,
  labels,
  loadedLabels,
  getLabelsAction,
  customLink,
}) => {
  const [modalOpenLabel, setModalOpenLabel] = useState(false);
  const currentAccountDetails = getCurrentUserAccount();
  useEffect(() => {
    getLabelsAction();
  }, []);
  const addFilter = (column, value) => {
    setListingFilter({ [column]: [value] });
  };

  return (
    loadedLabels && (
      <>
        <div>
          <p className="text-muted text-small mb-1">
            <IntlMessages id="contacts.labels" />
          </p>
          <ul className="list-unstyled mb-1 ml-2 nav-effects-custom">
            {labels.map((c) => {
              return (
                c.show_on_sidebar && (
                  <PrintLabelFilter
                    key={c.id}
                    c={c}
                    listingFilter={listingFilter}
                    addFilter={addFilter}
                    customLink={customLink}
                  />
                )
              );
            })}
            {
              <PrintLabelFilter
                key="all"
                c={{
                  id: 'all',
                  title: 'all',
                  color: ThemeColors().primaryColor,
                }}
                listingFilter={listingFilter}
                addFilter={addFilter}
                customLink={customLink}
              />
            }
          </ul>
          {currentAccountDetails?.role !== CommonEnums.AGENT && (
            <Badge
              color="primary"
              pill
              onClick={() => {
                setModalOpenLabel(!modalOpenLabel);
              }}
              className="ml-2 c-pointer"
            >
              <i className="iconsminds-add mr-1" />
              <IntlMessages id="contacts.add-new-label-title" />
            </Badge>
          )}
        </div>

        <AddLabelModal
          modalOpen={modalOpenLabel}
          toggleModal={() => {
            setModalOpenLabel(!modalOpenLabel);
          }}
          editFormData={{}}
        />
      </>
    )
  );
};

const mapStateToProps = ({ labelsApp }) => {
  const { labels, loadedLabels } = labelsApp;
  return {
    labels,
    loadedLabels,
  };
};
export default connect(mapStateToProps, {
  getLabelsAction: getLabels,
})(LabelsFilter);
