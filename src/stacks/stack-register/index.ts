import Rule from '../../rules/rule';
import Stack from '../stack';
import Constructor from '../../constructor';

interface RegisterRuleForAllOptions {
  excludes?: Array<Constructor<Stack>>;
}

/**
 * This class is a register for all implementations of the Stack interface.
 * Use the @StackRegister.register decorator to implement the Stack interface
 * instead of using "implements Stack" in your class signature.
 */
export class StackRegister {
  private static constructors: Array<Constructor<Stack>> = [];
  private static stacks: Stack[] = [];
  private static rulesByStack: {
    [stackName: string]: Array<Constructor<Rule>>;
  } = {};
  private static subStacks: {
    [stackName: string]: Array<Constructor<Stack>>;
  } = {};

  /**
   * Returns constructor of every class that implements the Stack interface.
   */
  static getConstructors(): Array<Constructor<Stack>> {
    return StackRegister.constructors;
  }

  static getStacks(): Stack[] {
    return StackRegister.stacks;
  }

  static getRulesByStack(stackName: string): Array<Constructor<Rule>> {
    return this.rulesByStack[stackName];
  }

  /**
   * A class decorator that makes a class implement the Stack interface,
   * and registers this class in an array.
   * @param ctor The constructor of the class that implements the Stack interface
   */
  static register(ctor: Constructor<Stack>) {
    const instanciatedStack = new ctor();
    StackRegister.stacks.push(instanciatedStack);
    StackRegister.constructors.push(ctor);
    StackRegister.rulesByStack[ctor.name] = [];
  }

  static registerRuleForStacks<
    P extends Constructor<Rule>,
    T extends Constructor<Stack>
  >(stackCtors: T[]) {
    return (ruleCtor: P) => {
      stackCtors.forEach(stackCtor => {
        StackRegister.rulesByStack[stackCtor.name].push(ruleCtor);
      });
    };
  }

  static registerSubStackOf<
    S extends Constructor<Stack>,
    T extends Constructor<Stack>
  >(stackCtor: T) {
    return (subStack: S) => {
      StackRegister.rulesByStack[subStack.name] = [];
      if (StackRegister.subStacks[stackCtor.name] === undefined) {
        StackRegister.subStacks[stackCtor.name] = [subStack];
      } else {
        StackRegister.subStacks[stackCtor.name].push(subStack);
      }
    };
  }

  static getSubStacksOf(stack: Stack) {
    if (!!StackRegister.subStacks[stack.constructor.name]) {
      return StackRegister.subStacks[stack.constructor.name].map(subStack => {
        return new subStack();
      });
    }
    return [];
  }

  static registerRuleForAll(options: RegisterRuleForAllOptions = {}) {
    return <P extends Constructor<Rule>>(ruleCtor: P) => {
      StackRegister.getConstructors()
        .filter(
          stackCtor =>
            options.excludes && !options.excludes.includes(stackCtor),
        )
        .forEach(stackCtor => {
          StackRegister.rulesByStack[stackCtor.name].push(ruleCtor);
        });
    };
  }
}
