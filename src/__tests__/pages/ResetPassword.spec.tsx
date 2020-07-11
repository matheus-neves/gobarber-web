import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import ResetPassword from '../../pages/ResetPassword';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    useLocation: () => ({
      search: '123456789',
    }),
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
    post: jest.fn(),
  };
});

describe('ResetPassword Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to reset password', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );

    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
    });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('should not be able to signin in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );

    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: 'not-valid-confirmation' },
    });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  // it('should not be able to signin with empty token', async () => {
  //   const { getByPlaceholderText, getByText } = render(<ResetPassword />);

  //   const passwordField = getByPlaceholderText('Nova senha');
  //   const passwordConfirmationField = getByPlaceholderText(
  //     'Confirmação da senha',
  //   );

  //   const buttonElement = getByText('Alterar senha');

  //   fireEvent.change(passwordField, { target: { value: '123456' } });
  //   fireEvent.change(passwordConfirmationField, {
  //     target: { value: '123456' },
  //   });
  //   fireEvent.click(buttonElement);

  //   await wait(() => {
  //     expect(mockedToken).toBeFalsy();
  //   });
  // });

  it('should display an error if login fails', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );

    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
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
