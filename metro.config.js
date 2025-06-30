const { getDefaultConfig, mergeConfig } = require('metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const customConfig = {
  transformer: {
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
    // Add support for .ts and .tsx files with fallback
    sourceExts: [...(defaultConfig.resolver?.sourceExts || ['js', 'jsx']), 'ts', 'tsx'],
  },
};

module.exports = mergeConfig(defaultConfig, customConfig); 