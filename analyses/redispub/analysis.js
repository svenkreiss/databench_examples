/* global Databench */
/* global document */

const databench = new Databench.Connection();
Databench.ui.wire(databench);

const defaultSrcNames = [
  'passing unit tests',
  'CPU load', 'memory',
  'network',
  'disk capacity',
  'traffic',
  'database load',
  'disk load',
];
const defaultSrcName = defaultSrcNames[
  Math.floor(Math.random() * defaultSrcNames.length)
];
const defaultSrcId = `${defaultSrcName} ${Math.ceil(Math.random() * 50.0).toFixed(0)}`;

const genName = document.getElementById('genName');
const genValue = document.getElementById('genValue');
genName.innerText = defaultSrcId;

let time = 0.0;
let dt = 0.05;
setInterval(() => {
  time += dt;
  const value = (0.5 + (0.4 * Math.sin(time)));
  const srcName = genName.innerText;
  // if (!srcName) srcName = defaultSrcId;
  databench.emit('stats', `${srcName}=${value}`);
  genValue.innerText = ((value * 100.0).toFixed(1));
}, 100);

document.getElementById('btnSlow').onclick = () => {
  dt = 0.001;
  console.log('slow');
};
document.getElementById('btnFast').onclick = () => {
  dt = 0.05;
  console.log('fast');
};

databench.connect();
