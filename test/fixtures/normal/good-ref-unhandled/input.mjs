import React from 'react';

class Foo extends React.Component {
  render() {
    return <div ref={this.props.innerRef} />;
  }
}
