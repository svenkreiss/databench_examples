/* global Databench */
/* global d3charcount */
/* global document */

const databench = new Databench.Connection();
Databench.ui.wire(databench);
document.getElementById('sentence').databenchUI.triggerOnKeyUp();


const d3visualizaton = d3charcount('viz');

databench.on({ data: 'counts' }, (counts) => {
  const reformattedData = Object.keys(counts)
    .map(letter => ({ label: letter, value: counts[letter] }));

  if (reformattedData.length > 0) d3visualizaton(reformattedData);
});


databench.connect();
