import * as fs from 'fs';

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

export function init() {
  importClassesIn(`${__dirname}/../stacks/`);
  importClassesIn(`${__dirname}/../rules/`);
}
