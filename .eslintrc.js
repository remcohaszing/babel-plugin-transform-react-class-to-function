module.exports = {
  extends: ['airbnb-base', 'plugin:prettier/recommended', 'prettier/react'],
  overrides: [
    {
      files: '**/fixtures/**',
      parser: 'babel-eslint',
      rules: {
        'class-methods-use-this': 'off',
        'max-classes-per-file': 'off',
        'no-unused-vars': 'off',

        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
      },
    },
  ],
};
