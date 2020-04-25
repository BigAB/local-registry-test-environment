/**
 * @jest-environment @bigab/local-registry-test-environment
 */
const { exec } = require('child_process');
const { promisify } = require('util');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const asyncExec = promisify(exec);
const rmrf = promisify(rimraf);

describe('using this modules cli from npx', () => {
  beforeAll(() => asyncExec(`npm publish`));
  test('publish the package and use it with npx', async () => {
    const expected = 'Hello World\n';

    const stdio = await asyncExec(`npx @bigab/local-registry-spike`);
    const actual = stdio.stdout.toString();

    expect(actual).toBe(expected);
  });
});

describe('Testing a subpackage', () => {
  const tempProjectPath = './tmp/project';
  beforeAll(async () => {
    // publish the subpackage to local-registry
    await asyncExec(`npm publish`, {
      cwd: './packages/subpackage',
    });

    // create temporary project for tests
    await mkdirp('tmp/project');
    await asyncExec(`npm init --yes`, {
      cwd: tempProjectPath,
    });
  });

  afterAll(async () => {
    await rmrf('./tmp');
  });

  test('install subpackage and use it with npx locally', async () => {
    const expected = 'Hello from subpackage\n';

    await asyncExec(`yarn add @bigab/subpackage`, {
      cwd: tempProjectPath,
    });

    const stdio = await asyncExec(`npx subpackage`, {
      cwd: tempProjectPath,
    });
    const actual = stdio.stdout.toString();

    expect(actual).toBe(expected);
  });

  test('use directly from registry with npx', async () => {
    const expected = 'Hello from subpackage\n';

    const stdio = await asyncExec(`npx @bigab/subpackage`);
    const actual = stdio.stdout.toString();

    expect(actual).toBe(expected);
  });
});
