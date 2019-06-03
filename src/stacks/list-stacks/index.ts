import { StackRegister, Constructor } from '../stack-register';
import Stack from '../stack';

export class ListStacks {
  static stacks: Stack[];
  static getStacksIn(rootPath: string) {
    if (ListStacks.stacks) {
      return Promise.resolve(ListStacks.stacks);
    }
    const stackConstructors: Array<
      Constructor<Stack>
    > = StackRegister.getConstructors();

    const stacks = stackConstructors.map(
      stackConstructor => new stackConstructor(rootPath),
    );

    const isAvailablePromise = stacks.map(stack => stack.isAvailable());

    return Promise.all(isAvailablePromise).then(availableValues => {
      ListStacks.stacks = stacks.reduce(
        (acc: Stack[], stack: Stack, i: number) => {
          if (availableValues[i]) {
            return [...acc, stack];
          }
          return acc;
        },
        [],
      );
      return ListStacks.stacks;
    });
  }
}
