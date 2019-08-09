import * as fs from 'fs';
import * as ts from 'typescript';

export function importClassesIn(rootPath: string) {
  fs.readdirSync(rootPath).forEach(path => {
    const fullPath = rootPath + '/' + path;
    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) {
      importClassesIn(fullPath);
    } else if (path.startsWith('index.')) {
      require(`${rootPath}`);
    }
  });
}

export function importCustomClassesIn(rootPath: string) {
  const dirContent = fs.readdirSync(rootPath);

  if (dirContent.includes('index.ts')) {
    ts.createProgram([`${rootPath}/index.ts`], {
      target: ts.ScriptTarget.ES5,
    }).emit();
  }

  dirContent.forEach(path => {
    const fullPath = rootPath + '/' + path;
    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) {
      importCustomClassesIn(fullPath);
    } else if (path.startsWith('index.')) {
      require(`${rootPath}`);
    }
  });
}

export function init() {
  importClassesIn(`${__dirname}/../stacks/`);
  importClassesIn(`${__dirname}/../rules/`);
}
