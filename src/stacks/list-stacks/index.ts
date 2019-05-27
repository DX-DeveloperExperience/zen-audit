import { StackRegister, Constructor } from '../stack-register';
import Stack from '../stack';

export class ListStacks {
  static getStacksIn(rootPath: string) {
    const stackConstructors: Array<
      Constructor<Stack>
    > = StackRegister.getConstructors();

    const stacks = stackConstructors.map(
      stackConstructor => new stackConstructor(),
    );

    const isAvailablePromise = stacks.map(stack => stack.isAvailable());

    return Promise.all(isAvailablePromise).then(availableValues => {
      return stacks.reduce((acc: Stack[], stack: Stack, i: number) => {
        if (availableValues[i]) {
          return [...acc, stack];
        }
        return acc;
      }, []);
    });
  }
}
