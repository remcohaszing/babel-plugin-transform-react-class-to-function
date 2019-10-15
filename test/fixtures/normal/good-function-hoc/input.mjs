import React from 'react';
import { connect } from 'react-redux';

export default connect()(
  class Foo extends React.Component {
    render() {
      return <div />;
    }
  },
);
