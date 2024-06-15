import { shallowMount } from '@vue/test-utils';
import messageFormatterMixin from '../messageFormatterMixin';

describe('messageFormatterMixin', () => {
  it('returns correct plain text', () => {
    const Component = {
      render() {},
      mixins: [messageFormatterMixin],
    };
    const wrapper = shallowMount(Component);
    const message = '<b>Tring is an opensource tool. https://www.tring.com</b>';
    expect(wrapper.vm.getPlainText(message)).toMatch(
      'Tring is an opensource tool. https://www.tring.com'
    );
  });

  it('stripStyleCharacters returns message without style tags', () => {
    const Component = {
      render() {},
      mixins: [messageFormatterMixin],
    };
    const wrapper = shallowMount(Component);
    const message =
      '<b style="max-width:100%">Tring is an opensource tool. https://www.tring.com</b><style type="css">.message{}</style>';
    expect(wrapper.vm.stripStyleCharacters(message)).toMatch(
      '<b>Tring is an opensource tool. https://www.tring.com</b>'
    );
  });
});
