module.exports = {
  extends: 'airbnb',
  overrides: [{
    files: '**/fixtures/**',
    parser: 'babel-eslint',
    rules: {
      'no-unused-vars': 'off',
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      'react/default-props-match-prop-types': 'off',
      'react/destructuring-assignment': 'off',
      'react/jsx-filename-extension': 'off',
      'react/prefer-stateless-function': 'off',
      'react/prop-types': 'off',
    },
  }],
};
