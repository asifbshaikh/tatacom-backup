/* eslint-disable no-param-reassign */
import React, { createRef, useState } from 'react';
import {
    Card, CardBody,
    // FormGroup, Label,
    Spinner
} from 'reactstrap';
import { Wizard, Steps, Step } from 'react-albus';
import { injectIntl } from 'react-intl';
// import { Formik, Form, Field } from 'formik';
// import IntlMessages from 'helpers/IntlMessages';
import BottomNavigation from 'components/wizard/BottomNavigation';
import TopNavigation from 'components/wizard/TopNavigation';
import ChooseChannel from './ChooseChannel';
import CreateInbox from './CreateInbox';
import AddAgents from './AddAgents';
import FinishSetup from './FinishSetup';


// const validateEmail = (value) => {
//     let error;
//     if (!value) {
//         error = 'Please enter your email address';
//     } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
//         error = 'Invalid email address';
//     }
//     return error;
// };

// const validateName = (value) => {
//     let error;
//     if (!value) {
//         error = 'Please enter your name';
//     } else if (value.length < 2) {
//         error = 'Value must be longer than 2 characters';
//     }
//     return error;
// };

// const validatePassword = (value) => {
//     let error;
//     if (!value) {
//         error = 'Please enter your password';
//     } else if (value.length < 6) {
//         error = 'Password must be longer than 6 characters';
//     }
//     return error;
// };

const InboxesActions = [
    {
        "route": "settings_inbox_new",
    },
    {
        "route": "settings_inboxes_page_channel",
    },
    {
        "route": "settings_inboxes_add_agents",
    },
    {
        "route": "settings_inbox_finish",
    }
];

