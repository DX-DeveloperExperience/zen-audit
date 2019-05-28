import Rule from '../../rules/rule';
import Stack from '../stack';

export interface Constructor<T> {
  new (...args: any[]): T;
  readonly prototype: T;
}
interface RegisterRuleForAllOptions {
  excludes?: Array<Constructor<Stack>>;
}

/**
 * This class is a register for all implementations of the Stack interface.
 * Use the @StackRegister.register decorator to implement the Stack interface
 * instead of using "implements Stack" in your class signature.
 */
export class StackRegister {
  private static implementations: Array<Constructor<Stack>> = [];
  private static rulesByStack: {
    [stackName: string]: Array<Constructor<Rule>>;
  } = {};

  /**
   * This method returns every classes that implements the Stack interface.
   */
  static getConstructors(): Array<Constructor<Stack>> {
    return StackRegister.implementations;
  }

  static getRulesByStack(stackName: string): Array<Constructor<Rule>> {
    return this.rulesByStack[stackName];
  }

  /**
   * This method is a class decorator that makes a class implement the Stack interface,
   * and registers this class in an array.
   * @param ctor The constructor of the class that implements the Stack interface
   */
  static register<P extends Constructor<Stack>>(ctor: P) {
    StackRegister.implementations.push(ctor);
    StackRegister.rulesByStack[ctor.name] = [];
  }

  static registerRuleForStacks<
    P extends Constructor<Rule>,
    T extends Constructor<Stack>
  >(stackCtors: T[]) {
    return (ruleCtor: P) => {
      stackCtors.forEach(stackCtor => {
        this.rulesByStack[stackCtor.name].push(ruleCtor);
      });
    };
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
