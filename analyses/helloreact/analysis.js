/* global document */

const Databench = require('databench');
const React = require('react');
const ReactDOM = require('react-dom');


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
  databench: React.PropTypes.shape({
    emit: React.PropTypes.function,
    on: React.PropTypes.function,
  }),
};


const databench = new Databench.Connection();
Databench.ui.wire(databench);
ReactDOM.render(
  <StatusText databench={databench} />,
  document.getElementById('example'),
);
databench.connect();
