import Stack from './stack';
import { StackRegister } from '../stack-register';
console.log('nodejs');
/**
 * NodeJS implementation of stack interface. This class checks if the given path
 * is a project using node.
 */
@StackRegister.register
export default class NodeJS {
  readonly requiredFiles: string[] = ['package-lock.json', 'package.json'];

  //existsInPath()
}
