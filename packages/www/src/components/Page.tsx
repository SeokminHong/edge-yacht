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
`;

export default Page;
