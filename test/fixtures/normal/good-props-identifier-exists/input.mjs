import React from 'react';

class Foo extends React.Component {
  render() {
    const _props = 0;
    return <div {...this.props} />;
  }
}
