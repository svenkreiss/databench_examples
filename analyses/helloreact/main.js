let React = require('react');
let ReactDOM = require('react-dom');


let StatusText = React.createClass({
  getInitialState: function() {
    return {status: 'initial status'};
  },
  componentDidMount: function() {
    this.props.databench.on('data', data => {
      this.setState(data);
      this.props.databench.emit('ack', [data]);
    });
  },
  render: function() {
    return (<p>Status: {this.state.status}</p>);
  }
});


let d = new Databench.Connection();
Databench.ui.wire(d);
ReactDOM.render(
  <StatusText databench={d} />,
  document.getElementById('example')
);
d.connect();
