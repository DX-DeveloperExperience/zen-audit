import * as fs from 'fs';

function importRules() {
  // import all rules files
  const rulesDirPath = `${__dirname}/../rules/`;
  fs.readdirSync(rulesDirPath)
    // .filter(path => {
    //   return path.endsWith('.d.ts') || path.endsWith('.ts');
    // })
    .forEach(path => {
      require(`${rulesDirPath}/${path.replace(/.d.ts|.ts/, '')}`);
    });
}

function importStacks() {
  // import all stacks files
  const stacksDirPath = `${__dirname}/../stacks/`;
  fs.readdirSync(stacksDirPath)
    .filter(path => {
      return path.endsWith('.d.ts') || path.endsWith('.ts');
    })
    .forEach(path => {
      require(`${stacksDirPath}/${path.replace(/.d.ts|.ts/, '')}`);
    });
}

importRules();
importStacks();
