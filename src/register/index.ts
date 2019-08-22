import Constructor from '../constructor';
import Stack from '../stacks/stack';
import Rule from '../rules/rule';

interface RegisterRuleForAllOptions {
  excludes: Array<Constructor<Stack>>;
}

interface RuleMap {
  rule: Rule;
  subRules: RuleMap[];
}

interface StackMap {
  stack: Stack;
  subStacks: Stack[];
  ruleMaps: RuleMap[];
}

export class Register {
  private static instanciatedRules: {
    [ruleName: string]: RuleMap;
  } = {};
  private static instanciatedStacks: {
    [stackName: string]: StackMap;
  } = {};

  /**
   * A class decorator that makes a class implement the Stack interface,
   * and registers this class in an array.
   * @param ctor The constructor of the class that implements the Stack interface
   */
  static stack(ctor: Constructor<Stack>) {
    if (Register.instanciatedStacks[ctor.name] === undefined) {
      const instanciatedStack = new ctor();
      Register.instanciatedStacks[ctor.name] = {
        stack: instanciatedStack,
        subStacks: [],
        ruleMaps: [],
      };
    }
  }

  static subStackOf(parentStack: Constructor<Stack>) {
    return (subStack: Constructor<Stack>) => {
      const instanciatedSubStack = new subStack();
      Register.instanciatedStacks[subStack.name] = {
        stack: instanciatedSubStack,
        subStacks: [],
        ruleMaps: [],
      };
      Register.instanciatedStacks[parentStack.name].subStacks.push(
        instanciatedSubStack,
      );
    };
  }

  /**
   * Registers the decorated rule to the stacks given in parameter.
   * @param stackCtors An array containing stacks to register this rule for.
   */
  static ruleForStacks<
    P extends Constructor<Rule>,
    T extends Constructor<Stack>
  >(stackCtors: T[]) {
    return (ruleCtor: P) => {
      const instanciatedRule = new ruleCtor();
      Register.instanciatedRules[ruleCtor.name] = {
        rule: instanciatedRule,
        subRules: [],
      };
      stackCtors.forEach(stackCtor => {
        Register.stack(stackCtor);
        Register.instanciatedStacks[stackCtor.name].ruleMaps.push(
          Register.instanciatedRules[ruleCtor.name],
        );
      });
    };
  }

  static ruleForAll(options: RegisterRuleForAllOptions = { excludes: [] }) {
    return (ruleCtor: Constructor<Rule>) => {
      {
        const instanciatedRule = new ruleCtor();
        Register.instanciatedRules[ruleCtor.name] = {
          rule: instanciatedRule,
          subRules: [],
        };
        const excludeStackNames = options.excludes.map(
          stackCtor => stackCtor.name,
        );
        Object.keys(Register.instanciatedStacks)
          .filter(stackName => !excludeStackNames.includes(stackName))
          .forEach(stackName => {
            Register.instanciatedStacks[stackName].ruleMaps.push(
              Register.instanciatedRules[ruleCtor.name],
            );
          });
      }
    };
  }

  static subRuleOf<R extends Constructor<Rule>, U extends Constructor<Rule>>(
    ruleCtor: U,
  ) {
    return (subRuleCtor: R) => {
      const instanciatedSubRule = new subRuleCtor();
      Register.instanciatedRules[subRuleCtor.name] = {
        rule: instanciatedSubRule,
        subRules: [],
      };
      Register.instanciatedRules[ruleCtor.name].subRules.push(
        Register.instanciatedRules[subRuleCtor.name],
      );
    };
  }

  static getAllStacks(): Stack[] {
    return Object.values(Register.instanciatedStacks).reduce(
      (prev: Stack[], curr: StackMap) => {
        return [...prev, curr.stack, ...curr.subStacks];
      },
      [],
    );
  }

  static async getAvailableStacks(): Promise<Stack[]> {
    const allStacks = Register.getAllStacks();
    const isAvailableProm = await Promise.all(
      allStacks.map(stack => stack.isAvailable()),
    );
    return allStacks.filter((_, index) => isAvailableProm[index]);
  }

  static async stackIsAvailable(ctor: Constructor<Stack>): Promise<boolean> {
    return Register.instanciatedStacks[ctor.name].stack.isAvailable();
  }

  /**
   * Returns an array of objects containing an instanciated Stack in the stack property,
   * and its associated sub Stacks in the subStacks property.
   */
  static getStacksMaps(): StackMap[] {
    return Object.values(Register.instanciatedStacks).reduce(
      (prev: StackMap[], curr: StackMap) => {
        return [...prev, curr];
      },
      [],
    );
  }

  static async getRulesToApply(): Promise<Rule[]> {
    return Register.getAvailableStacks().then(availableStacks => {
      const rulesOfAvailableStacks = availableStacks.reduce(
        (rulesToApply, curr) => {
          const rulesToAdd = Register.instanciatedStacks[
            curr.constructor.name
          ].ruleMaps
            .map(ruleMap => ruleMap.rule)
            .filter(
              rule =>
                !rulesToApply.find(
                  ruleToApply =>
                    rule.constructor.name === ruleToApply.constructor.name,
                ),
            );

          return [...rulesToApply, ...rulesToAdd];
        },
        [] as Rule[],
      );

      return Promise.all(
        rulesOfAvailableStacks.map(rule => rule.shouldBeApplied()),
      ).then(rulesToApply => {
        return rulesOfAvailableStacks.filter((_, index) => rulesToApply[index]);
      });
    });
  }

  static getSubRulesOf(rule: Rule): Rule[] {
    return Register.instanciatedRules[rule.constructor.name].subRules.map(
      ruleMap => ruleMap.rule,
    );
  }
}