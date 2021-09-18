import * as React from 'react';
import Layout from './src/components/Layout';

/** @type {import('gatsby').GatsbySSR['wrapPageElement']}*/
export const wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>;
};
