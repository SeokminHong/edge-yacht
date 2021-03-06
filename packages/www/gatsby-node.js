const path = require('path');

/** @type {import('gatsby').GatsbyNode['onCreateBabelConfig']} */
exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: '@babel/plugin-transform-react-jsx',
    options: {
      runtime: 'automatic',
    },
  });
  actions.setBabelPreset({
    name: 'babel-preset-gatsby',
    options: {
      reactRuntime: 'automatic',
    },
  });
};

/** @type {import('gatsby').GatsbyNode['onCreateWebpackConfig']} */
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      // Set alias for module paths
      alias: {
        '~audios': path.resolve(__dirname, 'src/audios'),
        '~components': path.resolve(__dirname, 'src/components'),
        '~contexts': path.resolve(__dirname, 'src/contexts'),
        '~data': path.resolve(__dirname, 'src/data'),
        '~hooks': path.resolve(__dirname, 'src/hooks'),
        '~locale': path.resolve(__dirname, 'src/locale'),
        '~meshes': path.resolve(__dirname, 'src/meshes'),
        '~utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  });
};
