import { FileNotReadableError } from './../errors/FileNotReadableError';
import FileUtils from '../file-utils';
import { RuleRegister } from './rule-register';
import * as fs from 'fs';

@RuleRegister.register
export class Linter {
  readonly requiredFiles: string[] = ['tslint.json'];
  readonly rootPath: string;
  private packageJSONPath: string;
  private packageFileExists: boolean;
  private parsedFile: any;

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;

    this.packageJSONPath = `${this.rootPath}package.json`;

    try {
      this.parsedFile = JSON.parse(
        fs.readFileSync(this.packageJSONPath, { encoding: 'utf8' }),
      );
      this.packageFileExists = true;
    } catch (err) {
      if (err.code === 'ENOENT') {
        this.packageFileExists = false;
      } else {
        throw new FileNotReadableError(this.packageJSONPath);
      }
    }
  }

  shouldBeApplied() {
    return (
      this.packageFileExists &&
      !(
        FileUtils.filesExistIn(this.rootPath, this.requiredFiles) &&
        this.isInDevDep()
      )
    );
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

  getName() {
    return 'Linter';
  }

  getDescription() {
    return 'Linter: you may use a linter (tslint or eslint) to keep your code error free and syntaxically correct. Would you like to add it ?';
  }
  }
}
