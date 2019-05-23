import { RuleRegister } from '../rule-register';
import { Node } from '../../stacks/node';
import { TypeScript } from '../../stacks/typescript';
import { StackRegister } from '../../stacks/stack-register';
import { YesNo } from '../../choice/index';
import { exec } from 'child_process';
import * as util from 'util';
import * as fs from 'fs';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Node, TypeScript])
export class Husky {
  private packagePath: string;

  constructor(readonly rootPath: string = './') {
    this.packagePath = `${this.rootPath}package.json`;
  }

  apply() {
    const asyncExec = util.promisify(exec);
    const asyncWriteFile = util.promisify(fs.writeFile);
    const asyncReadFile = util.promisify(fs.readFile);

    return asyncExec('npm i -DE husky', { cwd: this.rootPath })
      .then(out => {
        return asyncReadFile(this.packagePath, { encoding: 'utf-8' });
      })
      .then(data => {
        const parsed = JSON.parse(data);
        parsed.husky = {
          hooks: {
            'pre-push': 'exit 1',
          },
        };

        return asyncWriteFile(
          this.packagePath,
          JSON.stringify(parsed, null, '\t'),
          {
            encoding: 'utf-8',
          },
        );
      })
      .catch((err: Error) => {
        // console.log(err);
        return err;
      });
  }

  shouldBeApplied() {
    return !this.isInDevDep();
  }

  isInDevDep(): boolean {
    return (
      this.parsedPackage().devDependencies !== undefined &&
      this.parsedPackage().husky !== undefined
    );
  }

  parsedPackage(): any {
    return require(this.packagePath);
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
