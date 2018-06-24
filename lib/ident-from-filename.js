const path = require('path');

const camelCase = require('camelcase');


module.exports = (filename) => {
  for (let parts = path.parse(filename); path.dir !== '/'; parts = path.parse(parts.dir)) {
    if (parts.name !== 'index') {
      return camelCase(parts.name, { pascalCase: true });
    }
  }
  // This line shouldn’t be reachable, but ESLint enforces to add a return statement at the end.
  /* istanbul ignore next */
  return '';
};
