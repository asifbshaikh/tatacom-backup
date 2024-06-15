import { EMAIL_PATTERN } from 'constants/appConstant';
import React, { useEffect, useState } from 'react';

const getInitials = (name) => {
  const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
  let initials = [...name.matchAll(rgx)] || [];
  const checkEmail = name?.match(EMAIL_PATTERN);
  initials = (
    checkEmail
      ? initials.shift()?.[1] || ''
      : (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase();
  return initials;
};

const Thumbnail = ({ source, name, defaultWidth, classNameCustom }) => {
  const [showInitials, setShowInitials] = useState(false);
  useEffect(() => {
    setShowInitials(false); // reset every time source changes
  }, [source]);

  return (
    <>
      {!showInitials && (
        <img
          alt={name}
          src={source}
          style={{ ...(defaultWidth || { maxWidth: '40px' }) }}
          // src="/assets/img/profiles/l-4.jpg"
          className={`img-thumbnail border-0 rounded-circle mr-1 list-thumbnail align-self-center xsmall ${classNameCustom}`}
          onError={() => {
            setShowInitials(true);
          }}
        />
      )}
      {showInitials && (
        <div
          className={`img-thumbnail border-0 rounded-circle mr-1 list-thumbnail list-thumbnail-letters align-self-center xsmall ${classNameCustom}`}
        >
          <div
            aria-hidden="true"
            className="avatar-container user-thumbnail list-thumbnail-letters rounded-circle"
            title={name}
            style={{
              ...(defaultWidth || { height: '40px', width: '40px' }),
              // textAlign: 'center',
              // borderRadius: '50%',
              // lineHeight: '42px',
              // fontSize: '16px',
              // backgroundColor: 'rgb(194, 225, 255)', color: 'rgb(25, 118, 204)'
            }}
          >
            {name && getInitials(name)}
          </div>
          {/* <img
        src="/integrations/channels/badges/telegram.png"
        alt={name}
        className="source-badge"
      // style="width: 15px; height: 15px; border-radius: 6.5px;"
      /> */}
        </div>
      )}
    </>
  );
};
export default Thumbnail;

// <div className="align-self-center list-thumbnail-letters   mr-2  rounded-circle"
// title={name}
// style={{ lineHeight: '42px', borderRadius: '50%', fontSize: '16px', height: '40px', width: '40px' }}
// >
// {getInitials(name)}
// </div>
