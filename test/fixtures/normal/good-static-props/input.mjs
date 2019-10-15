import React from 'react';

class Foo extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  render() {
    return <div className={this.props.className} />;
  }
}
