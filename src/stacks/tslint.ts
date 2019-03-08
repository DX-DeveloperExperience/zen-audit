import { StackRegister } from '../stack-register';

@StackRegister.register
export default class TsLint {
  readonly requiredFiles: string[] = ['tslint.json'];
  existsInPath(paths: string): boolean {
    return true;
  }
  doSomething() {
    console.log('do 1');
  }
}
