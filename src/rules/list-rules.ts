import { RuleRegister } from './rule-register';
import * as fs from 'fs';
import Rule from './rule';

// import all rules files
fs.readdirSync(`${__dirname}/rules`)
  .filter(path => {
    return path.endsWith('.d.ts') || path.endsWith('.ts');
  })
  .forEach(path => {
    require(`${__dirname}/rules/${path.replace('.ts', '')}`);
  });

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