import { StackRegister } from './stack-register';
import FileUtils from '../file-utils';

@StackRegister.register
export default class TsLint {
  readonly requiredFiles: string[] = ['tslint.json'];
  exists() {
    return FileUtils.filesExist(this.requiredFiles);
  }

  getName() {
    return 'TS Lint';
  }

  apply() {}
}
