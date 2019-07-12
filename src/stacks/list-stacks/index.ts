import { StackRegister, Constructor } from '../stack-register';
import Stack from '../stack';
import Globals from '../../utils/globals';
import { logger } from '../../logger';

export class ListStacks {
  static stacks: Stack[] | undefined;
  static async getAvailableStacks() {
    if (ListStacks.stacks !== undefined) {
      return ListStacks.stacks;
    }

    const stacks = StackRegister.getStacks();
    const isAvailablePromise = stacks.map(stack => stack.isAvailable());

    return Promise.all(isAvailablePromise).then(availableValues => {
      ListStacks.stacks = stacks.reduce(
        (acc: Stack[], stack: Stack, i: number) => {
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

  static findAvailableStack(
    ctor: Constructor<Stack>,
  ): Promise<Stack | undefined> {
    return ListStacks.getAvailableStacks().then(stacks => {
      return stacks.find(stack => {
        return stack.constructor.name === ctor.name;
      });
    });
  }

  static async stackIsAvailable(ctor: Constructor<Stack>): Promise<boolean> {
    return this.findAvailableStack(ctor) !== undefined;
  }
}
