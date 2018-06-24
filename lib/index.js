const pkg = require('../package.json');
const isReactClass = require('./babel-helper-is-react-class');
const getMembers = require('./get-members');
const identFromFilename = require('./ident-from-filename');
const processProps = require('./process-props');
const replaceInBlock = require('./replace-in-block');


module.exports = ({ types: t }) => {
  const bodyVisitor = {
    ThisExpression(path) {
      if (t.isIdentifier(path.parent.property, { name: 'props' })) {
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
        if (!isReactClass(path, t)) {
          return;
        }

        // Decorators can’t be applied to functions.
        if (path.node.decorators) {
          return;
        }

        const { ok, renderPath, statics } = getMembers(path, t);

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
        if (t.isIdentifier(path.node.id)) {
          id = t.cloneNode(path.node.id);
        } else if (t.isVariableDeclarator(path.parentPath.node)) {
          id = t.cloneNode(path.parentPath.node.id);
        } else {
          id = path.scope.generateUidIdentifier(identFromFilename(this.filename));
        }

        const functionArguments = processProps(state.props, path, t);

        const fn = t.arrowFunctionExpression(functionArguments, renderPath.node);

        replaceInBlock(path, id, fn, statics, t);
      },
    },
  };
};
