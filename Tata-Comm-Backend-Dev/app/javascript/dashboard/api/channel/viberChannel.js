import ApiClient from '../ApiClient';

class ViberChannel extends ApiClient {
  constructor() {
    super('channels/viber_channel', { accountScoped: true });
  }
}

export default new ViberChannel();
