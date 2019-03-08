// import Stack from './stacks/stack';
/**
 * The InterfaceRegister class uses a decorator to register
 * every implementations of a specific interface. To do this, use
 * the @InterfaceRegister.register('InterfaceName') decorator on
 * classes that implements InterfaceName. The "implements InterfaceName" is
 * no longer needed in the implemented class signature. It is then possible to
 * list every class implementing a given interface.
 */

// interface Constructor<T> {
//   new (...args: any[]): T;
//   readonly prototype: T;
// }

// export class InterfaceRegister {
//   //A static variable that stores every implementations of a given interface.
//   private static implementations: {
//     [key: string]: Array<Constructor<any>>;
//   } = {};

//   /**
//    * Returns an array of all classes implementing a given interface name
//    * @param interfaceName The name of the interface you want to get implementations for
//    */
//   static getImplementations(interfaceName: string): Array<Constructor<any>> {
//     return InterfaceRegister.implementations[interfaceName] || [];
//   }

//   /**
//    * Use this class decorator to implement a given interface.
//    * @param interfaceName The name of the interface you want to implement
//    */
//   static register<P extends Constructor<any>>(interfaceName: string) {
//     return (constructor: P) => {
//       const values = InterfaceRegister.implementations[interfaceName] || [];
//       values.push(constructor);
//       InterfaceRegister.implementations[interfaceName] = values;
//     };
//   }
// }

// export class StackRegister {
//   private static implementations: Array<Constructor<Stack>> = [];
//   static getImplementations(): Array<Constructor<Stack>> {
//     return this.implementations;
//   }
//   static register<P extends Constructor<Stack>>(ctor: P) {
//     this.implementations.push(ctor);
//   }
// }
