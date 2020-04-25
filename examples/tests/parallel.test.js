/**
 * @jest-environment @bigab/local-registry-test-environment
 */
const { exec } = require('child_process');
const { promisify } = require('util');
const rimraf = require('rimraf');

const asyncExec = promisify(exec);

describe('using this modules cli from npx', () => {
  beforeAll(() => asyncExec(`npm publish`));
  test('publish the package and use it with npx', async () => {
    const expected = 'Hello World\n';

    const stdio = await asyncExec(`npx @bigab/local-registry-spike`);
    const actual = stdio.stdout.toString();

    expect(actual).toBe(expected);
  });
});
