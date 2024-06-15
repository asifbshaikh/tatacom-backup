import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { CustomWrapper } from 'test-utils';
import TemplateCards from 'containers/campaigns/email/TemplateCards';
import ContentConfigurationEnums from 'enums/campaigns/ContentConfigurationEnums';

const setIsChooseMock = jest.fn();

describe('TemplateCards component', () => {
  it('render without crashing', () => {
    const { asFragment } = render(
      <CustomWrapper>
        <TemplateCards />
      </CustomWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

test('applies hover effect on mouse enter', () => {
  const { container } = render(
    <CustomWrapper>
      <TemplateCards title="blankTemplate" setIsChoose={setIsChooseMock} />
    </CustomWrapper>
  );
  const cardContent = container.querySelector('.template-card-content');

  fireEvent.mouseEnter(cardContent);
  expect(cardContent).toHaveClass('hovered');

  fireEvent.mouseLeave(cardContent);
  expect(cardContent).not.toHaveClass('hovered');
});

test('calls setIsChoose when "Choose" button is clicked', () => {
  const { getByText } = render(
    <CustomWrapper>
      <TemplateCards title="blankTemplate" setIsChoose={setIsChooseMock} />
    </CustomWrapper>
  );
  const chooseButton = getByText('Choose');

  fireEvent.click(chooseButton);
  expect(setIsChooseMock).toHaveBeenCalledWith(true);
});

test('renders blank template content when title is "blankTemplate"', () => {
  const { getByText } = render(
    <CustomWrapper>
      <TemplateCards title="blankTemplate" setIsChoose={setIsChooseMock} />
    </CustomWrapper>
  );

  expect(getByText('Choose')).toBeInTheDocument();
  expect(getByText('BLANK TEMPLATE')).toBeInTheDocument();
});

test('renders column layout content for specific titles', () => {
  const titles = [
    ContentConfigurationEnums.TWO_COLUMNS,
    ContentConfigurationEnums.THREE_COLUMNS,
    ContentConfigurationEnums.FOUR_COLUMNS,
  ];
  titles.forEach((title) => {
    render(
      <CustomWrapper>
        <TemplateCards title={title} setIsChoose={setIsChooseMock} />
      </CustomWrapper>
    );

    expect(screen.getAllByText('Choose')[0]).toBeInTheDocument();
    expect(screen.getAllByText('COLUMN TEMPLATE')[0]).toBeInTheDocument();
  });
});
