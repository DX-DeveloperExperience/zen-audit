import { RuleRegister } from '../rule-register';
import { Node } from '../../stacks/node';
import { TypeScript } from '../../stacks/typescript';
import { StackRegister } from '../../stacks/stack-register';
import { YesNo } from '../../choice/index';
import * as fs from 'fs-extra';
import * as util from 'util';
import * as cp from 'child_process';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Node, TypeScript])
export class Husky {
  private packagePath: string;
  private parsedPackage: any;

  constructor(readonly rootPath: string = './') {
    this.packagePath = `${this.rootPath}package.json`;
    this.parsedPackage = require(this.packagePath);
  }

  apply() {
    const exec = util.promisify(cp.exec);

    return exec('npm i -DE husky', { cwd: this.rootPath })
      .then(out => {
        return fs.readFile(this.packagePath, { encoding: 'utf-8' });
      })
      .then(data => {
        const parsed = JSON.parse(data);
        parsed.husky = {
          hooks: {
            'pre-push': 'exit 1',
          },
        };

        return fs.writeFile(
          this.packagePath,
          JSON.stringify(parsed, null, '\t'),
          {
            encoding: 'utf-8',
          },
        );
      })
      .catch((err: Error) => {
        return err;
      });
  }

  async shouldBeApplied() {
    return !this.isInDevDep();
  }

  isInDevDep(): boolean {
    return (
      this.parsedPackage.devDependencies !== undefined &&
      this.parsedPackage.husky !== undefined
    );
  }

  getName(): string {
    return 'Husky';
  }

  getDescription(): string {
    return 'Husky can prevent bad commits or bad push. Please select rules you would like to add.';
  }

  getPromptType() {
    return 'checkbox';
  }

  getChoices() {
    return YesNo;
  }
}
