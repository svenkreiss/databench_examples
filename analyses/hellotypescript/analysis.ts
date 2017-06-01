import * as Databench from 'databench';

// initialize Databench's frontend library
const databench = new Databench.Connection();
Databench.ui.wire(databench);

// listen for updates to 'status' in 'data'
databench.on({ data: 'status' }, (status: string) => {
  console.log(`received ${JSON.stringify(status)}`);
  document.getElementById('status').innerHTML = status;
});

databench.connect();
