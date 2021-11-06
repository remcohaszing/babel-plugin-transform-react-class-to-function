const parserOptions = {
  requireConfigFile: false,
  babelOptions: {
    parserOpts: {
      plugins: ['classProperties', ['decorators', { decoratorsBeforeExport: true }], 'jsx'],
    },
  },
};

module.exports = {
  extends: ['remcohaszing', 'remcohaszing/jest'],
  ignorePatterns: ['output.mjs'],
  rules: {
    'capitalized-comments': 'off',
    'new-cap': 'off',
    'jest/require-hook': 'off',
  },
  overrides: [
    {
      files: '**/fixtures/**',
      extends: ['remcohaszing/babel'],
      parserOptions,
      rules: {
        'class-methods-use-this': 'off',
        'id-denylist': 'off',
        'max-classes-per-file': 'off',
        'no-empty-function': 'off',
        'no-unused-vars': 'off',
        'no-undef': 'off',
        'no-underscore-dangle': 'off',
        'require-await': 'off',

        'import/no-anonymous-default-export': 'off',
        'import/no-commonjs': 'off',
        'import/no-default-export': 'off',
        'import/no-unresolved': 'off',

        'jsdoc/require-jsdoc': 'off',

        'unicorn/import-style': 'off',
      },
    },
    {
      files: '*.md/*.js',
      extends: ['remcohaszing/babel'],
      parserOptions,
      rules: {
        'no-undef': 'off',

        'import/no-commonjs': 'off',
      },
    },
  ],
};
