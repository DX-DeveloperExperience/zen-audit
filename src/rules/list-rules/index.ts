import Rule from '../rule';
import { StackRegister, Constructor } from '../../stacks/stack-register/index';
import { ListStacks } from '../../stacks/list-stacks/index';
import Stack from '../../stacks/stack/index';

/**
 * Returns an array of every stack instanciated object
 */
export class ListRules {
  private static rules: Rule[] = [];
  private static path = '';

  static getRulesToApplyIn(rootPath: string): Promise<Rule[]> {
    if (this.rules.length === 0 || this.path !== rootPath) {
      this.path = rootPath;
    }

    const stackPromise: Promise<Stack[]> = ListStacks.getStacksIn(rootPath);

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
      const rules = rulesConstructors.map(
        ruleConstructor => new ruleConstructor(rootPath),
      );

      const uniqueRules = rules.filter((rule, index, self) => {
        return (
          index ===
          self.findIndex(otherRule => {
            return JSON.stringify(rule) === JSON.stringify(otherRule);
          })
        );
      });

      return Promise.all(uniqueRules.map(rule => rule.shouldBeApplied())).then(
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
