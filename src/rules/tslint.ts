import FileUtils from '../file-utils';
import { RuleRegister } from './rule-register';

@RuleRegister.register
export default class TsLint {
  readonly requiredFiles: string[] = ['tslint.json'];
  exists() {
    return FileUtils.filesExist(this.requiredFiles) && this.isInDevDep();
  }

  getName() {
    return 'TS Lint';
  }

  apply() {}

  private isInDevDep(): boolean {
    try {
      const fileToStr = fs.readFileSync('package.json', { encoding: 'utf8' });
      const parsed = JSON.parse(fileToStr);

      return parsed.devDependencies.tslint || parsed.devDependencies.eslint;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
