import { StackRegister } from './stacks/stack-register';
import * as fs from 'fs';
import Stack from './stacks/stack';

// import all stack files
fs.readdirSync(__dirname + '/stacks').forEach(path => {
  require(__dirname + '/stacks/' + path.replace('.ts', ''));
});

/**
 * Returns an array of every stack instanciated object
 */
export class ListStacks {
  static getProjectStacks(): Stack[] {
    return StackRegister.getImplementations()
      .map(stack => new stack())
      .filter(stack => stack.exists());
  }
}
