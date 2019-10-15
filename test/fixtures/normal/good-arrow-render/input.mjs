import React from 'react';

class Foo extends React.Component {
  render = () => {
    const className = this.props.cls;
    return <div className={className} />;
  };
}
