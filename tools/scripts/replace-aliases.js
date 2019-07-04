'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const glob_1 = tslib_1.__importDefault(require('glob'));
const resolver_1 = require('./resolver');
const args = require('minimist')(process.argv.slice(2));
// // TODO -> resolve the aliases from tsconfig files
// const raw = {
//   '@workspace/shared': '../../../../libs/shared',
//   '@workspace/backend': '../../../../libs/backend'
// };
// const changedAfterOutFile = {
//   '@workspace/shared': '../../libs/shared',
//   '@workspace/backend': '../../libs/backend'
// };
function replaceAliases(options) {
  return tslib_1.__awaiter(this, void 0, void 0, function*() {
    const { filePath } = options;
    const paths = yield resolver_1.resolvePaths(filePath);
    // const t1 = `${rootDir}/**/*.js`;
    // const jsFiles = await asyncGlob(t1);
    // // Iterate over here
    // // TODO
    // const result = await Promise.all(
    //   jsFiles.map(file => replaceAliasStrings(rootDir, file, aliases))
    // );
    // console.log(result);
  });
}
replaceAliases({
  filePath: args['tsConfig']
  // rootDir: args['root'],
  // aliases: changedAfterOutFile
});
// async function replaceAliasStrings(rootDir: string, file: string, paths: any) {
//   const substr = file.substr(rootDir.length);
//   console.log(substr);
//   // If in the root directory, length is 1, hence subtract one to get the depth from root
//   const nesting = substr.split(path.sep).length - 1;
//   //   const a = {
//   //     from: [/foo/g, /baz/g],
//   //     to: ['bar', 'bax']
//   //   };
//   // TODO -> Path Resolve
//   const replacementOptions = {
//     files: `${rootDir}/${substr}`,
//     from: [],
//     to: []
//   };
//   Object.keys(paths).forEach(key => {
//     replacementOptions.from.push(new RegExp(key, 'g'));
//     replacementOptions.to.push(`${addConcatenation(nesting)}${paths[key]}`);
//   });
//   console.log(paths);
//   console.log(replacementOptions);
//   return await replace(replacementOptions);
//   //   try {
//   //     const results =
//   //     console.log('Replacement results:', results);
//   //   } catch (error) {
//   //     console.error('Error occurred:', error);
//   //   }
//   // need to use path.normalize()
//   // parse a path
//   //   const depth =
// }
function addConcatenation(depth) {
  let str = '';
  for (let i = 0; i < depth; i++) {
    str += '../';
  }
  return str;
}
function asyncGlob(pattern) {
  return new Promise((resolve, reject) => {
    glob_1.default(pattern, (err, matches) => {
      if (err) {
        reject(err);
      } else {
        resolve(matches);
      }
    });
  });
}
//# sourceMappingURL=replace-aliases.js.map