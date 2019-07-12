import Rule from '../rule';
import { StackRegister, Constructor } from '../../stacks/stack-register/index';
import { ListStacks } from '../../stacks/list-stacks/index';
import Stack from '../../stacks/stack/index';

/**
 * Returns an array of every stack instanciated object
 */
export class ListRules {
  private static rules: Rule[] | undefined;

  static async getRulesToApply(): Promise<Rule[]> {
    if (ListRules.rules !== undefined) {
      return ListRules.rules;
    }

    const stackPromise: Promise<Stack[]> = ListStacks.getAvailableStacks();

    const rulesByStackPromise: Promise<
      Array<Constructor<Rule>>
    > = stackPromise.then((stacks: Stack[]) => {
      return stacks.reduce((acc: Array<Constructor<Rule>>, stack: Stack) => {
        return [
          ...acc,
          ...StackRegister.getRulesByStack(stack.constructor.name),
        ];
      }, []);
    });

    return rulesByStackPromise.then(rulesConstructors => {
      const uniqueRulesConstructors = new Set(rulesConstructors);
      const rules = Array.from(uniqueRulesConstructors).map(
        ruleConstructor => new ruleConstructor(),
      );

      return Promise.all(rules.map(rule => rule.shouldBeApplied())).then(
        values => {
          return rules.reduce((acc: Rule[], rule: Rule, i: number) => {
            if (values[i]) {
              return [...acc, rule];
            }
            return acc;
          }, []);
        },
      );
    });
  }
}
