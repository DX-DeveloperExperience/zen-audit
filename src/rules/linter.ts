import FileUtils from '../file-utils';
import { RuleRegister } from './rule-register';
import * as fs from 'fs';

@RuleRegister.register
export default class Linter {
  readonly requiredFiles: string[] = ['tslint.json'];
  rootPath: string;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
  }

  exists() {
    return (
      FileUtils.filesExistIn(this.rootPath, this.requiredFiles) ||
      this.isInDevDep()
    );
  }

  getName() {
    return 'Linter';
  }

  apply() {}

  isInDevDep(): boolean {
    try {
      const parsed = JSON.parse(
        fs.readFileSync(this.rootPath + 'package.json', {
          encoding: 'utf8',
        }),
      );

      return parsed.devDependencies.tslint || parsed.devDependencies.eslint;
    } catch (err) {
      //console.log(err);
      return false;
    }
  }
}
