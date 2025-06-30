module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['module:metro-react-native-babel-preset', {
        unstable_transformProfile: 'hermes-stable',
      }]
    ],
    plugins: [
      '@babel/plugin-transform-flow-strip-types'
    ],
  };
}; 