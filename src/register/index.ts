import Constructor from '../constructor';
import Stack from '../stacks/stack';
import Rule from '../rules/rule';

/**
 * The interface representing the options object used in registerRuleForAll
 * @ignore
 */
interface RegisterRuleForAllOptions {
  excludes: Array<Constructor<Stack>>;
}

/**
 * The interface representing the object containing each Rule and its subRules
 * @ignore
 */
interface RuleMap {
  rule: Rule;
  subRules: RuleMap[];
}

/**
 * The interface representing the object containing each Stack, its corresponding RuleMaps, and its sub Stacks.
 * @ignore
 */
interface StackMap {
  stack: Stack;
  subStacks: Stack[];
  ruleMaps: RuleMap[];
}

/**
 * The Register class that contains register decorators and other methods to retrieve
 * registered Stacks and Rules
 */
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
   * @decorator
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

  /**
   * A classs decorator that registers a subStack of a given Stack
   * @param parentStack The parent Stack
   */
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

  /**
   * Registers the decorated Rule for every Stacks, except for ones given in options Object.
   * @param options You may pass an options object with an exclude array property, containing a list of Stacks to exclude from registering.
   */
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

  /**
   * Registers a sub Rule of another Rule, so that the registered Rule will be called only after the parent Rule's apply has been succesful.
   * @param ruleCtor The parent Rule.
   */
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

  /**
   * Returns all registered Stacks as an Array of Stacks.
   */
  static getAllStacks(): Stack[] {
    return Object.values(Register.instanciatedStacks).reduce(
      (prev: Stack[], curr: StackMap) => {
        return [...prev, curr.stack, ...curr.subStacks];
      },
      [],
    );
  }

  /**
   * Returns every Stacks that are available in the audited project.
   */
  static async getAvailableStacks(): Promise<Stack[]> {
    const allStacks = Register.getAllStacks();
    const isAvailableProm = await Promise.all(
      allStacks.map(stack => stack.isAvailable()),
    );
    return allStacks.filter((_, index) => isAvailableProm[index]);
  }

  /**
   * Returns a Promise of true if the given Stack is detected in the audited project.
   * @param ctor The Stack to check.
   */
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

  /**
   * Returns all the Rules that may be applied in the audited project.
   */
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

  /**
   * Returns an array containing all the sub Rules of a given Rule.
   * @param rule The Rule for which we want the sub Rules.
   */
  static getSubRulesOf(rule: Rule): Rule[] {
    return Register.instanciatedRules[rule.constructor.name].subRules.map(
      ruleMap => ruleMap.rule,
    );
  }
}
