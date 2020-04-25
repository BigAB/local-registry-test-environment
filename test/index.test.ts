import LocalRegistryTestEnvironment from '../src';

// TODO: add tests and fix types
describe('Sanity test', () => {
  it('works', () => {
    const projectConfig = {};
    const environmentContext = { docblockPragmas: {} };
    const testEnv = new LocalRegistryTestEnvironment(
      projectConfig,
      environmentContext
    );
    expect(testEnv).toBeDefined();
  });
});
