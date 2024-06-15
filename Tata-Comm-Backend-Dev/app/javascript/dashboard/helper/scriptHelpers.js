import posthog from 'posthog-js';

export const TRING_SET_USER = 'TRING_SET_USER';
export const TRING_RESET = 'TRING_RESET';

export const ANALYTICS_IDENTITY = 'ANALYTICS_IDENTITY';
export const ANALYTICS_RESET = 'ANALYTICS_RESET';

export const initializeAnalyticsEvents = () => {
  window.bus.$on(ANALYTICS_IDENTITY, ({ user }) => {
    if (window.analyticsConfig) {
      posthog.identify(user.id, { name: user.name, email: user.email });
    }
  });

  window.bus.$on(ANALYTICS_RESET, () => {
    if (window.analyticsConfig) {
      posthog.reset();
    }
  });
};

export const initializeTringEvents = () => {
  window.bus.$on(TRING_RESET, () => {
    if (window.$tring) {
      window.$tring.reset();
    }
  });
  window.bus.$on(TRING_SET_USER, ({ user }) => {
    if (window.$tring) {
      window.$tring.setUser(user.email, {
        avatar_url: user.avatar_url,
        email: user.email,
        identifier_hash: user.hmac_identifier,
        name: user.name,
      });
      window.$tring.setCustomAttributes({
        signedUpAt: user.created_at,
        cloudCustomer: 'true',
      });
    }
  });
};
