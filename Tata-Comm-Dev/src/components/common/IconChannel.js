import React from 'react';

import { getTringLogoByKey } from 'helpers/TringIconHelper';

const IconChannel = ({
  channelType,
  channelName,
  phoneNumber,
  widthheight,
  width,
  height,
  className,
}) => {
  const widthheightset = widthheight || '12';
  const iconPath = getTringLogoByKey(channelType, phoneNumber);
  const iconPathArray = typeof iconPath !== 'object' ? [iconPath] : iconPath;
  return (
    <i className={className || 'mr-1'} title={channelName}>
      <svg
        width={width || widthheightset}
        height={height || widthheightset}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {iconPathArray.length &&
          iconPathArray.map((iconpath, index) => {
            return (
              <path
                // v-for="source in pathSource"
                key={`iconPath_${index}`}
                d={iconpath}
                fill="currentColor"
              />
            );
          })}
      </svg>
    </i>
  );
};
export default IconChannel;
