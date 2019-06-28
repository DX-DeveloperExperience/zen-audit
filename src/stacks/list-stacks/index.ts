import { StackRegister, Constructor } from '../stack-register';
import Stack from '../stack';

export class ListStacks {
  static stacks: Stack[];
  static getAvailableStacksIn(rootPath: string) {
    if (ListStacks.stacks) {
      return Promise.resolve(ListStacks.stacks);
    }

    const stacks = StackRegister.getStacks();
    const isAvailablePromise = stacks.map(stack => stack.isAvailable());

    return Promise.all(isAvailablePromise).then(availableValues => {
      ListStacks.stacks = stacks.reduce(
        (acc: Stack[], stack: Stack, i: number, stacks: Stack[]) => {
          if (availableValues[i]) {
            let stacksToAdd = [stack];
            const subStacks = StackRegister.getSubStacksOf(stack);

            // if current stack has subStacks, instanciate them and add them to availableStacks if available
            if (!!subStacks && subStacks.length !== 0) {
              const availableSubStacks = subStacks.filter(subStack => {
                return subStack.isAvailable();
              });
              stacksToAdd = [...stacksToAdd, ...availableSubStacks];
            }

            return [...acc, ...stacksToAdd];
          }
          return acc;
        },
        [],
      );
      return ListStacks.stacks;
    });
  }

  static findAvailableStackIn(
    ctor: Constructor<Stack>,
    path: string,
  ): Promise<Stack | undefined> {
    return ListStacks.getAvailableStacksIn(path).then(stacks => {
      return stacks.find(stack => {
        return stack.constructor.name === ctor.name;
      });
    });
  }
}
