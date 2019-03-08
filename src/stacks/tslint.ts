import { StackRegister } from '../stack-register';

@StackRegister.register
export default class TsLint {
  readonly requiredFiles: string[] = ['tslint.json'];
  existsInPaths(paths: string[]): boolean {
    return true;
  }
}
