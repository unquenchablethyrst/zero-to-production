'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const architect_1 = require('@angular-devkit/architect');
const testing_1 = require('@angular-devkit/architect/testing');
const core_1 = require('@angular-devkit/core');
const { join } = require('path');
describe('Command Runner Builder', () => {
  let architect;
  let architectHost;
  beforeEach(() =>
    tslib_1.__awaiter(this, void 0, void 0, function*() {
      const registry = new core_1.schema.CoreSchemaRegistry();
      registry.addPostTransform(core_1.schema.transforms.addUndefinedDefaults);
      // Arguments to TestingArchitectHost are workspace and current directories.
      // Since we don't use those, both are the same in this case.
      architectHost = new testing_1.TestingArchitectHost(__dirname, __dirname);
      architect = new architect_1.Architect(architectHost, registry);
      // This will either take a Node package name, or a path to the directory
      // for the package.json file.
      yield architectHost.addBuilderFromPackage(join(__dirname, '..'));
      console.log('#', Array.from(architectHost._builderMap.keys()));
    })
  );
  // This might not work in Windows.
  it('can run ls', () =>
    tslib_1.__awaiter(this, void 0, void 0, function*() {
      // Create a logger that keeps an array of all messages that were logged.
      const logger = new core_1.logging.Logger('');
      const logs = [];
      logger.subscribe(ev => logs.push(ev.message));
      // A "run" can contain multiple outputs, and contains progress information.
      const run = yield architect.scheduleBuilder(
        '@example/command-runner:command',
        {
          command: 'ls',
          args: [__dirname]
        },
        { logger }
      ); // We pass the logger for checking later.
      // The "result" member is the next output of the runner.
      // This is of type BuilderOutput.
      const output = yield run.result;
      // Stop the builder from running. This really stops Architect from keeping
      // the builder associated states in memory, since builders keep waiting
      // to be scheduled.
      yield run.stop();
      // Expect that it succeeded.
      expect(output.success).toBe(true);
      // Expect that this file was listed. It should be since we're running
      // `ls $__dirname`.
      expect(logs.toString()).toContain('index_spec.ts');
    }));
});
//# sourceMappingURL=index.spec.js.map