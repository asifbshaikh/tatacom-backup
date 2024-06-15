import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';


const ChannelList = React.lazy(() =>
    import('./list')
);
const SettingsChannels = ({match}) => {
    return (
        <Suspense fallback={<div className="loading" />}>
            <Switch>
                <Redirect exact from={`${match.url}/`} to={`${match.url}/list/sms`} />
                <Route
                    path={`${match.url}/list/:type`}
                    render={(props) => <ChannelList {...props}/>}
                />
                <Redirect to="/error" />
            </Switch>
        </Suspense>
    )
}

export default SettingsChannels;