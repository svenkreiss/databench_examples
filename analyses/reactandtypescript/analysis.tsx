import * as Databench from 'databench';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Hello } from './components/Hello';

// initialize Databench's frontend library
const databench = new Databench.Connection();
Databench.ui.wire(databench);

ReactDOM.render(
    <Hello databench={databench} />,
    document.getElementById('example')
);

databench.connect();
