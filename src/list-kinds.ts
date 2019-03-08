import { listFiles } from 'list-files-in-dir';
import { StackRegister } from './stack-register';
import * as fs from 'fs';

fs.readdirSync(__dirname + '/stacks').forEach(path => {
  require(__dirname + '/stacks/' + path.replace('.ts', ''));
});
//import './stacks/nodejs';
import { fstat } from 'fs';

export class ListStacks {
  static getProjectStacks(path: string): any[] {
    return StackRegister.getImplementations()
      .map(stack => new stack())
      .filter(stack => stack.existsInPath(path));
  }
}
