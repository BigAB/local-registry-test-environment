const NodeEnvironment = require('jest-environment-node');
const getPort = require('get-port');
const startServer = require('verdaccio');
const tmp = require('tmp-promise');

class LocalRegistryTestEnvironment extends NodeEnvironment {
  constructor(config, { docblockPragmas }) {
    super(config);
    const { logLevel = 'error', port } = docblockPragmas;
    this.logLevel = logLevel;
    this.port = port;
  }
  async setup() {
    await super.setup();
    this.port = await getPort();
    this.dir = await tmp.dir({ unsafeCleanup: true });
    const {
      addrs: { proto, host, port },
      registryServer,
    } = await this.spawnLocalRegistry();
    this.global.localRegistry = registryServer;
    const registryUrl = `${proto}://${host}:${port}`;
    this.global.process.env.npm_config_registry = registryUrl;
    process.env.npm_config_registry = registryUrl;
  }

  async teardown() {
    // kill the local registry
    this.global.localRegistry.close();
    // delete the local registry store
    this.dir.cleanup();
    await super.teardown();
  }

  async spawnLocalRegistry() {
    return new Promise((resolve, reject) => {
      startServer(
        {
          storage: this.dir.path,
          uplinks: {
            npmjs: {
              url: 'https://registry.npmjs.org/',
              cache: false,
            },
          },
          packages: {
            '@*/*': {
              access: '$all',
              publish: '$all',
              unpublish: '$all',
              proxy: 'npmjs',
            },
            '**': {
              access: '$all',
              publish: '$all',
              unpublish: '$all',
              proxy: 'npmjs',
            },
          },
          web: {
            enable: false,
          },
          logs: [
            {
              type: 'stdout',
              format: 'pretty',
              level: this.logLevel,
            },
          ],
        },
        this.port,
        'local-registry/storage',
        '4.0.0',
        'Local Registry Test Env',
        (webServer, addrs) => {
          webServer.listen(addrs.port || addrs.path, addrs.host, (error) => {
            if (error) {
              reject(error);
            }
            console.log(
              `local-registry (verdaccio) running on port ${addrs.port}`
            );
            resolve({ addrs, registryServer: webServer });
          });
        }
      );
    });
  }
}

module.exports = LocalRegistryTestEnvironment;
