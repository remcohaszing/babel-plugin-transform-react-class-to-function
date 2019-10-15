# Contributing

## Getting Started

Fork the project on [GitHub]. Then clone your fork.

Now install it to setup the local development environment

```sh
cd babel-plugin-transform-react-class-to-function
npm ci
```

The following command runs all tests and lints the code

```sh
npm test
```

To run tests continuously, run

```sh
npm start
```

## Testing

All tests are based on fixtures in the _test/fixtures_ directory. Given the code in _code.js_,
expect it to be transformed into the code in _output.js_.

## Committing

When adding changes, please keep them as small as possible. Only commit which is relevant.

**Pro tip**: Use `git commit -p`.

Also run `npm test` before making a commit.

[github]: https://github.com/remcohaszing/babel-plugin-transform-react-class-to-function
