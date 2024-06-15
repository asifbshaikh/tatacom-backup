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
import CreateTeam from './CreateTeam';
import AddTeamAgents from './AddTeamAgents';
import FinishTeamSetup from './FinishTeamSetup';

const InboxesNew = ({ intl, match }) => {
    const forms = [];
    const [bottomNavHidden, setBottomNavHidden] = useState(true);
    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState({});

    const mode = match.params.itemid ? "EDIT_FLOW" : "CREATE_FLOW";
    const InboxesActions = [0, 1, 2].map((counter) => {
        return {
            'title': `TEAMS_SETTINGS.${mode}.WIZARD.${counter}.title`,
            'route': `TEAMS_SETTINGS.${mode}.WIZARD.${counter}.route`,
            'body': `TEAMS_SETTINGS.${mode}.WIZARD.${counter}.body`,
        }
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
                                match,
                                formRef: forms[index],
                                fields,
                                setFieldsCoustom
                            };
                            const route = messages[inboxStep.route];
                            return (
                                <Step
                                    key={`inbox_${route}`}
                                    id={route}
                                    name={messages[inboxStep.title]}
                                    desc={messages[inboxStep.body]}
                                >
                                    {({ next }) => {
                                        commonParams.next = next;
                                        return (
                                            <>
                                                {/* <FinishSetup {...commonParams} /> */}
                                                {index === 0 && <CreateTeam {...commonParams} />}
                                                {index === 1 && <AddTeamAgents {...commonParams} />}
                                                {index === 2 && <FinishTeamSetup {...commonParams} />}
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
        </Card>
    );
};
export default injectIntl(InboxesNew);
