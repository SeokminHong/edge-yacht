import { Link } from 'gatsby';
import styled from '@emotion/styled';

import SEO from '~components/SEO';

const NotFoundPage = () => {
  return (
    <Main>
      <SEO title="404: Not found" />
      <Heading>Page not found</Heading>
      <Paragraph>
        Sorry{' '}
        <span role="img" aria-label="Pensive emoji">
          😔
        </span>{' '}
        we couldn’t find what you were looking for.
        <br />
        {process.env.NODE_ENV === 'development' ? (
          <>
            <br />
            Try creating a page in <Code>src/pages/</Code>.
            <br />
          </>
        ) : null}
        <br />
        <Link to="/">Go home</Link>.
      </Paragraph>
    </Main>
  );
};
const Main = styled.main`
  color: '#232129';
  padding: '96px';
  font-family: '-apple-system, Roboto, sans-serif, serif';
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 64;
  max-width: 320;
`;

const Paragraph = styled.p`
  margin-bottom: 48;
`;

const Code = styled.code`
  color: '#8A6534';
  padding: 4;
  background-color: '#FFF4DB';
  font-size: '1.25rem';
  border-radius: 4;
`;

export default NotFoundPage;
