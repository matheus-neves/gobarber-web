import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import Profile from '../../pages/Profile';
import * as GetErrors from '../../utils/getValidationErrors';

const mockedHistoryPush = jest.fn();
const mockedPut = jest.fn().mockImplementation(() => ({
  id: 1,
  name: 'John Doe',
  email: 'johndoe@example.com.br',
  avatar_url: 'avatar-example.jpg',
}));
const mockedAddToast = jest.fn();

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      user: {
        name: 'John Doe',
        email: 'johndoe@example.com.br',
        avatar_url: 'avatar-example.jpg',
      },
      updateUser: () => jest.fn(),
    }),
  };
});

jest.mock('../../services/api', () => {
  return {
    put: () => {
      return mockedPut;
    },
  };
});

describe('Profile Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to update profile', async () => {
    const { getByPlaceholderText, getByText } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const oldPasswordField = getByPlaceholderText('Senha atual');
    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText('Confirmar senha');
    const buttonElement = getByText('Confirmar mudanças');

    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(oldPasswordField, { target: { value: '123456' } });
    fireEvent.change(passwordField, { target: { value: '123123' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123123' },
    });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not be able to update profile in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const oldPasswordField = getByPlaceholderText('Senha atual');
    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText('Confirmar senha');
    const buttonElement = getByText('Confirmar mudanças');

    const spyGetValidationError = jest.spyOn(GetErrors, 'default');

    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    fireEvent.change(emailField, { target: { value: 'johndoe' } });
    fireEvent.change(oldPasswordField, { target: { value: '123456' } });
    fireEvent.change(passwordField, { target: { value: '123123' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123123' },
    });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedPut).not.toHaveBeenCalled();
      expect(spyGetValidationError).toHaveReturnedWith({
        email: 'Digite um e-mail válido',
      });
    });
  });
});
