import React, { useState, useEffect } from 'react';
import Switch from 'rc-switch';
import 'rc-switch/assets/index.css';

const ToggleSwitch = ({ setSwitchChecked, switchChecked }) => {
  const changeMode = () => {
    setSwitchChecked(!switchChecked);
  };

  return (
    <div className="d-none d-md-inline-block align-middle mr-3">
      <Switch
        id="tooltip_switch"
        className="custom-switch custom-switch-primary custom-switch-small"
        checked={switchChecked}
        onChange={changeMode}
      />
    </div>
  );
};
export default ToggleSwitch;
