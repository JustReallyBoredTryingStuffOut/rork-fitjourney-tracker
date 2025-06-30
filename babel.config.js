module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['module:metro-react-native-babel-preset', {
        unstable_transformProfile: 'hermes-stable',
      }]
    ],
    plugins: [
      '@babel/plugin-transform-flow-strip-types',
      '@babel/plugin-transform-export-namespace-from',
      '@babel/plugin-proposal-export-default-from',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-transform-logical-assignment-operators',
      '@babel/plugin-proposal-function-bind',
      '@babel/plugin-proposal-partial-application',
      ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
      '@babel/plugin-proposal-record-and-tuple',
      '@babel/plugin-proposal-throw-expressions'
    ],
    env: {
      production: {
        plugins: ['transform-remove-console']
      }
    },
    overrides: [
      {
        test: /node_modules\/react-native\/.*\.js$/,
        plugins: [
          ['@babel/plugin-transform-flow-strip-types', { 
            allowDeclareFields: true,
            allowDeclareClassFields: true,
            allowDeclareClassMethods: true
          }]
        ]
      }
    ]
  };
}; 