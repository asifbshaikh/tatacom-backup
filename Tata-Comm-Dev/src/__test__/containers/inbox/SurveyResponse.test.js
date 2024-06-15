import { describe, it } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import SurveyResponse from 'containers/inbox/SurveyResponse';
import { CustomWrapper } from 'test-utils';
import configureMockStore from 'redux-mock-store';

describe('SurveyResponse component', () => {
  const mockStore = configureMockStore();

  const initialState = {
    inboxApp: { surveyResponse: {}, existingSurveyResponse: {} },
  };
  const store = mockStore(initialState);

  it('Render SurveyResponse', async () => {
    const { getByText } = render(
      <CustomWrapper>
        <SurveyResponse store={store} />
      </CustomWrapper>
    );
    const text = getByText('Rate your conversation:');
    expect(text).toBeInTheDocument();
  });

  it('On select the rating', async () => {
    const { getByText, getAllByTestId } = render(
      <CustomWrapper>
        <SurveyResponse store={store} />
      </CustomWrapper>
    );

    const icon = getAllByTestId('rateInput')[0];
    fireEvent.click(icon);
    await waitFor(() => {
      const textVal = getByText(
        "Do you have any thoughts you'd like to share?"
      );
      expect(textVal).toBeInTheDocument();
    });
  });

  it('Handle Submit button click', async () => {
    const { getByText, getAllByTestId, getByTestId } = render(
      <CustomWrapper>
        <SurveyResponse store={store} />
      </CustomWrapper>
    );

    const icon = getAllByTestId('rateInput')[0];
    fireEvent.click(icon);
    await waitFor(() => {
      const textVal = getByText(
        "Do you have any thoughts you'd like to share?"
      );
      expect(textVal).toBeInTheDocument();
    });
    const textArea = getByTestId('feedbackTextArea');
    fireEvent.change(textArea, { target: { value: 'test feedback' } });
    const submitBtn = getByTestId('submitBtn');
    fireEvent.click(submitBtn);

    const submitText = getByText('Thank you for submitting the rating');
    expect(submitText).toBeInTheDocument();
  });
});
