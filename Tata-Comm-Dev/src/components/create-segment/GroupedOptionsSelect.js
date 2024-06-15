import React, { useEffect, useState } from 'react';
import { CustomInput } from 'reactstrap';
import '../../assets/css/sass/views/campaign.scss';
import Select, { components } from 'react-select';
import { reactSelectStyles } from 'data/segments/createSegmentFilterData';
import { injectIntl } from 'react-intl';

const InputOption = ({
  selectProps,
  data,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  let bg = 'transparent';
  if (isFocused) bg = '#f2d2d2';
  if (isActive) bg = '#d63548';

  const style = {
    alignItems: 'center',
    backgroundColor: bg,
    color: 'inherit',
    display: 'flex',
  };

  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style,
  };
  return (
    <>
      {data.value && (
        <components.Option
          {...rest}
          isDisabled={isDisabled}
          isFocused={isFocused}
          isSelected={isSelected}
          innerProps={props}
        >
          <CustomInput
            id={data.value}
            type="checkbox"
            checked={isSelected}
            onChange={() => null}
          />
          {children}
        </components.Option>
      )}
    </>
  );
};

const GroupedOptionsSelect = ({
  data,
  intl,
  groupedOptionsValue,
  optionType = 'grouped',
  optionIdentifier,
  handleOnChangeDropDown,
  isCheckboxMultiSelect = false,
  fieldLabel = 'name',
  fieldGroupedLabel = 'category',
  handleOnBlur,
  ariaLabel = 'react-select',
  handleOnFocus,
}) => {
  const [groupedOptions, setGroupedOptions] = useState([]);
  const [optionsList, setOptionsList] = useState([]);

  const { messages: messagesIntl } = intl;

  useEffect(() => {
    if (data?.length > 0) {
      if (optionType === 'grouped') {
        /* eslint-disable no-param-reassign */
        const allCategories = data.reduce((result, currentObj) => {
          const { category } = currentObj;
          if (!result[category]) {
            result[category] = [];
          }

          result[category].push({
            category: currentObj.category,
            label:
              typeof messagesIntl[currentObj[optionIdentifier.label]] !==
              'undefined'
                ? messagesIntl[currentObj[optionIdentifier.label]]
                : currentObj[optionIdentifier.label],
            value:
              typeof messagesIntl[currentObj[optionIdentifier.value]] !==
              'undefined'
                ? messagesIntl[currentObj[optionIdentifier.value]]
                : currentObj[optionIdentifier.value],
          });
          return result;
        }, {});
        /* eslint-enable no-param-reassign */
        const groupedOptionsList = Object.entries(allCategories).map(
          ([key, obj]) => {
            return { label: key, options: obj };
          }
        );
        setGroupedOptions(groupedOptionsList);
      } else {
        const optionsList = data?.map((item) => {
          return {
            label:
              typeof messagesIntl[item[optionIdentifier.label]] !== 'undefined'
                ? messagesIntl[item[optionIdentifier.label]]
                : item[optionIdentifier.label],
            value:
              typeof messagesIntl[item[optionIdentifier.value]] !== 'undefined'
                ? messagesIntl[item[optionIdentifier.value]]
                : item[optionIdentifier.value],
          };
        });
        setOptionsList(optionsList);
      }
    } else {
      setOptionsList([]);
      setGroupedOptions([]);
    }
  }, [data]);

  const formatGroupLabel = (data) => {
    return (
      <div className="react-grouped-with-count">
        <span>{data.label}</span>
        <span>{data.options.length}</span>
      </div>
    );
  };

  const getGroupedDropDownValue = () => {
    let optionsByCategory = [];
    let selectedValues = [];
    if (Array.isArray(groupedOptionsValue[fieldGroupedLabel])) {
      optionsByCategory = groupedOptions.filter((groupedOption) => {
        return groupedOptionsValue[fieldGroupedLabel].includes(
          groupedOption.label
        );
      });
      selectedValues = !optionsByCategory
        ? []
        : optionsByCategory.options?.filter((option) => {
            return groupedOptionsValue[fieldLabel].includes(option.value);
          });
    } else {
      optionsByCategory = groupedOptions.find((options) => {
        return options.label === groupedOptionsValue[fieldGroupedLabel];
      });
      selectedValues = !optionsByCategory
        ? []
        : optionsByCategory.options.filter((option) => {
            return option.value === groupedOptionsValue[fieldLabel];
          });
    }
    return selectedValues;
  };
  const getDropDownValue = () => {
    return Array.isArray(groupedOptionsValue[fieldLabel])
      ? optionsList.filter((option) => {
          return groupedOptionsValue[fieldLabel].includes(option.value);
        })
      : optionsList.filter((option) => {
          return (
            option.value && option.value === groupedOptionsValue[fieldLabel]
          );
        });
  };

  const multiValueContainer = ({ data }) => {
    const label = data.label;
    const val = `${label}${label && ', '} `;
    return val;
  };

  const extraParams = {};
  if (isCheckboxMultiSelect) {
    extraParams.isMulti = true;
    extraParams.closeMenuOnSelect = false;
    extraParams.hideSelectedOptions = false;
    extraParams.styles = reactSelectStyles;
    extraParams.components = {
      Option: InputOption,
      MultiValueContainer: multiValueContainer,
    };
  }

  return (
    <>
      {optionType === 'grouped' ? (
        <Select
          aria-label={ariaLabel}
          options={groupedOptions}
          isSearchable
          formatGroupLabel={formatGroupLabel}
          value={getGroupedDropDownValue()}
          onChange={handleOnChangeDropDown}
          styles={reactSelectStyles}
          onFocus={handleOnFocus}
          onBlur={() => {
            handleOnBlur();
          }}
          {...extraParams}
        />
      ) : (
        <Select
          className="basic-single"
          aria-label={ariaLabel}
          isSearchable
          value={getDropDownValue()}
          onChange={handleOnChangeDropDown}
          options={optionsList}
          styles={reactSelectStyles}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          {...extraParams}
        />
      )}
    </>
  );
};

export default injectIntl(GroupedOptionsSelect);
