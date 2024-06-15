import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils'; // Import act
import ConnectorConfig from 'containers/settings/channels/email/ConnectorConfig';
import { CustomWrapper } from 'test-utils';

describe('ConnectorConfig', () => {
    const formRef = React.createRef();
    const onSubmitForm = jest.fn();

    beforeEach(() => {
        return render(
            <CustomWrapper>
                <ConnectorConfig formRef={formRef} />
            </CustomWrapper>
        );
    });

    it("should have submit button", async () => {
        const AddConfigurationBtn = screen.getByText('+Add Configuration');

        await act(async () => {
            fireEvent.click(AddConfigurationBtn);
            await waitFor(() => {
                expect(screen.getByText('Submit')).toBeInTheDocument();
            });
        });
    });

    it("should have input box to enter host name", async () => {
        const hostNameInput = screen.getByText('Email Connector');

        await act(async () => {
            await waitFor(() => {
                expect(hostNameInput).toBeInTheDocument();
            });
        });
    });
});
