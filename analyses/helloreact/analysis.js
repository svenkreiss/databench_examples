/* global document */

import * as Databench from 'databench';
import PropTypes from 'prop-types';
import * as React from 'react';
import * as ReactDOM from 'react-dom';


// define a component and its propTypes
class StatusText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'initial status',
    };
  }

  componentDidMount() {
    this.props.databench.on('data', (data) => {
      this.setState(data);
      this.props.databench.emit('ack', [data]);
    });
  }

  render() {
    return (<p>Status: {this.state.status}</p>);
  }
}

StatusText.propTypes = {
  databench: PropTypes.shape({
    emit: PropTypes.function,
    on: PropTypes.function,
  }),
};


const databench = new Databench.Connection();
Databench.ui.wire(databench);

ReactDOM.render(
  <StatusText databench={databench} />,
  document.getElementById('example'),
);

databench.connect();
