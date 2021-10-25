module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.yourdomain.tld',
    title: 'edge-yahtzee',
  },
  plugins: [
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/',
      },
      __key: 'images',
    },
    {
      resolve: '@chakra-ui/gatsby-plugin',
      options: {},
    },
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [`Noto+Sans+KR\:400,700`, `Black+Han+Sans`],
        display: 'swap',
      },
    },
  ],
};
