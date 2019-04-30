import { RuleRegister } from '../rule-register';
import * as fs from 'fs';
import Rule from '../rule';

export function importRules() {
  // import all rules files
  const rulesDirPath = `${__dirname}/..`;
  fs.readdirSync(rulesDirPath)
    // .filter(path => {
    //   return path.endsWith('.d.ts') || path.endsWith('.ts');
    // })
    .forEach(path => {
      console.log(`${rulesDirPath}/${path.replace(/.d.ts|.ts/, '')}`);
      require(`${rulesDirPath}/${path.replace(/.d.ts|.ts/, '')}`);
    });
}

/**
 * Returns an array of every stack instanciated object
 */
export class ListRules {
  static findRulesToApplyIn(rootPath: string): Rule[] {
    return RuleRegister.getImplementations()
      .map(rule => new rule(rootPath))
      .filter(rule => rule.shouldBeApplied());
  }
}
