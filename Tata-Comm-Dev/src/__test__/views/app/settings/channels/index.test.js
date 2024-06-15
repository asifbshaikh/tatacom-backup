import React from 'react';
import { render } from '@testing-library/react'
import { Route } from 'react-router-dom';
import SettingsChannels from "views/app/settings/channels"
import ChannelList from "views/app/settings/channels/list";
import { CustomWrapper } from 'test-utils';


describe('Channels Routing', () => {

  const match = { url: "/app/accounts/3/channels" }

  test('should navigate to Allsegments routes', () => {

    const { asFragment } = render(
      <CustomWrapper>
        <>
          <SettingsChannels match={match} />
          <Route exact path={`${match.url}/list`} component={ChannelList} />
          </>
      </CustomWrapper>
    )

    expect(asFragment()).toMatchSnapshot();
  })

})

