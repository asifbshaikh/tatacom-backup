import {
  frontendURL,
  conversationUrl,
  accountIdFromPathname,
  isValidURL,
  getLoginRedirectURL,
} from '../URLHelper';

describe('#URL Helpers', () => {
  describe('conversationUrl', () => {
    it('should return direct conversation URL if activeInbox is nil', () => {
      expect(conversationUrl({ accountId: 1, id: 1 })).toBe(
        'accounts/1/conversations/1'
      );
    });
    it('should return inbox conversation URL if activeInbox is not nil', () => {
      expect(conversationUrl({ accountId: 1, id: 1, activeInbox: 2 })).toBe(
        'accounts/1/inbox/2/conversations/1'
      );
    });
    it('should return correct conversation URL if label is active', () => {
      expect(
        conversationUrl({ accountId: 1, label: 'customer-support', id: 1 })
      ).toBe('accounts/1/label/customer-support/conversations/1');
    });
    it('should return correct conversation URL if team Id is available', () => {
      expect(conversationUrl({ accountId: 1, teamId: 1, id: 1 })).toBe(
        'accounts/1/team/1/conversations/1'
      );
    });
  });

  describe('frontendURL', () => {
    it('should return url without params if params passed is nil', () => {
      expect(frontendURL('main', null)).toBe('/app/main');
    });
    it('should return url without params if params passed is not nil', () => {
      expect(frontendURL('main', { ping: 'pong' })).toBe('/app/main?ping=pong');
    });
  });

  describe('accountIdFromPathname', () => {
    it('should return account id if accont scoped url is passed', () => {
      expect(accountIdFromPathname('/app/accounts/1/settings/general')).toBe(1);
    });
    it('should return empty string if accont scoped url not is passed', () => {
      expect(accountIdFromPathname('/app/accounts/settings/general')).toBe('');
    });
    it('should return empty string if empty string is passed', () => {
      expect(accountIdFromPathname('')).toBe('');
    });
  });

  describe('isValidURL', () => {
    it('should return true if valid url is passed', () => {
      expect(isValidURL('https://tring.com')).toBe(true);
    });
    it('should return false if invalid url is passed', () => {
      expect(isValidURL('alert.window')).toBe(false);
    });
  });

  describe('getLoginRedirectURL', () => {
    it('should return correct Account URL if account id is present', () => {
      expect(
        getLoginRedirectURL('7500', {
          accounts: [{ id: 7500, name: 'Test Account 7500' }],
        })
      ).toBe('/app/accounts/7500/dashboard');
    });

    it('should return default URL if account id is not present', () => {
      expect(getLoginRedirectURL('7500', {})).toBe('/app/');
      expect(
        getLoginRedirectURL('7500', {
          accounts: [{ id: '7501', name: 'Test Account 7501' }],
        })
      ).toBe('/app/');
      expect(getLoginRedirectURL('7500', null)).toBe('/app/');
    });
  });
});
