/* global axios */
import ApiClient from './ApiClient';

class Templates extends ApiClient {
  constructor() {
    super('templates', { accountScoped: true });
  }

  get({
    inboxId,
  }) {
    return axios.get(this.url, {
      params: {
        inbox_id: inboxId,
      },
    });
  }
}

export default new Templates();
