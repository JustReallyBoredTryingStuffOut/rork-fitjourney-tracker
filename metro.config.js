const { getDefaultConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  transformer: {
    ...config.transformer,
    // Configure for production builds
    minifierConfig: {
      keep_classnames: true,
      keep_fnames: true,
      mangle: {
        keep_classnames: true,
        keep_fnames: true,
      },
    },
  },
  resolver: {
    ...config.resolver,
    // Add support for .ts and .tsx files
    sourceExts: [...(config.resolver?.sourceExts || ['js', 'jsx']), 'ts', 'tsx'],
  },
}; 