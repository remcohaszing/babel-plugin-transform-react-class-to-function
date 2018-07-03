const renderOpts = {
  async: false,
  generator: false,
};


module.exports = (path) => {
  let renderPath;
  const statics = [];
  const ok = path.get('body.body').every((statement) => {
    if (statement.isClassProperty({ static: true })) {
      statics.push(statement.node);
      return true;
    }
    if (!statement.get('key').isIdentifier({ name: 'render' })) {
      return false;
    }
    if (statement.isClassMethod(renderOpts)) {
      renderPath = statement.get('body');
      return true;
    }
    const value = statement.get('value');
    if (value.isArrowFunctionExpression(renderOpts)) {
      renderPath = value.get('body');
      return true;
    }
    return false;
  });
  return { ok, renderPath, statics };
};
