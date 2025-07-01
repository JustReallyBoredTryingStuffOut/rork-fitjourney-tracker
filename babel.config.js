module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['module:metro-react-native-babel-preset', {
        unstable_transformProfile: 'hermes-stable',
      }],
      '@babel/preset-typescript'
    ],
    plugins: [
      ['@babel/plugin-transform-flow-strip-types', { 
        allowDeclareFields: true,
        allowDeclareClassFields: true,
        allowDeclareClassMethods: true
      }],
      '@babel/plugin-transform-export-namespace-from',
      '@babel/plugin-proposal-export-default-from',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-transform-class-properties', { loose: true }],
      '@babel/plugin-transform-optional-chaining',
      '@babel/plugin-transform-nullish-coalescing-operator',
      '@babel/plugin-transform-logical-assignment-operators',
      '@babel/plugin-proposal-function-bind',
      '@babel/plugin-proposal-partial-application',
      ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
      '@babel/plugin-proposal-record-and-tuple',
      '@babel/plugin-proposal-throw-expressions',
      '@babel/plugin-transform-runtime',
      'transform-remove-console'
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
            allowDeclareClassMethods: true,
            all: true
          }]
        ],
        presets: [
          ['@babel/preset-env', {
            targets: {
              node: 'current'
            }
          }]
        ]
      }
    ]
  };
}; 