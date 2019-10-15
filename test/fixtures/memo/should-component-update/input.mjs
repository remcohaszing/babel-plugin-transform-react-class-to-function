import React from 'react';

class Foo extends React.Component {
  shouldComponentUpdate(prevProps) {
    return this.props.bar !== prevProps.foo;
  }

  render() {
    return <div />;
  }
}
