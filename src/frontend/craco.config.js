const { getLoader, loaderByName } = require('@craco/craco');

const packages = [];
// packages.push();

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // extract babel-loader
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName('babel-loader')
      );

      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];

        // add packages to babel-loader to transpile
        match.loader.include = include.concat(packages);
      }

      return webpackConfig;
    },
  },
};
