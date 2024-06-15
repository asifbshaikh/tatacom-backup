import ApiClient from '../ApiClient';

class TataCommunicationsWhatsappChannel extends ApiClient {
  constructor() {
    super('channels/tata_communications_whatsapp_channel', { accountScoped: true });
  }
}

export default new TataCommunicationsWhatsappChannel();
