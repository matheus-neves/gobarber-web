import React, { ButtonHTMLAttributes } from 'react';
import { RiMailSendLine } from 'react-icons/ri';

import { Container, LoaderContainer } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" {...rest}>
    {loading ? (
      <LoaderContainer>
        <span>Enviando</span>
        <RiMailSendLine size={24} />
      </LoaderContainer>
    ) : (
      children
    )}
  </Container>
);

export default Button;
