import * as fs from 'fs';
import * as ts from 'typescript';

/**
 * Import classes in a folder, recursively. To be used in classes that are in the source code of ZenAudit only.
 * @param rootPath The root folder in which you want to import classes
 * @ignore
 */
export function importClassesIn(rootPath: string) {
  fs.readdirSync(rootPath).forEach(path => {
    const fullPath = rootPath + '/' + path;
    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) {
      importClassesIn(fullPath);
    } else if (path.startsWith('index.')) {
      require(rootPath);
    }
  });
}

/**
 * Import classes of a folder, recursively. Is used for classes that are outside of ZenAudit's source code.
 * @param rootPath The root foler in which you want to import classes
 * @ignore
 */
export function importCustomClassesIn(rootPath: string) {
  if (fs.readdirSync(rootPath).includes('index.ts')) {
    ts.createProgram([`${rootPath}/index.ts`], {
      target: ts.ScriptTarget.ES5,
    }).emit();
  }

  fs.readdirSync(rootPath).forEach(path => {
    const fullPath = rootPath + '/' + path;
    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) {
      importCustomClassesIn(fullPath);
    } else if (path === 'index.js') {
      require(rootPath);
    }
  });
}

/**
 * @ignore
 */
export function init() {
  importClassesIn(`${__dirname}/../stacks/`);
  importClassesIn(`${__dirname}/../rules/`);
}
