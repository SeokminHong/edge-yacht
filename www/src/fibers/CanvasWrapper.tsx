import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled from '@emotion/styled';

const Fallback = () => <div>Cannot load canvas.</div>;

interface CanvasProps {
  className?: string;
  children: ReactNode;
}

const CanvasWrapper = ({ className, children }: CanvasProps) => (
  <ErrorBoundary fallback={<Fallback />}>
    <div className={className}>{children}</div>
  </ErrorBoundary>
);

export default styled(CanvasWrapper)`
  position: absolute;
  height: 100%;
  width: 100%;
  max-width: 1920px;
  top: 0;
  left: 0;
`;
