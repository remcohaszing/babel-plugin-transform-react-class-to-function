const { declare } = require('@babel/helper-plugin-utils');

const pkg = require('../package.json');
const isReactClass = require('./babel-helper-is-react-class');
const getMembers = require('./get-members');
const identFromFilename = require('./ident-from-filename');
const processProps = require('./process-props');
const replaceInBlock = require('./replace-in-block');


module.exports = declare(({ assertVersion, types: t }) => {
  assertVersion(7);

  const bodyVisitor = {
    ThisExpression(path) {
      if (path.parentPath.get('property').isIdentifier({ name: 'props' })) {
        this.props.push(path.parentPath);
        return;
      }
      this.ok = false;
      path.stop();
    },

    JSXAttribute(path) {
      if (!path.get('name').isJSXIdentifier({ name: 'ref' })) {
        return;
      }
      const value = path.get('value');
      if (value.isStringLiteral() || value.get('expression').isStringLiteral()) {
        this.refs.push(path);
      }
    },
  };

  return {
    name: pkg.name,

    visitor: {
      Class(path) {
        if (!isReactClass(path)) {
          return;
        }

        // Decorators can’t be applied to functions.
        if (path.node.decorators) {
          return;
        }

        const { ok, renderPath, statics } = getMembers(path);

        if (!ok) {
          return;
        }

        const state = {
          props: [],
          refs: [],
          ok: true,
        };

        // get the render method and make sure it doesn't have any other methods
        renderPath.traverse(bodyVisitor, state);

        if (!state.ok) {
          return;
        }

        let id;
        if (path.get('id').isIdentifier()) {
          ({ id } = path.node);
        } else if (path.parentPath.isVariableDeclarator()) {
          ({ id } = path.parent);
        } else {
          id = path.scope.generateUidIdentifier(identFromFilename(this.filename));
        }

        const functionArguments = processProps(state.props, path);

        const fn = t.arrowFunctionExpression(functionArguments, renderPath.node);

        state.refs.forEach((ref) => {
          ref.remove();
        });

        replaceInBlock(path, id, fn, statics, t);
      },
    },
  };
});
