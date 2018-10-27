module.exports = (importPath, t) => {
  if (importPath.isImportSpecifier()) {
    // import { memo as _memo } from 'react';
    const node = importPath.scope.generateUidIdentifier('memo');
    importPath.insertBefore(t.importSpecifier(node, t.identifier('memo')));
    return node;
  }
  if (importPath.isImportDefaultSpecifier() || importPath.isImportNamespaceSpecifier()) {
    // import React from 'react';
    return t.memberExpression(importPath.node.local, t.identifier('memo'));
  }
  if (importPath.isObjectPattern()) {
    // const { memo: _memo } = require('react');
    const node = importPath.scope.generateUidIdentifier('memo');
    importPath.get('properties.0').insertBefore(t.objectProperty(t.identifier('memo'), node));
    return node;
  }
  // const React = require('react');
  return t.memberExpression(importPath.node, t.identifier('memo'));
};
