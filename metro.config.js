const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

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
    // Add support for .ts and .tsx files
    sourceExts: [...defaultConfig.resolver.sourceExts, 'ts', 'tsx'],
  },
};

const config = mergeConfig(defaultConfig, customConfig);

module.exports = withNativeWind(config, { input: './global.css' }); 