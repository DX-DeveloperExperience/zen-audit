import Rule from '../rule';
import { StackRegister, Constructor } from '../../stacks/stack-register/index';
import { ListStacks } from '../../stacks/list-stacks/index';

/**
 * Returns an array of every stack instanciated object
 */
export class ListRules {
  private static rules: Rule[] = [];
  private static path = '';

  static getRulesToApplyIn(rootPath: string): Rule[] {
    let rulesObject = {};

    if (this.rules.length === 0 || this.path !== rootPath) {
      this.path = rootPath;

      ListStacks.getStacksIn(rootPath).forEach(stack => {
        let rules = StackRegister.getRulesByStack(stack.constructor.name)
          .map(rule => new rule(rootPath))
          .filter(rule => rule.shouldBeApplied())
          .reduce((acc, current) => {
            return {
              ...acc,
              [current.getName()]: current,
            };
          }, {});

        rulesObject = {
          ...rulesObject,
          ...rules,
        };
      });
      ListRules.rules = Object.values(rulesObject);
    }

    return ListRules.rules;
  }
}
