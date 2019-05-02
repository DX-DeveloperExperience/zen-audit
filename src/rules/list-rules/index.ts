import { RuleRegister } from '../rule-register';
import * as fs from 'fs';
import Rule from '../rule';
import { StackRegister, Constructor } from '../../stacks/stack-register/index';
import { ListStacks } from '../../stacks/list-stacks/index';

// export function importRules() {
//   // import all rules files
//   const rulesDirPath = `${__dirname}/..`;
//   fs.readdirSync(rulesDirPath)
//     // .filter(path => {
//     //   return path.endsWith('.d.ts') || path.endsWith('.ts');
//     // })
//     .forEach(path => {
//       require(`${rulesDirPath}/${path.replace(/.d.ts|.ts/, '')}`);
//     });
// }

/**
 * Returns an array of every stack instanciated object
 */
export class ListRules {
  private static rules: Rule[] = [];
  private static path = '';

  static getRulesToApplyIn(rootPath: string): Rule[] {
    if (this.rules.length === 0 || this.path !== rootPath) {
      // this.rules = RuleRegister.getImplementations()
        // .map(rule => new rule(rootPath))
        // .filter(rule => rule.shouldBeApplied());
        ListStacks.getStacksIn(rootPath).forEach(stack => {
          this.rules.push(StackRegister.getRulesByStack(stack.))
        })
      }

    if (this.path === '' || this.path !== rootPath) {
      this.path = rootPath;
    }

    return this.rules;
  }
}
