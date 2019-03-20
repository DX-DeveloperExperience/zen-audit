import { FileNotReadableError } from './../errors/FileNotReadableError';
import { FileNotFoundError } from './../errors/FileNotFoundError';
import { RuleRegister } from './rule-register';
import * as fs from 'fs';

@RuleRegister.register
export default class Husky {
  readonly requiredFiles: string[] = ['package.json'];
  readonly rootPath: string;
  private packageJSON: string;
  private parsedFile: any;

  constructor(rootPath?: string) {
    if (rootPath === undefined) {
      this.rootPath = './';
    } else {
      this.rootPath = rootPath;
    }

    this.packageJSON = this.rootPath + 'package.json';

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

  apply() {
    // TODO
  }

  exists() {
    return this.isInDevDep();
  }

  isInDevDep(): boolean {
    return this.parsedFile.devDependencies.prettier !== undefined;
  }

  getName(): string {
    return 'Husky';
  }
}