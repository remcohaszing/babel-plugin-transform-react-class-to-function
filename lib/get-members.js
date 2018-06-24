const renderOpts = {
  async: false,
  generator: false,
};


module.exports = (path, t) => {
  let renderPath;
  const statics = [];
  const ok = path.node.body.body.every((node, index) => {
    if (node.static) {
      statics.push(node);
      return true;
    }
    if (!t.isIdentifier(node.key, { name: 'render' })) {
      return false;
    }
    if (t.isClassMethod(node, renderOpts)) {
      renderPath = path.get(`body.body.${index}.body`);
      return true;
    }
    if (t.isArrowFunctionExpression(node.value, renderOpts)) {
      renderPath = path.get(`body.body.${index}.value.body`);
      return true;
    }
    return false;
  });
  return { ok, renderPath, statics };
};
