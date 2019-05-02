import { StackRegister } from '../stack-register';
import * as fs from 'fs';
import Stack from '../stack';

// export function importStacks() {
//   // import all stacks files
//   const stacksDirPath = `${__dirname}/..`;
//   fs.readdirSync(stacksDirPath)
//     .filter(path => {
//       return path.endsWith('.d.ts') || path.endsWith('.ts');
//     })
//     .forEach(path => {
//       require(`${stacksDirPath}/${path.replace(/.d.ts|.ts/, '')}`);
//     });
// }

export class ListStacks {
  private static stacks: Stack[] = [];
  private static path = '';

  static getStacksIn(rootPath: string): Stack[] {
    if (this.path === '' || this.path !== rootPath) {
      this.path = rootPath;
    }

    if (this.stacks.length === 0 || this.path !== rootPath) {
    }
    return StackRegister.getImplementations()
      .map(stack => new stack(rootPath))
      .filter(stack => stack.isInPath(rootPath));
  }
}
