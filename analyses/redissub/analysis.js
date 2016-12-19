/* global Databench */
/* global document */

const databench = new Databench.Connection();
Databench.ui.wire(databench);

// listen for data from backend
let inputData = {};
let lastUpdate = {};
databench.on('status', (json) => {
  const srcName = json.split('=')[0].trim();
  inputData[srcName] = json.split('=')[1];
  lastUpdate[srcName] = Date.now();

  // remove old values from data
  for (k in lastUpdate) {
    if (Date.now() - lastUpdate[k] > 1500) delete inputData[k];
  }

  // visualize
  console.log(inputData);
});

databench.connect();
