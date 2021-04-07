module.exports = {
  root: true,
  plugins: ['react'],
  extends: ['@react-native-community', 'plugin:react/recommended'],
  rules: {
    semi: ['error', 'always'],
    curly: ['error', 'multi-line'],
    radix: 0,
    eqeqeq: 0,
    quotes: 0,
    'no-regex-spaces': 0,
    'comma-dangle': ['error', 'never'],
    'consistent-this': [2, 'self'],
    'react/prop-types': 0,
    'react-native/no-inline-styles': 0,
    'react/display-name': 0,
    'react/no-string-refs': 0,
    'react/no-did-mount-set-state': 0,
    'consistent-this': 0,
    'no-control-regex': 0
  }
};
