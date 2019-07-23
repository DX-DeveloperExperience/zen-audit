import Rule from '../rule';
import { StackRegister, Constructor } from '../../stacks/stack-register/index';
import { ListStacks } from '../../stacks/list-stacks/index';
import Stack from '../../stacks/stack/index';
import { RuleRegister } from '../rule-register';

/**
 * Returns an array of every stack instanciated object
 */
export class ListRules {
  private static rules: Rule[] | undefined;

  static async getFirstGradeRules(): Promise<Rule[]> {
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
      return Array.from(uniqueRulesConstructors).map(ruleConstructor => {
        return new ruleConstructor();
      });
    });
  }

  static async getRulesToApply(): Promise<Rule[]> {
    const firstGradeRulesToApply = ListRules.getFirstGradeRules().then(
      firstGradeRules => {
        return firstGradeRules.filter(rule => rule.shouldBeApplied());
      },
    );

    const allRulesToApply = firstGradeRulesToApply.then(rulesToApply => {});
  }

  private static getSubRulesOf(rule: Rule) {}

  /* static async getRulesToApply(): Promise<Rule[]> {
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
  } */
}
