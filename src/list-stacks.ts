import { StackRegister } from './tests/stacks/stack-register';
import * as fs from 'fs';

// import all stack files
fs.readdirSync(__dirname + '/stacks').forEach(path => {
  require(__dirname + '/stacks/' + path.replace('.ts', ''));
});

/**
 * Returns an array of every stack instanciated object
 */
export class ListStacks {
  static getProjectStacks(): any[] {
    return StackRegister.getImplementations()
      .map(stack => new stack())
      .filter(stack => stack.exists());
  }
}
