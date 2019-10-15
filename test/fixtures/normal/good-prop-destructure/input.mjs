import React from 'react';

class Foo extends React.Component {
  render() {
    const { className } = this.props;

    return <div className={className} />;
  }
}
