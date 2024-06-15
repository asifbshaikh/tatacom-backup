import React, { Suspense } from 'react';
import { render } from '@testing-library/react'
import ChannelList from "views/app/settings/channels/list";
import { CustomWrapper } from 'test-utils';

describe('Render Channels list', () => {
  const match = {
    url: '/app/accounts/3/channels', path: '',
    params: {
      type: 'sms'
    }
  };

  test('should Render Channels list screen', () => {
    const { asFragment } = render(
      <CustomWrapper>
         <Suspense fallback={<div className="loading" />}>
        <ChannelList match={match} />
        </Suspense>
      </CustomWrapper>);
    expect(asFragment()).toMatchSnapshot();
  })
})

