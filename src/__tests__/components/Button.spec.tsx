import React from 'react';

import { render, fireEvent, wait } from '@testing-library/react';
import Button from '../../components/Button';

describe('Button component', () => {
  it('should be able to render an input', async () => {
    const { getByTestId } = render(
      <Button loading type="submit">
        Recuperar
      </Button>,
    );

    const buttonElement = getByTestId('button-container');

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(buttonElement).not.toHaveTextContent('Recuperar');
    });
  });
});
