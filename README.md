# Steem Engine STOP

The Steem Engine STO platform.

## Install

Simply run `yarn install` or `npm install` to install the dependencies.

## Run dev app (locally)

Run `au run`, then open `http://localhost:8081`

To open browser automatically, do `au run --open`.

To change dev server port, do `au run --port 8888`.

To enable Webpack Bundle Analyzer, do `au run --analyze`.

To enable hot module reload, do `au run --hmr`.

## Run prod app (locally)

Run `au run --env prod`, then open `http://localhost:8081`

To open browser automatically, do `au run --open`.

To change dev server port, do `au run --port 8888`.

To enable Webpack Bundle Analyzer, do `au run --analyze`.

To enable hot module reload, do `au run --hmr`.

## Build for production

Run `au build --env prod`.

## Enabling debug mode

If you're in production and want to enable debugging information in the browser developer tools the combination `ctrl + shift + f10` will enable debug mode, which is disabled by default in production.

## Environment configuration

Values for configuration of the application live in `aurelia_project/environments`. The `dev.ts` file is for development environmnent, the `prod.ts` file is for production and `stage.ts` (currently unused) is for staging environment.

## Unit tests

Run `au test` (or `au karma`).

To run in watch mode, `au test --watch` or `au karma --watch`.

## Integration (e2e) tests

You need the app running for integration test.

First, run `au run` and keep it running.

Then run `au cypress` to run cypress in interactive mode.

To perform a test-run and reports the results, do `au cypress --run`.
