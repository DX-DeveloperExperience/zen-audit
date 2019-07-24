import Rule from '../rule';
import { StackRegister } from '../../stacks/stack-register/index';
import { ListStacks } from '../../stacks/list-stacks/index';
import Stack from '../../stacks/stack/index';
import { RuleRegister, Constructor } from '../rule-register';

/**
 * Returns an array of every stack instanciated object
 */
export class ListRules {
  private static rules: Rule[] | undefined;

  private static async getFirstGradeRules(): Promise<Rule[]> {
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
    return ListRules.getFirstGradeRules()
      .then(firstGradeRules => {
        return firstGradeRules.filter(
          async rule => await rule.shouldBeApplied(),
        );
      })
      .then(firstGradeRulesToApply => {
        return firstGradeRulesToApply.reduce(
          async (
            rulesToApply: Promise<Rule[]>,
            currFirstGradeRule: Rule,
            index: number,
          ) => {
            return [
              ...(await rulesToApply),
              ...(await ListRules.getSubRulesOf(currFirstGradeRule)),
            ];
          },
          Promise.resolve([...firstGradeRulesToApply]),
        );
      });
  }

  private static async getSubRulesOf(rule: Rule): Promise<Rule[]> {
    const subRules = RuleRegister.getSubRulesOf(rule);
    const subRulesToApply = await Promise.all(
      subRules.map(async ruleToApply => await ruleToApply.shouldBeApplied()),
    );

    return subRules.reduce(async (keptRules, currSubRule, index) => {
      if (subRulesToApply[index] === true) {
        return [
          ...(await keptRules),
          currSubRule,
          ...(await ListRules.getSubRulesOf(currSubRule)),
        ];
      }
      return [...(await keptRules)];
    }, Promise.resolve([]));
  }
}