const InboxesNew = ({ intl }) => {
    const forms = [];
    const [bottomNavHidden, setBottomNavHidden] = useState(true);
    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState({
        name: '',
        email: '',
        password: '',
        // inbox_id: 19,
        // web_widget_script: "\n    <script>\n      (function(d,t) {\n        var BASE_URL=\"https://engage.digo.link\";\n        var g=d.createElement(t),s=d.getElementsByTagName(t)[0];\n        g.src=BASE_URL+\"/packs/js/sdk.js\";\n        g.defer = true;\n        g.async = true;\n        s.parentNode.insertBefore(g,s);\n        g.onload=function(){\n          window.tringSDK.run({\n            websiteToken: 'kCx1Um4psXjSQo3GTC4n9SUC',\n            baseUrl: BASE_URL\n          })\n        }\n      })(document,\"script\");\n    </script>\n    "
    });

    const setFieldsCoustom = (values) => {
        const newFields = { ...fields, ...values };
        setFields(newFields);
    }

    const onClickNext = (goToNext, steps, step) => {
        if (steps.length - 1 <= steps.indexOf(step)) {
            return;
        }
        const formIndex = steps.indexOf(step);
        const form = forms[formIndex].current;

        form.submitForm().then(() => {
            if (!form.isDirty && form.isValid) {
                const newFields = { ...fields, ...form.values };
                setFields(newFields);

                if (steps.length - 2 <= steps.indexOf(step)) {
                    // done
                    setBottomNavHidden(true);
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                    }, 3000);
                }
                goToNext();
                step.isDone = true;
            }
        });
    };

    const onClickPrev = (goToPrev, steps, step) => {
        if (steps.indexOf(step) <= 0) {
            return;
        }
        goToPrev();
    };

    const { messages } = intl;
    return (
        <Card>


            <CardBody className="wizard wizard-default">
                <Wizard>
                    <TopNavigation className="justify-content-center" disableNav />
                    {loading && (
                        <div>
                            <Spinner color="primary" className="mb-1" />
                        </div>
                    )}
                    <Steps>
                        {InboxesActions.map(function (inboxStep, index) {
                            forms.push(createRef(null));
                            const commonParams = {
                                formRef: forms[index],
                                fields,
                                setFieldsCoustom
                            };
                            return (
                                <Step
                                    key={`inbox_${inboxStep.route}`}
                                    id={inboxStep.route}
                                    name={messages[`inboxes.${inboxStep.route}`]}
                                    desc={messages[`inboxes.${inboxStep.route}_body`]}
                                >
                                    {({ next }) => {
                                        commonParams.next = next;
                                        return (
                                            <>
                                                {/* <FinishSetup {...commonParams} /> */}
                                                {inboxStep.route === 'settings_inbox_new' && <ChooseChannel {...commonParams} />}
                                                {inboxStep.route === 'settings_inboxes_page_channel' && <CreateInbox {...commonParams} />}
                                                {inboxStep.route === 'settings_inboxes_add_agents' && <AddAgents {...commonParams} />}
                                                {inboxStep.route === 'settings_inbox_finish' && <FinishSetup {...commonParams} />}
                                            </>
                                        )
                                    }}
                                </Step>
                            )
                        })}
                    </Steps>
                    <BottomNavigation
                        onClickNext={onClickNext}
                        onClickPrev={onClickPrev}
                        className={`justify-content-center ${bottomNavHidden && 'invisible'
                            }`}
                        prevLabel={messages['wizard.prev']}
                        nextLabel={messages['wizard.next']}
                    />
                </Wizard>
            </CardBody>









            {/* <CardBody className="wizard wizard-default">
                <Wizard>
                    <TopNavigation className="justify-content-center" disableNav />
                    <Steps>
                        <Step
                            id="step1"
                            name={messages['wizard.step-name-1']}
                            desc={messages['wizard.step-desc-1']}
                        >
                            <div className="wizard-basic-step">
                                <Formik
                                    innerRef={forms[0]}
                                    initialValues={{
                                        name: fields.name,
                                    }}
                                    validateOnMount
                                    onSubmit={() => { }}
                                >
                                    {({ errors, touched }) => (
                                        <Form className="av-tooltip tooltip-label-right">
                                            <FormGroup>
                                                <Label>{messages['forms.name']}</Label>
                                                <Field
                                                    className="form-control"
                                                    name="name"
                                                    validate={validateName}
                                                />
                                                {errors.name && touched.name && (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.name}
                                                    </div>
                                                )}
                                            </FormGroup>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </Step>
                        <Step
                            id="step2"
                            name={messages['wizard.step-name-2']}
                            desc={messages['wizard.step-desc-2']}
                        >
                            <div className="wizard-basic-step">
                                <Formik
                                    innerRef={forms[1]}
                                    initialValues={{
                                        email: fields.email,
                                    }}
                                    onSubmit={() => { }}
                                    validateOnMount
                                >
                                    {({ errors, touched }) => (
                                        <Form className="av-tooltip tooltip-label-right">
                                            <FormGroup>
                                                <Label>{messages['forms.email']}</Label>
                                                <Field
                                                    className="form-control"
                                                    name="email"
                                                    validate={validateEmail}
                                                />
                                                {errors.email && touched.email && (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.email}
                                                    </div>
                                                )}
                                            </FormGroup>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </Step>
                        <Step
                            id="step3"
                            name={messages['wizard.step-name-3']}
                            desc={messages['wizard.step-desc-3']}
                        >
                            <div className="wizard-basic-step">
                                <Formik
                                    innerRef={forms[2]}
                                    initialValues={{
                                        password: fields.password,
                                    }}
                                    onSubmit={() => { }}
                                    validateOnMount
                                >
                                    {({ errors, touched }) => (
                                        <Form className="av-tooltip tooltip-label-right error-l-75">
                                            <FormGroup>
                                                <Label>{messages['forms.password']}</Label>
                                                <Field
                                                    className="form-control"
                                                    name="password"
                                                    type="password"
                                                    validate={validatePassword}
                                                />
                                                {errors.password && touched.password && (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.password}
                                                    </div>
                                                )}
                                            </FormGroup>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </Step>
                        <Step id="step4" hideTopNav>
                            <div className="wizard-basic-step text-center pt-3">
                                {loading ? (
                                    <div>
                                        <Spinner color="primary" className="mb-1" />
                                        <p>
                                            <IntlMessages id="wizard.async" />
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="mb-2">
                                            <IntlMessages id="wizard.content-thanks" />
                                        </h2>
                                        <p>
                                            <IntlMessages id="wizard.registered" />
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Step>
                    </Steps>
                    <BottomNavigation
                        onClickNext={onClickNext}
                        onClickPrev={onClickPrev}
                        className={`justify-content-center ${bottomNavHidden && 'invisible'
                            }`}
                        prevLabel={messages['wizard.prev']}
                        nextLabel={messages['wizard.next']}
                    />
                </Wizard>
            </CardBody> */}
        </Card>
    );
};
export default injectIntl(InboxesNew);
