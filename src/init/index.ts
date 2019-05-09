import * as fs from 'fs';

function importClassesIn(rootPath: string) {
  fs.readdirSync(rootPath)
    .forEach(path => {
      const fStat = fs.lstatSync(path);
      if (fStat.isFile() || fStat.isSymbolicLink()) {
        importClassesIn(path);
      }
      require(`${rootPath}/${path.replace(/.d.ts|.ts/, '')}`);
    });
}

importClassesIn(`${__dirname}/../rules/`);
importClassesIn(`${__dirname}/../stacks/`);
