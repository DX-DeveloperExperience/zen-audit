import FileUtils from '../file-utils';
import { RuleRegister } from './rule-register';
import * as fs from 'fs';

@RuleRegister.register
export default class TsLint {
  readonly requiredFiles: string[] = ['tslint.json'];
  rootPath: string;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
  }

  exists() {
    return (
      FileUtils.filesExistIn(this.rootPath, this.requiredFiles) &&
      this.isInDevDep()
    );
  }

  getName() {
    return 'TS Lint';
  }

  apply() {}

  isInDevDep(): boolean {
    try {
      const fileToStr = fs.readFileSync(this.rootPath + 'package.json', {
        encoding: 'utf8',
      });
      const parsed = JSON.parse(fileToStr);

      return parsed.devDependencies.tslint || parsed.devDependencies.eslint;
    } catch (err) {
      //console.log(err);
      return false;
    }
  }
}
