import { RuleRegister } from './rules/rule-register';
import * as fs from 'fs';
import Rule from './rules/rule';

// import all stack files
fs.readdirSync(__dirname + '/stacks').forEach(path => {
  require(__dirname + '/stacks/' + path.replace('.ts', ''));
});

/**
 * Returns an array of every stack instanciated object
 */
export class ListRules {
  static getProjectStacks(): Rule[] {
    return RuleRegister.getImplementations()
      .map(rule => new rule())
      .filter(rule => rule.exists());
  }
}
