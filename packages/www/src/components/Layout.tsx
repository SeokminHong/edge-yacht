import { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

import Header from './Header';

interface Props {
  children: ReactNode;
  showHeader?: boolean;
}

const Layout = ({ children, showHeader = true }: Props) => {
  return (
    <Wrapper px="8" py="4">
      {showHeader && <Header />}
      <Content>{children}</Content>
      <Footer>
        Built with Gatsby
        <GatsbyLogo
          alt="Gatsby G Logo"
          src="data:image/svg+xml,%3Csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2a10 10 0 110 20 10 10 0 010-20zm0 2c-3.73 0-6.86 2.55-7.75 6L14 19.75c3.45-.89 6-4.02 6-7.75h-5.25v1.5h3.45a6.37 6.37 0 01-3.89 4.44L6.06 9.69C7 7.31 9.3 5.63 12 5.63c2.13 0 4 1.04 5.18 2.65l1.23-1.06A7.959 7.959 0 0012 4zm-8 8a8 8 0 008 8c.04 0 .09 0-8-8z' fill='%23639'/%3E%3C/svg%3E"
        />
      </Footer>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-image: url('/images/background.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const Content = styled.div`
  flex: 1;
  max-width: 960px;
  margin: auto;
`;

const Footer = styled.footer`
  color: #cfcfcf;
`;

const GatsbyLogo = styled.img`
  display: inline;
  vertical-align: middle;
`;

export default Layout;
