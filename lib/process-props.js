module.exports = (propNodes, path) => {
  if (propNodes.length === 0) {
    return [];
  }
  if (
    propNodes.length === 1
    && propNodes[0].parentPath.isVariableDeclarator()
    && propNodes[0].parentPath.get('id').isObjectPattern()
  ) {
    propNodes[0].parentPath.remove();
    return [propNodes[0].parent.id];
  }
  const identifier = path.scope.generateUidIdentifier('props');

  propNodes.forEach((prop) => {
    prop.replaceWith(identifier);
  });
  return [identifier];
};
