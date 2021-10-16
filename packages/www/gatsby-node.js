const path = require('path');

/** @type {import('gatsby').GatsbyNode['onCreateBabelConfig']} */
exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: '@babel/plugin-transform-react-jsx',
    options: {
      runtime: 'automatic',
    },
  });
};

/** @type {import('gatsby').GatsbyNode['onCreateWebpackConfig']} */
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      // Set alias for module paths
      alias: {
        '~components': path.resolve(__dirname, 'src/components'),
        '~contexts': path.resolve(__dirname, 'src/contexts'),
        '~hooks': path.resolve(__dirname, 'src/hooks'),
        '~meshes': path.resolve(__dirname, 'src/meshes'),
        '~utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  });
};
