import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

const transition = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: .3;
  }
  100% {
    opacity: 1;
  }
`;

export const Container = styled.button`
  background: #ff9000;
  height: 56px;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  color: #312e38;
  width: 100%;
  font-weight: 500;
  margin-top: 16px;
  transition: background-color 0.2s;

  svg {
    animation: ${transition} 2s ease-in-out infinite;
  }

  &:hover {
    background: ${shade(0.2, '#ff9000')};
  }
`;

export const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    margin-right: 8px;
  }
`;
