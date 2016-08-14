var React = require('react');
var ReactDOM = require('react-dom');


var StatusText = React.createClass({
  getInitialState: function() {
    return {status: 'initial status'};
  },
  componentDidMount: function() {
    this.props.databench.on('data', data => {
      this.setState(data);
      this.props.databench.emit('ack');
    });
  },
  render: function() {
    return (
      <p>Status: {this.state.status}</p>
    );
  }
});


var d = new Databench.Connection();
ReactDOM.render(
  <StatusText databench={d} />,
  document.getElementById('example')
);
d.connect();
