/* global document */

import * as React from "react";
import * as ReactDOM from "react-dom";
import { DatabenchConnection } from "./components/DatabenchConnection";

ReactDOM.render(
    <DatabenchConnection />,
    document.getElementById("example")
);
