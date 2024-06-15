import React from 'react';
// import {
//     Formik,
//     Form,
//     // Field
// } from 'formik';

// import {
//     // FormGroup,
//     // Label,
//     Row, Card, CardBody
// } from 'reactstrap';
import { injectIntl } from 'react-intl';



// import Facebook from './channels/Facebook';
import Website from './channels/Website';
// import Twitter from './channels/Twitter';
import Api from './channels/Api';
// import Email from './channels/Email';
import Sms from './channels/Sms';
import Whatsapp from './channels/Whatsapp';
// import Line from './channels/Line';
import Telegram from './channels/Telegram';
import Email from './channels/Email';
import Wechat from './channels/Wechat';
import Kakao from './channels/Kakao';
import Viber from './channels/Viber';
import Line from './channels/Line';
// import Viber from './channels/Viber';
// import Kakao from './channels/Kakao';
// import Wechat from './channels/Wechat';

// const channelViewList = {
//   facebook: Facebook,
//   website: Website,
//   twitter: Twitter,
//   api: Api,
//   email: Email,
//   sms: Sms,
//   whatsapp: Whatsapp,
//   line: Line,
//   telegram: Telegram,
//   viber: Viber,
//   wechat: Wechat,
//   kakao: Kakao,
// };



const CreateInbox = ({
    // intl,
    formRef,
    fields,
    next,
    setFieldsCoustom,
}) => {

    // const { messages } = intl;

    return (
        <div className="wizard-basic-step">
            {fields.channelKey === 'website' && <Website fields={fields} formRef={formRef} next={next} setFieldsCoustom={setFieldsCoustom} />}
            {fields.channelKey === 'facebook' && <Website fields={fields} formRef={formRef} next={next} setFieldsCoustom={setFieldsCoustom} />}
            {fields.channelKey === 'twitter' && <Website fields={fields} formRef={formRef} next={next} setFieldsCoustom={setFieldsCoustom} />}
            {fields.channelKey === 'whatsapp' && <Whatsapp fields={fields} formRef={formRef} next={next} setFieldsCoustom={setFieldsCoustom} />}
            {fields.channelKey === 'sms' && <Sms fields={fields} formRef={formRef} next={next} setFieldsCoustom={setFieldsCoustom} />}
            {fields.channelKey === 'email' && <Email fields={fields} formRef={formRef} next={next} setFieldsCoustom={setFieldsCoustom} />}
            {fields.channelKey === 'api' && <Api fields={fields} formRef={formRef} next={next} setFieldsCoustom={setFieldsCoustom} />}
            {fields.channelKey === 'telegram' && <Telegram fields={fields} formRef={formRef} next={next} setFieldsCoustom={setFieldsCoustom} />}
            {fields.channelKey === 'wechat' && <Wechat fields={fields} formRef={formRef} next={next} setFieldsCoustom={setFieldsCoustom} />}
            {fields.channelKey === 'kakao' && <Kakao fields={fields} formRef={formRef} next={next} setFieldsCoustom={setFieldsCoustom} />}
            {fields.channelKey === 'viber' && <Viber fields={fields} formRef={formRef} next={next} setFieldsCoustom={setFieldsCoustom} />}
            {fields.channelKey === 'line' && <Line fields={fields} formRef={formRef} next={next} setFieldsCoustom={setFieldsCoustom} />}
        </div>
    );
}
export default injectIntl(CreateInbox);