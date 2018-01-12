This analysis roughly follows the [React package management example](https://facebook.github.io/react/docs/package-management.html).
To create an analysis scaffold, run:

    scaffold-databench helloreact
    npm install --save react react-dom babel-preset-react babel-loader babel-core webpack

Run `webpack` (optionally with `--watch`)
in a separate terminal to create `bundle.js`.

Databench can watch the `bundle.js` file and dynamically reload when you add

    watch:
      - helloreact/bundle.js

to the `index.yaml` file.


<i class="fa fa-fw fa-github"></i>
This [analysis is on GitHub](https://github.com/svenkreiss/databench_examples/tree/master/analyses/helloreact).<br />
<i class="fa fa-fw fa-external-link"></i>
[Live demos](http://databench-examples.trivial.io).
