import { StackRegister } from '../stack-register';
import Stack from '../stack';

export class ListStacks {
  private static stacks: Stack[] = [];
  private static path = '';

  static getStacksIn(rootPath: string): Stack[] {
    if (this.path === '' || this.path !== rootPath) {
      this.path = rootPath;
    }

    if (this.stacks.length === 0 || this.path !== rootPath) {
      this.stacks = StackRegister.getImplementations()
        .map(stack => new stack(rootPath))
        .filter(stack => stack.isAvailable(rootPath));
    }

    return this.stacks;
  }
}
