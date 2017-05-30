import * as Databench from 'databench';
import * as React from "react";

export interface HelloState { status: string }

export class DatabenchConnection extends React.Component<undefined, HelloState> {
  constructor(props: any) {
    super(props);
    this.state = { status: 'no status' };

    // initialize Databench's frontend library
    const databench = new Databench.Connection();
    databench.on({ data: 'status' }, (value: string) => this.setState({status: value}));
    databench.connect();
  }

  render() {
    return <h1>And also state: {this.state.status}</h1>;
  }
}
