import Facebook from './channels/Facebook';
import Website from './channels/Website';
import Twitter from './channels/Twitter';
import Api from './channels/Api';
import Email from './channels/Email';
import Sms from './channels/Sms';
import Whatsapp from './channels/Whatsapp';
import Line from './channels/Line';
import Telegram from './channels/Telegram';
import Viber from './channels/Viber';
import Kakao from './channels/Kakao';
import Wechat from './channels/Wechat';

const channelViewList = {
  facebook: Facebook,
  website: Website,
  twitter: Twitter,
  api: Api,
  email: Email,
  sms: Sms,
  whatsapp: Whatsapp,
  line: Line,
  telegram: Telegram,
  viber: Viber,
  wechat: Wechat,
  kakao: Kakao,
};

export default {
  create() {
    return {
      props: {
        channel_name: {
          type: String,
          required: true,
        },
      },
      name: 'new-channel-view',
      render(h) {
        return h(channelViewList[this.channel_name] || null);
      },
    };
  },
};
