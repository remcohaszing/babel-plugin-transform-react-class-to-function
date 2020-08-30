module.exports = (path, id, fn, statics, t) => {
  let ancestorPath = path;
  while (!ancestorPath.parentPath.isScopable()) {
    ancestorPath = ancestorPath.parentPath;
  }
  if (ancestorPath.isExportNamedDeclaration()) {
    ancestorPath.replaceWith(
      t.exportNamedDeclaration(null, [t.exportSpecifier(t.cloneNode(id), id)]),
    );
  } else {
    path.replaceWith(id);
  }
  if (ancestorPath.parentPath.isArrowFunctionExpression()) {
    [ancestorPath] = ancestorPath
      .replaceWith(t.blockStatement([t.returnStatement(ancestorPath.node)]))[0]
      .get('body');
  }
  ancestorPath.insertBefore([
    t.variableDeclaration('const', [t.variableDeclarator(t.cloneNode(id), t.cloneNode(fn))]),
    ...statics.map(({ key, value }) =>
      t.expressionStatement(
        t.assignmentExpression('=', t.MemberExpression(t.cloneNode(id), key), value),
      ),
    ),
  ]);
  if (path.parentPath.isVariableDeclarator() && path.isIdentifier(id)) {
    path.parentPath.remove();
  } else if (path.isExpressionStatement()) {
    path.remove();
  }
};
