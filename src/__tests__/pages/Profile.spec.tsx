import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import Profile from '../../pages/Profile';

const mockedHistoryPush = jest.fn();
const mockedPut = jest.fn(() => ({}));
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
    put: () => mockedPut(),
    patch: () => jest.fn(),
  };
});

describe('Profile Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedAddToast.mockClear();
    mockedPut.mockClear();
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

  it('should be able to update profile without updating password', async () => {
    const { getByPlaceholderText, getByText } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Confirmar mudanças');

    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should be able to update avatar profile', async () => {
    const { getByTestId } = render(<Profile />);

    const inputFileElement = getByTestId('input-file');

    fireEvent.change(inputFileElement, {
      target: {
        files: ['picture-test.jpg'],
      },
    });

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith({
        type: 'success',
        title: 'Avatar atualizado!',
      });
    });
  });

  it('should not be able to update avatar profile with empty input file value', async () => {
    const { getByTestId } = render(<Profile />);

    const inputFileElement = getByTestId('input-file');

    fireEvent.change(inputFileElement, {
      target: {
        files: [],
      },
    });

    await wait(() => {
      expect(mockedAddToast).not.toHaveBeenCalled();
    });
  });

  it('should display an error with update profile fails', async () => {
    mockedPut.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');

    const oldPassowordField = getByPlaceholderText('Senha atual');
    const passwordField = getByPlaceholderText('Nova senha');
    const confirmationPassowordField = getByPlaceholderText('Confirmar senha');

    const buttonElement = getByText('Confirmar mudanças');

    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });

    fireEvent.change(oldPassowordField, { target: { value: '' } });
    fireEvent.change(passwordField, { target: { value: '' } });
    fireEvent.change(confirmationPassowordField, { target: { value: '' } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
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
    });
  });
});
