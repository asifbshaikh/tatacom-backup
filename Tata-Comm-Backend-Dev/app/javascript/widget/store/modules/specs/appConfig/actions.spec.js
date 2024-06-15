import { actions } from '../../appConfig';

const commit = jest.fn();
describe('#actions', () => {
  describe('#setReferrerHost', () => {
    it('creates actions properly', () => {
      actions.setReferrerHost({ commit }, 'www.tring.com');
      expect(commit.mock.calls).toEqual([
        ['SET_REFERRER_HOST', 'www.tring.com'],
      ]);
    });
  });

  describe('#setWidgetColor', () => {
    it('creates actions properly', () => {
      actions.setWidgetColor({ commit }, '#eaeaea');
      expect(commit.mock.calls).toEqual([['SET_WIDGET_COLOR', '#eaeaea']]);
    });
  });
});
