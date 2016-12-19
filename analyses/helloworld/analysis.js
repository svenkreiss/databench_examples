/* global Databench */
/* global document */

const databench = new Databench.Connection();

databench.on({ data: 'status' }, (status) => {
  document.getElementById('output').innerHTML = status;
});

databench.connect();
