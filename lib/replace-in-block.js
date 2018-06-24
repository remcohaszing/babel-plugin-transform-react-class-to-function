module.exports = (path, id, fn, statics, t) => {
  let ancestorPath = path;
  while (!t.isScopable(ancestorPath.parent)) {
    ancestorPath = ancestorPath.parentPath;
  }
  if (t.isArrowFunctionExpression(ancestorPath.parent)) {
    ancestorPath.replaceWith(t.blockStatement([
      t.returnStatement(ancestorPath.node),
    ]));
    // Babel will recurse into the created block statement path and replace the class in the second
    // run.
    return;
  }
  ancestorPath.insertBefore(t.variableDeclaration('const', [
    t.variableDeclarator(id, fn),
  ]));
  statics.forEach(({ key, value }) => {
    ancestorPath.insertBefore(t.expressionStatement(t.assignmentExpression(
      '=',
      t.MemberExpression(id, key),
      value,
    )));
  });
  if (t.isExportNamedDeclaration(ancestorPath)) {
    ancestorPath.replaceWith(t.exportNamedDeclaration(null, [
      t.exportSpecifier(t.cloneNode(id), t.cloneNode(id)),
    ]));
  } else {
    path.replaceWith(t.cloneNode(id));
  }
  if (t.isVariableDeclarator(path.parent) && t.isIdentifier(path.node, { name: id.name })) {
    path.parentPath.remove();
  } else if (t.isExpressionStatement(path.node)) {
    path.remove();
  }
};
