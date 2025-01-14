import Cookies from 'js-cookie';
import { IFrameHelper } from '../sdk/IFrameHelper';
import { getBubbleView } from '../sdk/settingsHelper';
import {
  computeHashForUserData,
  getUserCookieName,
  hasUserKeys,
} from '../sdk/cookieHelpers';

const runSDK = ({ baseUrl, websiteToken }) => {
  if (window.$tring) {
    return;
  }

  const tringSettings = window.tringSettings || {};
  window.$tring = {
    baseUrl,
    hasLoaded: false,
    hideMessageBubble: tringSettings.hideMessageBubble || false,
    isOpen: false,
    position: tringSettings.position === 'left' ? 'left' : 'right',
    websiteToken,
    locale: tringSettings.locale,
    type: getBubbleView(tringSettings.type),
    launcherTitle: tringSettings.launcherTitle || '',
    showPopoutButton: tringSettings.showPopoutButton || false,
    widgetStyle: tringSettings.widgetStyle || 'standard',
    resetTriggered: false,

    toggle(state) {
      IFrameHelper.events.toggleBubble(state);
    },

    setUser(identifier, user) {
      if (typeof identifier !== 'string' && typeof identifier !== 'number') {
        throw new Error('Identifier should be a string or a number');
      }

      if (!hasUserKeys(user)) {
        throw new Error(
          'User object should have one of the keys [avatar_url, email, name]'
        );
      }

      const userCookieName = getUserCookieName();
      const existingCookieValue = Cookies.get(userCookieName);
      const hashToBeStored = computeHashForUserData({ identifier, user });
      if (hashToBeStored === existingCookieValue) {
        return;
      }

      window.$tring.identifier = identifier;
      window.$tring.user = user;
      IFrameHelper.sendMessage('set-user', { identifier, user });
      Cookies.set(userCookieName, hashToBeStored, {
        expires: 365,
        sameSite: 'Lax',
      });
    },

    setCustomAttributes(customAttributes = {}) {
      if (!customAttributes || !Object.keys(customAttributes).length) {
        throw new Error('Custom attributes should have atleast one key');
      } else {
        IFrameHelper.sendMessage('set-custom-attributes', { customAttributes });
      }
    },

    deleteCustomAttribute(customAttribute = '') {
      if (!customAttribute) {
        throw new Error('Custom attribute is required');
      } else {
        IFrameHelper.sendMessage('delete-custom-attribute', {
          customAttribute,
        });
      }
    },

    setLabel(label = '') {
      IFrameHelper.sendMessage('set-label', { label });
    },

    removeLabel(label = '') {
      IFrameHelper.sendMessage('remove-label', { label });
    },

    setLocale(localeToBeUsed = 'en') {
      IFrameHelper.sendMessage('set-locale', { locale: localeToBeUsed });
    },

    reset() {
      if (window.$tring.isOpen) {
        IFrameHelper.events.toggleBubble();
      }

      Cookies.remove('cw_conversation');
      Cookies.remove(getUserCookieName());

      const iframe = IFrameHelper.getAppFrame();
      iframe.src = IFrameHelper.getUrl({
        baseUrl: window.$tring.baseUrl,
        websiteToken: window.$tring.websiteToken,
      });

      window.$tring.resetTriggered = true;
    },
  };

  IFrameHelper.createFrame({
    baseUrl,
    websiteToken,
  });
};

window.tringSDK = {
  run: runSDK,
};
