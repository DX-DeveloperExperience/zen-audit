import { listFiles } from 'list-files-in-dir';
import { StackRegister } from '../stack-register';

export class ListStacks {
  private static paths: string[] = [];

  static getProjectStacks(path: string): string[] {
    const stacks: string[] = [];
    // this.getPathsList(path);

    StackRegister.getImplementations().map(stack => {
      if (new stack().existsInPaths(this.paths)) {
        stacks.push(stack.constructor.name);
      }
    });

    return stacks;
  }

  // private getPathsList(path: string): Promise<string[]> {
  //   return listFiles(path).then(files => {
  //     this.paths = files;
  //     return this.paths;
  //   });
  // }
}
