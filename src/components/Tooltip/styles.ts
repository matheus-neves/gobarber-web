import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  span {
    position: absolute;
    bottom: calc(100% + 6px);
    width: 160px;
    padding: 8px;
    left: 50%;
    transform: translateX(-50%);

    background: #ff9000;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    color: #312e38;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.4s;

    &:before {
      content: '';
      border-style: solid;
      border-color: #ff9000 transparent;
      border-width: 6px 6px 0 6px;
      top: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &:hover span {
    opacity: 1;
    visibility: visible;
  }
`;
