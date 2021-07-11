/**
 * Check if the super class extends a React component.
 *
 * @param {object} path - The extended identifier node path to check.
 * @returns {string} The type of component or null
 */
function checkSuperClassIdentifier(path) {
  if (path.isIdentifier({ name: 'Component' })) {
    return 'Component';
  }
  if (path.isIdentifier({ name: 'PureComponent' })) {
    return 'PureComponent';
  }
  return null;
}

module.exports = (path) => {
  const superClass = path.get('superClass');

  if (!superClass.node) {
    return null;
  }

  let searchIdentifier = superClass;
  let type = 'Component';

  if (superClass.isMemberExpression()) {
    if (!superClass.get('object').isIdentifier()) {
      // class extends Unknown.Not.React.Component { }
      //               ^^^^^^^^^^^^
      return null;
    }
    const property = superClass.get('property');
    type = checkSuperClassIdentifier(property);
    if (!type) {
      return null;
    }
    // Search for the default React import, not a named Component import.
    searchIdentifier = superClass.get('object');
  }

  const binding = path.scope.getBinding(searchIdentifier.node.name);

  if (!binding) {
    return null;
  }

  if (binding.path.parentPath.isImportDeclaration()) {
    // import 'some-module';
    // ^^^^^^
    if (!binding.path.parentPath.get('source').isStringLiteral({ value: 'react' })) {
      // import 'react';
      //        ^^^^^^^
      return null;
    }
    if (searchIdentifier === superClass) {
      if (binding.path.isImportSpecifier()) {
        // import { Component as Whatever} from 'react';
        //          ^^^^^^^^^
        type = checkSuperClassIdentifier(binding.path.get('imported'));
        return {
          type,
          import: binding.path,
        };
      }
      return null;
    }
    // import Whatever from 'react';
    // class extends Whatever.Component { }
    return {
      type,
      import: binding.path,
    };
  }

  if (binding.path.isVariableDeclarator()) {
    const init = binding.path.get('init');
    if (!init.isCallExpression()) {
      // const Whatever = fn()
      //                    ^^
      return null;
    }
    if (!init.get('callee').isIdentifier({ name: 'require' })) {
      // const Whatever = require()
      //                  ^^^^^^^
      return null;
    }
    if (!init.get('arguments.0').isStringLiteral({ value: 'react' })) {
      // const Whatever = require('react')
      //                          ^^^^^^^
      return null;
    }
    const id = binding.path.get('id');
    if (searchIdentifier !== superClass) {
      // const React = require('react')
      //       ^^^^^
      return { type, import: id };
    }
    // const { Whatever: Component } = require('react')
    //         ^^^^^^^^  ^^^^^^^^^
    let result;
    id.get('properties').some((property) => {
      if (property.get('value').isIdentifier(binding.identifier)) {
        result = checkSuperClassIdentifier(property.get('key'));
        return true;
      }
      return false;
    });
    return { type: result, import: id };
  }

  return null;
};
