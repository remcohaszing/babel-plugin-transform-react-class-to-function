import React from 'react';
const Foo = React.memo(() => {
  return <div />;
}, (prevProps, _props) => {
  return _props.bar !== prevProps.foo;
});
