import { StackRegister } from '../stack-register';
import * as fs from 'fs';
import Stack from '../stack';

export function importStacks() {
  // import all stacks files
  const stacksDirPath = `${__dirname}/..`;
  fs.readdirSync(stacksDirPath)
    .filter(path => {
      return path.endsWith('.d.ts') || path.endsWith('.ts');
    })
    .forEach(path => {
      require(`${stacksDirPath}/${path.replace(/.d.ts|.ts/, '')}`);
    });
}

export class ListStacks {
  static findStacksIn(rootPath: string): Stack[] {
    return StackRegister.getImplementations()
      .map(stack => new stack(rootPath))
      .filter(stack => stack.isInPath(rootPath));
  }
}
