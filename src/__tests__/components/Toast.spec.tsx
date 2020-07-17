import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import Toast from '../../components/ToastContainer/Toast';

const mockedRemoveToast = jest.fn();

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      removeToast: mockedRemoveToast,
    }),
  };
});

describe('Button component', () => {
  it('should be able to render an Toast', async () => {
    jest.useFakeTimers();

    const { getByTestId } = render(
      <Toast key="1" message={{ id: '123', title: 'title' }} style={{}} />,
    );

    const buttonElement = getByTestId('button-remove-toast');

    fireEvent.click(buttonElement);

    jest.runAllTimers();

    expect(mockedRemoveToast).toHaveBeenCalled();
  });
});
