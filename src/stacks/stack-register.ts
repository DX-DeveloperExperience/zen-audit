import { Stack } from './stack';
import Rule from '../rules/rule';
// import Rule from '../rules/rule';

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
  private static rulesByStack: {
    [stackName: string]: Array<Constructor<Rule>>;
  } = {};

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
    StackRegister.rulesByStack[ctor.name] = [];
  }

  static registerRuleForStacks<P extends Constructor<Rule>>(
    stackNames: string[],
  ) {
    return (ctor: P) => {
      stackNames.forEach(stackName => {
        StackRegister.rulesByStack[stackName].push(ctor);
      });
    };
  }
}

// export class RegisterFactory<T> {
//   setUpForRegister() {
//     const implementationsOfT: Array<Constructor<T>> = [];
//     return {
//       register(ctor: Constructor<T>) {
//         implementationsOfT.push(ctor);
//       },
//       implementationsOfT,
//     };
//   }
// }

// export class RegisterMapFactory<T> {
//   setUpForRegister() {
//     const implementationsOfT: Array<Constructor<T>> = [];
//     const mapClassesToT: { [stackName: string]: Array<Constructor<T>> } = {};
//     return {
//       register(ctor: Constructor<T>) {
//         implementationsOfT.push(ctor);
//       },
//       implementationsOfT,
//     };
//   }
// }

// export class StackRegisterFactory extends RegisterMapFactory<Stack> {}

// const registerFactory = new StackRegisterFactory();
// const setUp = registerFactory.setUpForRegister();

// export const stack = setUp.register;
// export const implementations = setUp.implementationsOfT;

// interface Register<T> {
//   register(ctor: Constructor<T>): void;
// }
// export class RegisterGenerator<T> {
//   setUpForRegister(reg: Register<T>) {
//     return function register(ctor: Constructor<T>) {
//       reg.register(ctor);
//     };
//   }
// }

// export class RuleRegisterGenerator extends RegisterGenerator<Rule> {}
// export class StackRegisterGenerator extends RegisterGenerator<Stack> {}
// const ruleRegisterGenerator = new RuleRegisterGenerator();
// const stackRegisterGenerator = new StackRegisterGenerator();

// class RuleRegister implements Register<Rule> {
//   instances: Array<Constructor<Rule>> = [];
//   register(ctor: Constructor<Rule>): void {
//     this.instances.push(ctor);
//   }
// }

// export class StackRegister implements Register<Stack> {
//   instances: Array<Constructor<Stack>> = [];
//   rulesByStack: { [StackName: string]: Array<Constructor<Rule>> } = {};
//   register(ctor: Constructor<Stack>): void {
//     this.instances.push(ctor);
//   }
//   registerRule(stackName: string) {
//     return (ctor: Constructor<Rule>) => {
//       this.rulesByStack[stackName].push(ctor);
//     };
//   }
// }

// const setUpRule = ruleRegisterGenerator.setUpForRegister(new RuleRegister());

// const stack = stackRegisterGenerator.setUpForRegister(new StackRegister());
