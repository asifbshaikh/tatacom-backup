import React from 'react';

const SocialLinks = ({ props, className }) => {
  return (
    <>
      {[
        {
          key: 'facebook',
          icon: 'simple-icon-social-facebook',
          prefix: 'https://facebook.com/',
        },
        {
          key: 'twitter',
          icon: 'simple-icon-social-twitter',
          prefix: 'https://twitter.com/',
        },
        {
          key: 'linkedin',
          icon: 'simple-icon-social-linkedin',
          prefix: 'https://linkedin.com/',
        },
        {
          key: 'github',
          icon: 'simple-icon-social-github',
          prefix: 'https://github.com/',
        },
      ].map((social) => {
        return (
          typeof props.additional_attributes.social_profiles !== 'undefined' &&
          typeof props.additional_attributes.social_profiles[social.key] !==
            'undefined' &&
          props.additional_attributes.social_profiles[social.key] && (
            <a
              key={social.key}
              href={`${social.prefix}${
                props.additional_attributes.social_profiles[social.key]
              }`}
              className={className}
              target="_blank"
              rel="noreferrer"
            >
              <i className={`simple-icon-social-${social.key}`} />
            </a>
          )
        );
      })}
    </>
  );
};
export default React.memo(SocialLinks);
