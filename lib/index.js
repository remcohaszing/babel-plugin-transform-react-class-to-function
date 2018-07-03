const pkg = require('../package.json');
const isReactClass = require('./babel-helper-is-react-class');
const getMembers = require('./get-members');
const identFromFilename = require('./ident-from-filename');
const processProps = require('./process-props');
const replaceInBlock = require('./replace-in-block');


module.exports = ({ types: t }) => {
  const bodyVisitor = {
    ThisExpression(path) {
      if (path.parentPath.get('property').isIdentifier({ name: 'props' })) {
        this.props.push(path.parentPath);
        return;
      }
      this.ok = false;
      path.stop();
    },

    JSXIdentifier(path) {
      if (path.node.name === 'ref') {
        this.ok = false;
        path.stop();
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

        replaceInBlock(path, id, fn, statics, t);
      },
    },
  };
};
