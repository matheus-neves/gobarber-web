import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import ForgotPassword from '../../pages/ForgotPassword';

const mockedHistoryPush = jest.fn();
const mockedPost = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

jest.mock('../../services/api', () => {
  return {
    post: () => {
      mockedPost();
    },
  };
});

describe('ForgotPassword Page', () => {
  beforeEach(() => {
    mockedPost.mockClear();
  });

  it('should be able to recovery password', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('E-mail');

    const buttonElement = getByText('Recuperar');

    fireEvent.change(emailField, {
      target: { value: 'johndoe@example.com.br' },
    });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedPost).toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should not be able to recovery password with invalid email', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('E-mail');

    const buttonElement = getByText('Recuperar');

    fireEvent.change(emailField, {
      target: { value: 'not-valid-email' },
    });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedPost).not.toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });

  it('should display an error when api recovery password fails', async () => {
    mockedPost.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('E-mail');

    const buttonElement = getByText('Recuperar');

    fireEvent.change(emailField, {
      target: { value: 'johndoe@example.com' },
    });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
