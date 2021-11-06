# babel-plugin-transform-react-class-to-function

> A Babel 7 plugin which transforms React component classes into functions

[![npm version][npm-image]][npm-url] [![build status][github-actions-image]][github-actions-url]
[![codecov][codecov-image]][codecov-url]

Writing React components using the class syntax has several benefits:

- **Consistency** — Define all components using similar syntax.
- **Static properties** — Components are more self contained when using static class properties.
- **Simpler diffs** — No need to change the entire indentation converting between classes and
  functions.

There is one obvious downside:

- **Size** — Class components are larger than function components.

This plugin solves that for you. 😃

## Example

### In

```js
import PropTypes from 'prop-types';
import { Component } from 'react';

export class HelloWorld extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    const { className } = this.props;

    return <div className={className}>Hello world!</div>;
  }
}
```

### Out

```js
import PropTypes from 'prop-types';
import { Component } from 'react';

export const HelloWorld = ({ className }) => <div className={className}>Hello world!</div>;

HelloWorld.propTypes = {
  className: PropTypes.string,
};
```

## Installation

```sh
npm install @babel/core babel-plugin-transform-react-class-to-function
```

## Usage

### Via `babel.config.js` (Recommended)

```js
module.exports = (api) => ({
  plugins: ['babel-plugin-transform-react-class-to-function'],
});
```

### Via CLI

```sh
babel --plugins babel-plugin-transform-react-class-to-function
```

### Via Node API

```js
require('@babel/core').transform(code, {
  plugins: ['babel-plugin-transform-react-class-to-function'],
});
```

## Options

### `memo`

- `true`: Transform `PureComponent` and components implementing `shouldComponentUpdate` to
  functional components using [React memo].
- `false` (default): Don’t transform `PureComponent` or components implementing
  `shouldComponentUpdate`.

## Special Thanks

This plugin was originally based on [babel-plugin-transform-react-pure-class-to-function]. However,
the project has diverged a lot. You may want to give that project a try if you need to use babel 6.

[babel-plugin-transform-react-pure-class-to-function]:
  https://www.npmjs.com/package/babel-plugin-transform-react-pure-class-to-function
[codecov-image]:
  https://codecov.io/gh/remcohaszing/babel-plugin-transform-react-class-to-function/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/remcohaszing/babel-plugin-transform-react-class-to-function
[npm-image]: https://img.shields.io/npm/v/babel-plugin-transform-react-class-to-function.svg
[npm-url]: https://www.npmjs.com/package/babel-plugin-transform-react-class-to-function
[react memo]: https://reactjs.org/docs/react-api.html#reactmemo
[github-actions-image]:
  https://github.com/remcohaszing/babel-plugin-transform-react-class-to-function/workflows/ci/badge.svg
[github-actions-url]:
  https://github.com/remcohaszing/babel-plugin-transform-react-class-to-function/actions
