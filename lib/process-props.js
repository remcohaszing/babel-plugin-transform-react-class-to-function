module.exports = (propNodes, path, t) => {
  if (propNodes.length === 0) {
    return [];
  }
  if (
    propNodes.length === 1
    && t.isVariableDeclarator(propNodes[0].parent)
    && t.isObjectPattern(propNodes[0].parent.id)
  ) {
    propNodes[0].parentPath.remove();
    return [propNodes[0].parent.id];
  }
  const identifier = path.scope.generateUidIdentifier('props');

  propNodes.forEach((prop) => {
    prop.replaceWith(t.cloneNode(identifier));
  });
  return [identifier];
};
