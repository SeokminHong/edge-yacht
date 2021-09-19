import * as React from 'react';
import Root from './src/components/Root';
import Layout from './src/components/Layout';

/** @type {import('gatsby').GatsbyBrowser['wrapRootElement']}*/
export const wrapRootElement = ({ element }) => {
  return <Root>{element}</Root>;
};

/** @type {import('gatsby').GatsbyBrowser['wrapPageElement']}*/
export const wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>;
};
