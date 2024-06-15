import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import TemplateSearch from 'containers/campaigns/email/TemplateSearch';

describe('TemplateSearch component', () => {
    it('render without crashing', () => {
        const { asFragment } = render(
            <CustomWrapper>
                <TemplateSearch />
            </CustomWrapper>
        );
        expect(asFragment()).toMatchSnapshot();
    });
    it('renders loading state', () => {
        const { getByText } = render(<CustomWrapper><TemplateSearch loading={true} /></CustomWrapper>);
        expect(getByText('Loading...')).toBeInTheDocument();
    });
});