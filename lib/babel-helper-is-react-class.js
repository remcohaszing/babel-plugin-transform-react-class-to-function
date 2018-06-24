module.exports = (path, t) => {
  const { superClass } = path.node;

  if (!superClass) {
    return false;
  }

  let searchIdentifier = superClass;

  if (t.isMemberExpression(superClass)) {
    if (!t.isIdentifier(superClass.object)) {
      // class extends Unknown.Not.React.Component { }
      //               ^^^^^^^^^^^^
      return false;
    }
    if (!t.isIdentifier(superClass.property, { name: 'Component' })) {
      // class extends React.NotComponent { }
      //                     ^^^^^^^^^^^^
      return false;
    }
    // Search for the default React import, not a named Component import.
    searchIdentifier = superClass.object;
  }

  const binding = path.scope.getBinding(searchIdentifier.name);

  if (!binding) {
    return false;
  }

  if (t.isImportDeclaration(binding.path.parent)) {
    // import 'some-module';
    // ^^^^^^
    if (!t.isStringLiteral(binding.path.parent.source, { value: 'react' })) {
      // import 'react';
      //        ^^^^^^^
      return false;
    }
    if (searchIdentifier === superClass) {
      if (t.isImportSpecifier(binding.path.node)) {
        // import { Component as Whatever} from 'react';
        //          ^^^^^^^^^
        return t.isIdentifier(binding.path.node.imported, { name: 'Component' });
      }
      return false;
    }
    // import Whatever from 'react';
    // class extends Whatever.Component { }
    return t.isImportDefaultSpecifier(binding.path.node);
  }

  if (t.isVariableDeclarator(binding.path.node)) {
    if (!t.isCallExpression(binding.path.node.init)) {
      // const Whatever = fn()
      //                    ^^
      return false;
    }
    if (!t.isIdentifier(binding.path.node.init.callee, { name: 'require' })) {
      // const Whatever = require()
      //                  ^^^^^^^
      return false;
    }
    if (!t.isStringLiteral(binding.path.node.init.arguments[0], { value: 'react' })) {
      // const Whatever = require('react')
      //                          ^^^^^^^
      return false;
    }
    if (searchIdentifier !== superClass) {
      // const React = require('react')
      //       ^^^^^
      return t.isIdentifier(binding.path.node.id);
    }
    // const { Whatever: Component } = require('react')
    //         ^^^^^^^^  ^^^^^^^^^
    return binding.path.node.id.properties.some(({ key, value }) => (
      value === binding.identifier && t.isIdentifier(key, { name: 'Component' })
    ));
  }

  return false;
};
