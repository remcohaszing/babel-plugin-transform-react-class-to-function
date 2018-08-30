const path = require('path');

const pluginTester = require('babel-plugin-tester');

const plugin = require('../lib');


pluginTester({
  plugin,
  fixtures: path.join(__dirname, 'fixtures'),
  babelOptions: {
    parserOpts: {
      plugins: [
        'classProperties',
        ['decorators', { decoratorsBeforeExport: true }],
        'jsx',
      ],
    },
  },
});
