import React from 'react';
import enLang from './lang/entries/en-US';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { Formik } from 'formik';
import { Provider } from 'react-redux';
import store from "./redux/store"

export const CustomWrapper = ({ children }) => {
  const flattenMessages = (nestedMessages, prefix = '') => {
    if (nestedMessages === null) {
      return {};
    }
    return Object.keys(nestedMessages).reduce((messages, key) => {
      const value = nestedMessages[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'string' || typeof value === 'number') {
        Object.assign(messages, { [prefixedKey]: value });
      } else {
        Object.assign(messages, flattenMessages(value, prefixedKey));
      }

      return messages;
    }, {});
  };

  return (
    <Provider store={store}>
      <BrowserRouter>
        <IntlProvider
          locale="en"
          messages={flattenMessages(enLang.messages)}
          onError={(err) => {
            err;
          }}
        >
          <Formik>{children}</Formik>
        </IntlProvider>
      </BrowserRouter>
    </Provider>
  );
};
