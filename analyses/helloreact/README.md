This analysis roughly follows the [React package management example](https://facebook.github.io/react/docs/package-management.html).
To create an analysis scaffold, run:

    scaffold-databench helloreact
    cd analyses
    npm install --save react react-dom babel-preset-react babel-loader babel-core webpack

Add to the `scripts` in `package.json`:

    "build-helloreact": "webpack ./helloreact/main.js ./helloreact/bundle.js --module-bind 'js=babel-loader'"

And add to the `index.yaml` section:

    build: npm run build-helloreact

<i class="fa fa-fw fa-github"></i>
This [analysis is on GitHub](https://github.com/svenkreiss/databench_examples/tree/master/analyses/helloreact).<br />
<i class="fa fa-fw fa-external-link"></i>
[Live demos](http://databench-examples.trivial.io).

