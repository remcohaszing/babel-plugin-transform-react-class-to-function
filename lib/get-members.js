const renderOpts = {
  async: false,
  generator: false,
};

function getFunctionBody(statement) {
  if (statement.isClassMethod(renderOpts)) {
    return statement.get('body');
  }
  const value = statement.get('value');
  if (value.isArrowFunctionExpression(renderOpts)) {
    return value.get('body');
  }
  return null;
}

module.exports = (path, memo) => {
  let renderPath;
  let scuPath;
  const statics = [];
  const ok = path.get('body.body').every((statement) => {
    if (statement.isClassProperty({ static: true })) {
      statics.push(statement.node);
      return true;
    }
    if (statement.get('key').isIdentifier({ name: 'render' })) {
      renderPath = getFunctionBody(statement);
      return renderPath;
    }
    if (memo && statement.get('key').isIdentifier({ name: 'shouldComponentUpdate' })) {
      scuPath = getFunctionBody(statement);
      return true;
    }
    return false;
  });
  return {
    ok,
    renderPath,
    scuPath,
    statics,
  };
};
