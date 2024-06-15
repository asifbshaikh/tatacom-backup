import React from 'react';
import { FormattedMessage, injectIntl, useIntl } from 'react-intl';

const InjectMassage = (props) => <FormattedMessage {...props} />;

/* 
  props sample data for intlDirectMessage function
  ({ id:"INTLMSG.NAME" },{ values:{ attributeOneName:"Attribute One",... }}) 
*/
export const intlDirectMessage = (...props) => {
  const intl = useIntl();
  return intl.formatMessage(...props);
};

export default injectIntl(InjectMassage, {
  withRef: false,
});
