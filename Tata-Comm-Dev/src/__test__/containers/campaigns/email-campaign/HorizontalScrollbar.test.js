import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import HorizontalScrollbar from 'containers/campaigns/email/HorizontalScrollbar';

describe('HorizontalScrollbar component', () => {
    it('render without crashing', () => {
        const { asFragment } = render(
            <CustomWrapper>
                <HorizontalScrollbar />
            </CustomWrapper>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});