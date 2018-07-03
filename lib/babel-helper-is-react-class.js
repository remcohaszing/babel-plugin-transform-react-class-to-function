module.exports = (path) => {
  const superClass = path.get('superClass');

  if (!superClass.node) {
    return false;
  }

  let searchIdentifier = superClass;

  if (superClass.isMemberExpression()) {
    if (!superClass.get('object').isIdentifier()) {
      // class extends Unknown.Not.React.Component { }
      //               ^^^^^^^^^^^^
      return false;
    }
    if (!superClass.get('property').isIdentifier({ name: 'Component' })) {
      // class extends React.NotComponent { }
      //                     ^^^^^^^^^^^^
      return false;
    }
    // Search for the default React import, not a named Component import.
    searchIdentifier = superClass.get('object');
  }

  const binding = path.scope.getBinding(searchIdentifier.node.name);

  if (!binding) {
    return false;
  }

  if (binding.path.parentPath.isImportDeclaration()) {
    // import 'some-module';
    // ^^^^^^
    if (!binding.path.parentPath.get('source').isStringLiteral({ value: 'react' })) {
      // import 'react';
      //        ^^^^^^^
      return false;
    }
    if (searchIdentifier === superClass) {
      if (binding.path.isImportSpecifier()) {
        // import { Component as Whatever} from 'react';
        //          ^^^^^^^^^
        return binding.path.get('imported').isIdentifier({ name: 'Component' });
      }
      return false;
    }
    // import Whatever from 'react';
    // class extends Whatever.Component { }
    return binding.path.isImportDefaultSpecifier();
  }

  if (binding.path.isVariableDeclarator()) {
    const init = binding.path.get('init');
    if (!init.isCallExpression()) {
      // const Whatever = fn()
      //                    ^^
      return false;
    }
    if (!init.get('callee').isIdentifier({ name: 'require' })) {
      // const Whatever = require()
      //                  ^^^^^^^
      return false;
    }
    if (!init.get('arguments.0').isStringLiteral({ value: 'react' })) {
      // const Whatever = require('react')
      //                          ^^^^^^^
      return false;
    }
    const id = binding.path.get('id');
    if (searchIdentifier !== superClass) {
      // const React = require('react')
      //       ^^^^^
      return id.isIdentifier();
    }
    // const { Whatever: Component } = require('react')
    //         ^^^^^^^^  ^^^^^^^^^
    return id.get('properties').some(property => (
      property.get('value').isIdentifier(binding.identifier) && property.get('key').isIdentifier({ name: 'Component' })
    ));
  }

  return false;
};
