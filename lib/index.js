const { declare } = require('@babel/helper-plugin-utils');

const pkg = require('../package.json');
const isReactClass = require('./babel-helper-is-react-class');
const getMembers = require('./get-members');
const identFromFilename = require('./ident-from-filename');
const importMemo = require('./import-memo');
const processProps = require('./process-props');
const replaceInBlock = require('./replace-in-block');


module.exports = declare(({ assertVersion, types: t }, { memo }) => {
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
        const superClass = isReactClass(path, memo);
        if (!superClass) {
          return;
        }

        if (!memo && superClass.type !== 'Component') {
          return;
        }

        // Decorators can’t be applied to functions.
        if (path.node.decorators) {
          return;
        }

        const {
          ok,
          renderPath,
          scuPath,
          statics,
        } = getMembers(path, memo);

        if (!ok) {
          return;
        }

        if (!renderPath) {
          // skip if render method doesn't exist
          return;
        }

        const state = {
          props: [],
          refs: [],
          ok: true,
        };

        const scuState = {
          props: [],
          ok: true,
        };

        // get the render method and make sure it doesn't have any other methods
        renderPath.traverse(bodyVisitor, state);

        if (scuPath) {
          // get the render method and make sure it doesn't have any other methods
          scuPath.traverse(bodyVisitor, scuState);
        }

        if (!state.ok || !scuState.ok) {
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
        const scuProps = processProps(scuState.props, path);

        let fn = t.arrowFunctionExpression(functionArguments, renderPath.node);
        if (memo) {
          const memoNode = importMemo(superClass.import, t);
          if (scuPath) {
            fn = t.callExpression(
              memoNode,
              [
                fn,
                t.arrowFunctionExpression([scuPath.parent.params[0], scuProps[0]], scuPath.node),
              ],
            );
          } else if (superClass.type === 'PureComponent') {
            fn = t.callExpression(
              memoNode,
              [fn],
            );
          }
        }

        state.refs.forEach((ref) => {
          ref.remove();
        });

        replaceInBlock(path, id, fn, statics, t);
      },
    },
  };
});
