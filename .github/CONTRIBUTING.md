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

All tests are based on fixtures in the *test/fixtures* directory. Given the code in *code.js*, expect it to be transformed into the code in *output.js*.

## Committing

When adding changes, please keep them as small as possible. Only commit which is relevant.

**Pro tip**: Use `git commit -p`.

Also run `npm test` before making a commit.


[GitHub]: https://github.com/remcohaszing/babel-plugin-transform-react-class-to-function
