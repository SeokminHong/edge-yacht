import { ReactNode } from 'react';
import { css, Global } from '@emotion/react';

import CanvasWrapper from './CanvasWrapper';

interface Props {
  children: ReactNode;
}

const Page = ({ children }: Props) => (
  <>
    <Global styles={globalStyles} />
    <CanvasWrapper>{children}</CanvasWrapper>
  </>
);

const globalStyles = css`
  html,
  body,
  #___gatsby,
  #gatsby-focus-wrapper {
    height: 100%;
    margin: 0;
  }
  body {
    font-family: 'Noto Sans KR', sans-serif;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'Black Han Sans', sans-serif;
  }
`;

export default Page;
