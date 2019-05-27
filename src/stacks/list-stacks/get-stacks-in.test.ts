import { StackRegister } from '../stack-register/index';
import { ListStacks } from './index';
import Stack from '../stack/index';
test('should return available stacks', () => {
  class Stack1 {
    constructor(rootPath: string) {}
    isAvailable() {
      return new Promise<boolean>(resolve => {
        resolve(true);
      });
    }
  }

  class Stack2 {
    constructor(rootPath: string) {}
    isAvailable() {
      return new Promise<boolean>(resolve => {
        resolve(false);
      });
    }
  }

  StackRegister.register(Stack1 as any);
  StackRegister.register(Stack2 as any);

  return ListStacks.getStacksIn('./test').then((stacks: Stack[]) => {
    expect(stacks.length).toEqual(1);
    expect(stacks[0]).toBeInstanceOf(Stack1);
  });
});
