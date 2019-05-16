import * as fs from 'fs';

function importClassesIn(rootPath: string) {
  fs.readdirSync(rootPath).forEach(path => {
    const stat = fs.lstatSync(path);
    if (stat.isDirectory()) {
      importClassesIn(path);
    }
    require(`${rootPath}/${path.replace(/.d.ts|.ts/, '')}`);
  });
}

importClassesIn(`${__dirname}/../rules/`);
importClassesIn(`${__dirname}/../stacks/`);
