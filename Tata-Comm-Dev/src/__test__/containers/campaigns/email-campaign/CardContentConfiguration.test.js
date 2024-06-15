import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import CardContentConfiguration from 'containers/campaigns/email/CardContentConfiguration';

describe('CardContentCampaign component', () => {
  const loadDesignFn = jest.fn();
  const emailEditorRef = {
    current: { editor: { exportHtml: jest.fn(), loadDesign: loadDesignFn } },
  };

  it('render without crashing', () => {
    const formref = React.createRef(null);
    const { asFragment } = render(
      <CustomWrapper>
        <CardContentConfiguration
          formRef={formref}
          setDisableNextButton={jest.fn()}
          emailEditorRef={emailEditorRef}
        />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('sets default active tab when no value is provided', () => {
    const formref = React.createRef(null);
    const { getByText } = render(
      <CustomWrapper>
        <CardContentConfiguration
          formRef={formref}
          setDisableNextButton={jest.fn()}
          emailEditorRef={emailEditorRef}
        />
      </CustomWrapper>
    );
    const senderDetailsTab = getByText('Sender Details');
    expect(senderDetailsTab).toHaveClass('active');
  });

  it('changes active tab when clicked', () => {
    const formref = React.createRef(null);
    const { getByText } = render(
      <CustomWrapper>
        <CardContentConfiguration
          formRef={formref}
          setDisableNextButton={jest.fn()}
          emailEditorRef={emailEditorRef}
        />
      </CustomWrapper>
    );
    const senderDetailsTab = getByText('Sender Details');
    fireEvent.click(senderDetailsTab);
    expect(senderDetailsTab).toHaveClass('active');
  });

  it('renders tab content correctly', () => {
    const formref = React.createRef(null);
    const { getByText } = render(
      <CustomWrapper>
        <CardContentConfiguration
          formRef={formref}
          setDisableNextButton={jest.fn()}
          emailEditorRef={emailEditorRef}
        />
      </CustomWrapper>
    );
    const senderDetailsTab = getByText('Sender Details');

    expect(senderDetailsTab).toHaveClass('active');
  });
});
