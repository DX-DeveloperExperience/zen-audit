import { FileNotReadableError } from './../errors/FileNotReadableError';
import { FileNotFoundError } from './../errors/FileNotFoundError';
import FileUtils from '../file-utils';
import { RuleRegister } from './rule-register';
import * as fs from 'fs';

@RuleRegister.register
export default class Linter {
  readonly requiredFiles: string[] = ['tslint.json'];
  readonly rootPath: string;
  private packageJSON: string;
  private parsedFile: any;

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;

    this.packageJSON = `${this.rootPath}package.json`;

    try {
      this.parsedFile = JSON.parse(
        fs.readFileSync(this.packageJSON, { encoding: 'utf8' }),
      );
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new FileNotFoundError(this.packageJSON);
      } else if (err.code === 'EACCESS') {
        throw new FileNotReadableError(this.packageJSON);
      }
    }
  }

  shouldBeApplied() {
    return !(
      FileUtils.filesExistIn(this.rootPath, this.requiredFiles) &&
      this.isInDevDep()
    );
  }

  getName() {
    return 'Linter';
  }

  apply() {
    // TODO
  }

  isInDevDep(): boolean {
    return (
      this.parsedFile.devDependencies.tslint !== undefined ||
      this.parsedFile.devDependencies.eslint !== undefined
    );
  }
}
