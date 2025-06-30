module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'metro-react-native-babel-preset'
    ],
    plugins: [
      '@babel/plugin-transform-runtime'
    ]
  };
}; 