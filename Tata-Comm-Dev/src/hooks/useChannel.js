import { useState, useEffect, useRef, useCallback } from 'react';

// Needed for @rails/actioncable
// let global;
// global.addEventListener = () => {};
// global.removeEventListener = () => {};

export default function useChannel(actionCable) {
  const [connected, setConnected] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const channelRef = useRef(null);

  const subscribe = (data, callbacks) => {
    const channel = actionCable.subscriptions.create(data, {
      initialized: () => {
        console.log('initialized');
        setSubscribed(true);
        if (callbacks.initialized) {
          callbacks.initialized();
        }
      },
      connected: () => {
        console.log('connected');
        setConnected(true);
        if (callbacks.connected) {
          callbacks.connected();
        }
      },
      received: (message) => {
        console.log('received');
        if (message) {
          callbacks.received(message);
        }
      },
      disconnected: () => {
        console.log('disconnected');
        if (callbacks.disconnected) {
          setConnected(false);
          callbacks.disconnected();
        }
      },
    });
    console.log(channelRef.current);
    channelRef.current = channel;
  };

  const unsubscribe = useCallback(() => {
    setSubscribed(false);
    if (channelRef.current) {
      console.log(
        'useChannel - INFO: Unsubscribing from ' + channelRef.current.identifier
      );
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
  }, [channelRef.current]);

  useEffect(() => {
    console.log('useEffect', connected, subscribed);
    return () => {
      unsubscribe();
    };
  }, [unsubscribe]);

  const send = (action, payload) => {
    console.log('subscribed', subscribed);
    console.log('!connected', connected);
    console.log('!action, payload', action, payload);
    if (subscribed && !connected) {
      throw 'useChannel - ERROR: not connected';
    }

    if (!subscribed) {
      throw 'useChannel - ERROR: not subscribed';
    }

    try {
      channelRef?.current?.perform(action, payload);
    } catch (e) {
      throw 'useChannel - ERROR: ' + e;
    }
  };

  return { subscribe, unsubscribe, send };
}
