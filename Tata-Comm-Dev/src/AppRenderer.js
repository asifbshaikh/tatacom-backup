import React, { Suspense, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import reportWebVitals from './reportWebVitals';
import { createConsumer } from '@rails/actioncable';
import { currentAccount, currentUserID, getPubsubToken } from 'helpers/Utils';
import { webSocketURL } from 'constants/defaultValues';
import {
  actionCableEvents,
  isAValidEvent,
} from 'helpers/conversationEventHelpers';
const PRESENCE_INTERVAL = 20000;
const App = React.lazy(() => import(/* webpackChunkName: "App" */ './App'));

const Main = () => {
  const onReceived = (event, data) => {
    if (isAValidEvent(data)) {
      if (
        actionCableEvents[event] &&
        typeof actionCableEvents[event] === 'function'
      ) {
        actionCableEvents[event](data, store.dispatch);
      }
    }
  };
  const actionCable = createConsumer(webSocketURL);
  const userId = currentUserID();
  const accountId = currentAccount();
  useEffect(() => {
    if (userId) {
      const subscription = actionCable.subscriptions.create(
        {
          channel: 'RoomChannel',
          user_id: userId,
          account_id: accountId,
          pubsub_token: getPubsubToken(),
        },
        {
          connected: () => console.log('connected'),
          disconnected: () => console.log('disconnected'),
          received: (m) => {
            onReceived(m.event, m.data);
          },
        }
      );
      setInterval(() => {
        subscription.perform('update_presence');
      }, PRESENCE_INTERVAL);
    }
  }, [actionCable.subscriptions, userId, accountId]);

  return (
    <Provider store={store}>
      <Suspense fallback={<div className="loading" />}>
        <App />
      </Suspense>
    </Provider>
  );
};

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
