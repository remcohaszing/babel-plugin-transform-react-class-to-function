import React from 'react';


class Foo extends React.Component {
  render() {
    // eslint-disable-next-line react/no-string-refs
    return <div ref="unused" />;
  }
}
