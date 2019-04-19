import { StackRegister } from './stack-register';
import * as fs from 'fs';
import Stack from './stack';

// import all stacks files
fs.readdirSync(`${__dirname}/stacks`)
  .filter(path => {
    return path.endsWith('.d.ts') || path.endsWith('.ts');
  })
  .forEach(path => {
    require(`${__dirname}/stacks/${path.replace('.ts', '')}`);
  });

export class ListStacks {
  static findStacksIn(rootPath: string): Stack[] {
    return StackRegister.getImplementations()
      .map(stack => new stack(rootPath))
      .filter(stack => stack.isInPath());
  }
}
