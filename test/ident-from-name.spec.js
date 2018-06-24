const assert = require('assert');

const identFromFilename = require('../lib/ident-from-filename');


const params = {
  '/home/user/Projects/some-component.js': 'SomeComponent',
  '/home/user/Projects/some-component.jsx': 'SomeComponent',
  '/home/user/Projects/some-component.mjs': 'SomeComponent',
  '/home/user/Projects/some-module/index.js': 'SomeModule',
  '/home/user/Projects/nested-module/index/index.js': 'NestedModule',
  '/index/index.js': '',
};


describe('identFromFilename', () => {
  Object.entries(params).forEach(([input, expected]) => {
    it(`should convert ${input} to ${expected}`, () => {
      const result = identFromFilename(input);
      assert.equal(result, expected);
    });
  });
});
