const { getDefaultConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

// Basic configuration for React Native
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
};

// Configure resolver
config.resolver = {
  ...config.resolver,
  resolverMainFields: ['react-native', 'browser', 'main'],
  platforms: ['ios', 'android', 'native', 'web'],
};

module.exports = config;