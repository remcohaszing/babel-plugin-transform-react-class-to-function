const path = require('path');


module.exports = (filename) => {
  if (filename == null) {
    return '';
  }
  for (let parts = path.parse(filename); path.dir !== '/'; parts = path.parse(parts.dir)) {
    if (parts.name !== 'index') {
      return parts.name.replace(/(?:^|\W+)(.)/g, (match, chr) => chr.toUpperCase());
    }
  }
  // This line shouldn’t be reachable, but ESLint enforces to add a return statement at the end.
  /* istanbul ignore next */
  return '';
};
