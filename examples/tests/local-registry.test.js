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

  // clean up temp project when it is over
  afterAll(async () => {
    await rmrf('./tmp');
  });

  test('install subpackage and use it with npx locally', async () => {
    const expected = 'Hello from subpackage\n';

    // install the subpackage module into the temp folder
    await asyncExec(`yarn add @bigab/subpackage`, {
      cwd: tempProjectPath,
    });

    // use npx to use the CLI subpackage command available after install
    const stdio = await asyncExec(`npx subpackage`, {
      cwd: tempProjectPath,
    });
    const actual = stdio.stdout.toString();

    // assert the CLI ouotput was correct
    // You could also check if files were created or whatever
    expect(actual).toBe(expected);
  });

  test('use directly from registry with npx', async () => {
    const expected = 'Hello from subpackage\n';

    // this should use npx to install a temporary subpackage
    // module and immediately invoke it, then check the output
    const stdio = await asyncExec(`npx @bigab/subpackage`);
    const actual = stdio.stdout.toString();

    expect(actual).toBe(expected);
  });
});
