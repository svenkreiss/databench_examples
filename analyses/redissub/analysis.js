/* global Databench */

const databench = new Databench.Connection();
Databench.ui.wire(databench);

// listen for data from backend
const inputData = {};
const lastUpdate = {};
databench.on('status', (json) => {
  const [key, value] = json.split('=')[0];
  const srcName = key.trim();
  inputData[srcName] = value;
  lastUpdate[srcName] = Date.now();

  // remove old values from data
  Object.keys(lastUpdate).forEach((k) => {
    if (Date.now() - lastUpdate[k] > 1500) delete inputData[k];
  });

  // visualize
  databench.emit('log', inputData);
});

databench.connect();
