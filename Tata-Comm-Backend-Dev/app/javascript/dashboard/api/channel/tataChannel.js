import ApiClient from '../ApiClient';

class TataChannel extends ApiClient {
  constructor() {
    super('channels/tata_channel', { accountScoped: true });
  }
}

export default new TataChannel();
