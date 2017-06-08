import * as Databench from 'databench';
import * as React from 'react';

export interface HelloProps { databench: Databench.Connection; }
export interface HelloState { status: string; }

export class Hello extends React.Component<HelloProps, HelloState> {
  constructor(props: HelloProps) {
    super(props);
    this.state = {status: 'unknown'};

    props.databench.on({data: 'status'}, (value: string) => this.setState({status: value}));
  }

  render() {
    return <h1>Status: {this.state.status}</h1>;
  }
}
