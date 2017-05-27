Build and keep building on changes in the Typescript source:

```
webpack ./analyses/hellotypescript/analysis.ts ./analyses/hellotypescript/bundle.js --module-bind 'ts=awesome-typescript-loader' --module-bind 'json=json-loader' --watch
```
