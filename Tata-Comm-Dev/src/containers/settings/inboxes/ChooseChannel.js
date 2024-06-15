import React from 'react';
import {
    Formik,
    Form,
    // Field
} from 'formik';

import {
    // FormGroup,
    // Label,
    Row, Card, CardBody
} from 'reactstrap';
import { injectIntl } from 'react-intl';

import { Colxx } from 'components/common/CustomBootstrap';

import { allChannels } from 'helpers/TringIconHelper';
import IconChannel from 'components/common/IconChannel';


const ChooseChannel = ({
    // intl,
    formRef,
    // fields,
    next,
    setFieldsCoustom
}) => {

    // const { messages } = intl;




    return (
        <div className="wizard-basic-step">
            <Formik
                innerRef={formRef}
                initialValues={{
                    channelKey: '',
                }}
                // validateOnMount
                onSubmit={() => { }}
            >
                {({ setFieldValue }) => (
                    <Form className="av-tooltip tooltip-label-right">
                        <Row>
                            <Colxx xxs="12">
                                {/* <h5 className="mb-4">
                                    <IntlMessages id="sortable.columns" />
                                </h5> */}
                                <div className="row icon-cards-row m-2">
                                    {allChannels.map(function (channel) {
                                        return (
                                            <Colxx
                                                key={`column_${channel.key}`}
                                                xxs="6"
                                                sm="4"
                                                md="3"
                                                className="p-1"
                                            >
                                                <Card onClick={() => {
                                                    setFieldValue('channelKey', channel.key);
                                                    setFieldsCoustom({ 'channelKey': channel.key });
                                                    next()
                                                    // submitForm()
                                                }}>
                                                    <CardBody className="text-center">
                                                        {/* <i className={item.icon} /> */}
                                                        <IconChannel channelName={channel.name} channelType={channel.channelType} widthheight="38px" />
                                                        {/* <p className="card-text font-weight-semibold mb-0">
                                                            {channel.name}
                                                        </p> */}
                                                        <p className="lead text-center">{channel.name}</p>
                                                    </CardBody>
                                                </Card>
                                            </Colxx>
                                        )
                                    })}
                                </div>
                            </Colxx>
                        </Row>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
export default injectIntl(ChooseChannel);