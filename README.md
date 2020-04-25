# Local Registry Test Environment

![CI](https://github.com/BigAB/local-registry-test-environment/workflows/CI/badge.svg)

A Jest Test Environment that runs with a local-registry for CLI testings

## Jest Development

This library can be imported and configured as a jest test enviroment.

It will start a verdaccio local registry for each test file on a "random" port (using `get-port` package). It will store any published packages to a random temp directory (uses `tmp-promise` package) and will set the `processs.env.npm_config_registry` to the url of the local registry.

This is useful for running node CLI test, where you expect the users to use `npx` or npm-scripts to run your cli commands.

## Install

Either:

```
yarn add -D @bigab/local-registry-test-environment
```

or

```
npm i -D @bigab/local-registry-test-environment
```

Then you can just add `@big/local-registry-test-environmen` to your `devDependencies` and add this docblock to the top of any test file that requires the local registry:

```js
/**
 * @jest-environment @bigab/local-registry-test-environment
 */
```

You can even configure the test environment a bit from here by adding pragmas. Need more logging, change the logLevel like this:

```js
/**
 * @jest-environment @bigab/local-registry-test-environment
 * @logLevel http
 */
```

Alternatively you can set **all** your tests to use this local registry test environment by configuring jest:

```json
{
  "jest": {
    "testEnvironment": "@bigab/local-registry-test-environment"
  }
}
```

## Examples

You can see some light examples of testing your node CLI package in the [Examples Directory](./examples)
