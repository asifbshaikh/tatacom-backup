import react from 'react';
import {render,screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it } from '@jest/globals';
import { CustomWrapper } from 'test-utils';
import QueryDetails from 'components/create-segment/QueryDetails';


describe('Column header  component', () => {
  it('render without crashing', () => {
    const { getByText } = render(
      <CustomWrapper>
        <QueryDetails />
      </CustomWrapper>
    );

    const sampleUsersText = screen.getByText(/Sample Users/i)
    expect(sampleUsersText).toBeInTheDocument();

    });
  });



