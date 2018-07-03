module.exports = (path, id, fn, statics, t) => {
  let ancestorPath = path;
  while (!ancestorPath.parentPath.isScopable()) {
    ancestorPath = ancestorPath.parentPath;
  }
  if (ancestorPath.parentPath.isArrowFunctionExpression()) {
    ancestorPath.replaceWith(t.blockStatement([
      t.returnStatement(ancestorPath.node),
    ]));
    // Babel will recurse into the created block statement path and replace the class in the second
    // run.
    return;
  }
  ancestorPath.insertBefore([
    t.variableDeclaration('const', [
      t.variableDeclarator(id, fn),
    ]),
    ...statics.map(({ key, value }) => (
      t.expressionStatement(t.assignmentExpression(
        '=',
        t.MemberExpression(id, key),
        value,
      ))
    )),
  ]);
  if (ancestorPath.isExportNamedDeclaration()) {
    ancestorPath.replaceWith(t.exportNamedDeclaration(null, [
      t.exportSpecifier(id, id),
    ]));
  } else {
    path.replaceWith(id);
  }
  if (path.parentPath.isVariableDeclarator() && path.isIdentifier(id)) {
    path.parentPath.remove();
  } else if (path.isExpressionStatement()) {
    path.remove();
  }
};
