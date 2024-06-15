import MessageFormatter from '../MessageFormatter';

describe('#MessageFormatter', () => {
  describe('content with links', () => {
    it('should format correctly', () => {
      const message =
        'Tring is an opensource tool. [Tring](https://www.tring.com)';
      expect(new MessageFormatter(message).formattedMessage).toMatch(
        '<p>Tring is an opensource tool. <a title="" class="link" href="https://www.tring.com" rel="noreferrer noopener nofollow" target="_blank">Tring</a></p>'
      );
    });
    it('should format correctly', () => {
      const message = 'Tring is an opensource tool. https://www.tring.com';
      expect(new MessageFormatter(message).formattedMessage).toMatch(
        '<p>Tring is an opensource tool. <a title="" class="link" href="https://www.tring.com" rel="noreferrer noopener nofollow" target="_blank">https://www.tring.com</a></p>'
      );
    });
  });

  describe('parses heading to strong', () => {
    it('should format correctly', () => {
      const message = '### opensource \n ## tool';
      expect(new MessageFormatter(message).formattedMessage).toMatch(
        '<strong>opensource</strong><strong>tool</strong>'
      );
    });
  });

  describe('tweets', () => {
    it('should return the same string if not tags or @mentions', () => {
      const message = 'Tring is an opensource tool';
      expect(new MessageFormatter(message).formattedMessage).toMatch(message);
    });

    it('should add links to @mentions', () => {
      const message =
        '@tringapp is an opensource tool thanks @longnonexistenttwitterusername';
      expect(new MessageFormatter(message, true).formattedMessage).toMatch(
        '<p><a href="http://twitter.com/tringapp" target="_blank" rel="noreferrer nofollow noopener">@tringapp</a> is an opensource tool thanks @longnonexistenttwitterusername</p>'
      );
    });

    it('should add links to #tags', () => {
      const message = '#tringapp is an opensource tool';
      expect(new MessageFormatter(message, true).formattedMessage).toMatch(
        '<p><a href="https://twitter.com/hashtag/tringapp" target="_blank" rel="noreferrer nofollow noopener">#tringapp</a> is an opensource tool</p>'
      );
    });
  });

  describe('plain text content', () => {
    it('returns the plain text without HTML', () => {
      const message =
        '<b>Tring is an opensource tool. https://www.tring.com</b>';
      expect(new MessageFormatter(message).plainText).toMatch(
        'Tring is an opensource tool. https://www.tring.com'
      );
    });
  });

  describe('#sanitize', () => {
    it('sanitizes markup and removes all unnecessary elements', () => {
      const message =
        '[xssLink](javascript:alert(document.cookie))\n[normalLink](https://google.com)**I am a bold text paragraph**';
      expect(new MessageFormatter(message).formattedMessage).toMatch(
        '<p><a title="" class="link" rel="noreferrer noopener nofollow" target="_blank">xssLink</a><br><a title="" class="link" href="https://google.com" rel="noreferrer noopener nofollow" target="_blank">normalLink</a><strong>I am a bold text paragraph</strong></p>'
      );
    });
  });
});
