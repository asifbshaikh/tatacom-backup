import { ThemeColors } from 'helpers/ThemeColors';

const colors = ThemeColors();

export const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'white' : 'black',
    backgroundColor: state.isSelected ? colors.themeColor1 : 'white',
    paddingLeft: '15%',
  }),
  groupHeading: (provided) => ({
    ...provided,
    fontweight: 'bold',
    color: 'black',
    fontSize: '16px',
  }),
};

export const operationDropDownCustomStyles = {
  control: (provided) => ({
    ...provided,
    width: '40%',
    margin: 'auto',
    right: '90%',
  }),
  container: (provided) => ({
    ...provided,
    width: '40%',
    margin: 'auto',
  }),
  menu: (provided) => ({
    ...provided,
    width: '40%',
    position: 'absolute',
    right: '120%',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: '1px',
  }),
};
