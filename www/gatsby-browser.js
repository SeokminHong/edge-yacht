import * as React from 'react';
import Root from './src/components/Root';
import Page from './src/components/Page';

/** @type {import('gatsby').GatsbyBrowser['wrapRootElement']}*/
export const wrapRootElement = ({ element }) => {
  return <Root>{element}</Root>;
};

/** @type {import('gatsby').GatsbyBrowser['wrapPageElement']}*/
export const wrapPageElement = ({ element, props }) => {
  return <Page {...props}>{element}</Page>;
};
