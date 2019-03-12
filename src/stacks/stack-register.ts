import Stack from './stack';
interface Constructor<T> {
  new (...args: any[]): T;
  readonly prototype: T;
}

/**
 * This class is a register for all implementations of the Stack interface.
 * Use the @StackRegister.register decorator to implement the Stack interface
 * instead of using "implements Stack" in your class signature.
 */
export class StackRegister {
  private static implementations: Array<Constructor<Stack>> = [];

  /**
   * This method returns every classes that implements the Stack interface.
   */
  static getImplementations(): Array<Constructor<Stack>> {
    return StackRegister.implementations;
  }

  /**
   * This method is a class decorator that makes a class implement the Stack interface,
   * and registers this class in an array.
   * @param ctor The constructor of the class that implements the Stack interface
   */
  static register<P extends Constructor<Stack>>(ctor: P) {
    StackRegister.implementations.push(ctor);
  }
}
