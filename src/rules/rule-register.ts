import Rule from './rule';

interface Constructor<T> {
  new (...args: any[]): T;
  readonly prototype: T;
}

/**
 * This class is a register for all implementations of the Stack interface.
 * Use the @RuleRegister.register decorator to implement the Stack interface
 * instead of using "implements Stack" in your class signature.
 */
export class RuleRegister {
  private static implementations: Array<Constructor<Rule>> = [];

  /**
   * This method returns every classes that implements the Stack interface.
   */
  static getImplementations(): Array<Constructor<Rule>> {
    return RuleRegister.implementations;
  }

  /**
   * This method is a class decorator that makes a class implement the Stack interface,
   * and registers this class in an array.
   * @param ctor The constructor of the class that implements the Stack interface
   */
  static register<P extends Constructor<Rule>>(ctor: P) {
    RuleRegister.implementations.push(ctor);
  }
}
