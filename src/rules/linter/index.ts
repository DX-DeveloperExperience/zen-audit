import { FileNotReadableError } from '../../errors/FileNotReadableError';
import FileUtils from '../../file-utils';
import { RuleRegister } from '../rule-register';
import { StackRegister } from '../../stacks/stack-register';
import { TypeScript } from '../../stacks/typescript/index';
import { Node } from '../../stacks/node/index';
import * as fs from 'fs-extra';

@RuleRegister.register
@StackRegister.registerRuleForStacks([TypeScript, Node])
export class Linter {
  readonly rootPath: string;
  private packageJSONPath: string;
  private tslintPath: string;
  private eslintPath: string;
  private packageJSONExists: boolean;
  private parsedPackageJSON: any;

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
    this.packageJSONPath = `${this.rootPath}package.json`;
    this.tslintPath = `${this.rootPath}tslint.json`;
    this.eslintPath = `${this.rootPath}eslint.json`;

    try {
      require(this.packageJSONPath);
      this.packageJSONExists = true;
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        this.packageJSONExists = false;
      } else {
        throw new FileNotReadableError(this.packageJSONPath);
      }
    }
  }

  async shouldBeApplied() {
    return (
      this.packageJSONExists &&
      (!FileUtils.filesExistIn(this.rootPath, ['tslint.json', 'eslint.json']) ||
        !this.isInDevDep())
    );
  }

  async apply() {
    if (new TypeScript(this.rootPath).isAvailable()) {
      return fs.writeFile(
        this.tslintPath,
        JSON.stringify(tslintJSON, null, '\t'),
        { encoding: 'utf-8' },
      );
    } else {
      return fs.writeFile(
        this.eslintPath,
        JSON.stringify(eslintJSON, null, '\t'),
        { encoding: 'utf-8' },
      );
    }
  }

  isInDevDep(): boolean {
    return (
      this.hasDevDep() &&
      (this.parsedPackageJSON.devDependencies.tslint !== undefined ||
        this.parsedPackageJSON.devDependencies.eslint !== undefined)
    );
  }

  hasDevDep(): boolean {
    return this.parsedPackageJSON.devDependencies !== undefined;
  }

  getName() {
    return 'Linter';
  }

  getDescription() {
    return 'Linter: you may use a linter (tslint or eslint) to keep your code error free and syntaxically correct. Would you like to add it ?';
  }

  getPromptType() {
    return 'confirm';
  }

  getChoices() {
    return [{ name: 'Yes', value: true }, { name: 'No', value: false }];
  }
}
