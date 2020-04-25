# Local Registry Test Environment

A Jest Test Environment that runs with a local-registry for CLI testings

## Jest Development

This library can be imported and configured as a jest test enviroment.

It will start a verdaccio local registry for each test file on a "random" port (using `get-port` package). It will store any published packages to a random temp directory (uses `tmp-promise` package) and will set the `processs.env.npm_config_registry` to the url of the local registry.

This is useful for running node CLI test, where you expect the users to use `npx` or npm-scripts to run your cli commands.
