import Rule from '../rule';

interface Constructor<T> {
  new (...args: any[]): T;
  readonly prototype: T;
}

/**
 * This class is a register for all implementations of the Rule interface.
 * Use the @RuleRegister.register decorator to implement the Rule interface
 * instead of using "implements Rule" in your class signature.
 */
export class RuleRegister {
  private static implementations: Array<Constructor<Rule>> = [];

  /**
   * This method returns every classes that implements the Rule interface.
   */
  static getImplementations(): Array<Constructor<Rule>> {
    return RuleRegister.implementations;
  }

  /**
   * This method is a class decorator that makes a class implement the Rule interface,
   * and registers this class in an array.
   * @param ctor The constructor of the class that implements the Rule interface
   */
  static register<P extends Constructor<Rule>>(ctor: P) {
    RuleRegister.implementations.push(ctor);
  }
}