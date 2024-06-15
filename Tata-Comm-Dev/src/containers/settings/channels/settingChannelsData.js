import { reactSelectStyles } from 'data/segments/createSegmentFilterData';

export const reactSelectWeekDaysList = [
  { label: 'Sun', value: 'Sunday' },
  { label: 'Mon', value: 'Monday' },
  { label: 'Tue', value: 'Tuesday' },
  { label: 'Wed', value: 'Wednesday' },
  { label: 'Thu', value: 'Thursday' },
  { label: 'Fri', value: 'Friday' },
  { label: 'Sat', value: 'Saturday' },
];

export const reactSelectDaysStyles = {
  ...reactSelectStyles,
  control: (base, { isDisabled }) => {
    return {
      ...base,
      minWidth: 'inherit',
      width: 'inherit',
      minHeight: '31px',
      border: '1px solid #9d9fa1',
      '&:hover': {
        borderColor: '#e8e8e8',
        boxShadow: '0 0 0 1px #e8e8e8',
      },
      '&:focus': {
        borderColor: '#e8e8e8',
        boxShadow: '0 0 0 1px #e8e8e8',
      },
      '&:focus-within': {
        border: '1px solid #9d9fa1',
        borderColor: '#e8e8e8',
        boxShadow: '0 0 0 1px #e8e8e8',
      },
      background: isDisabled ? '#e8e8e8' : '#fff',
    };
  },
  option: (base) => {
    return {
      ...base,
      '&:focus': {
        backgroundColor: '#E95420',
      },
      '&:hover': {
        backgroundColor: '#E95420',
      },
    };
  },
  container: (base) => ({
    ...base,
    minWidth: 'inherit',
    width: 'inherit',
    minHeight: '31px',
  }),
  placeholder: (base) => ({
    ...base,
    display: 'none',
  }),
};
