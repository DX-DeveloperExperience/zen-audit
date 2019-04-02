import { FileNotReadableError } from './../errors/FileNotReadableError';
import { RuleRegister } from './rule-register';
import * as fs from 'fs';

@RuleRegister.register
export class Husky {
  readonly requiredFiles: string[] = ['package.json'];
  readonly rootPath: string;
  private packageJSON: string;
  private packageFileExists: boolean;
  private parsedFile: any;

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;

    this.packageJSON = `${this.rootPath}package.json`;

    try {
      this.parsedFile = JSON.parse(
        fs.readFileSync(this.packageJSON, { encoding: 'utf8' }),
      );
      this.packageFileExists = true;
    } catch (err) {
      if (err.code === 'ENOENT') {
        this.packageFileExists = false;
      } else {
        throw new FileNotReadableError(this.packageJSON);
      }
    }
  }

  apply() {
    // TODO
  }

  shouldBeApplied() {
    return this.packageFileExists && !this.isInDevDep();
  }

  isInDevDep(): boolean {
    return this.parsedFile.devDependencies.husky !== undefined;
  }

  name(): string {
    return 'Husky';
  }

  description(): string {
    return 'Husky can prevent bad commits or bad push.';
  }
}
