import { RuleRegister } from '../rule-register';
import { StackRegister } from '../../stacks/stack-register';
import { YesNo } from '../../choice/index';
import { logger } from '../../logger';
import Node from '../../stacks/node';
import TypeScript from '../../stacks/typescript';
import * as fs from 'fs-extra';
import * as util from 'util';
import * as cp from 'child_process';
import { hasDevDependencies } from '../../utils/json';
import Globals from '../../utils/globals';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Node, TypeScript])
export class Husky {
  private packagePath: string;
  private parsedPackage: any;

  constructor() {
    this.packagePath = `${Globals.rootPath}package.json`;
    this.parsedPackage = require(this.packagePath);
  }

  async apply(apply: boolean): Promise<void> {
    if (apply) {
      const exec = util.promisify(cp.exec);

      return exec('npm i -DE husky', { cwd: Globals.rootPath })
        .then((out: { stdout: string; stderr: string }) => {
          if (out !== undefined && out.stderr !== undefined) {
            throw new Error(out.stderr);
          }
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
          logger.error(err);
        });
    }
  }

  async shouldBeApplied() {
    return !this.isInDevDep();
  }

  isInDevDep(): boolean {
    return (
      hasDevDependencies(this.parsedPackage) &&
      this.parsedPackage.devDependencies.husky !== undefined
    );
  }

  getName(): string {
    return 'Husky';
  }

  getShortDescription(): string {
    return 'Husky can prevent bad commits or bad push. Please select rules you would like to add.';
  }

  getLongDescription() {
    return 'Laborum exercitation incididunt nulla veniam labore esse. Pariatur adipisicing sint aliqua adipisicing culpa consequat reprehenderit excepteur eiusmod. Est irure voluptate fugiat enim minim laborum. Magna anim eiusmod consectetur voluptate. Proident ad ex laborum in adipisicing sit minim aliquip duis. Do non voluptate mollit officia consequat proident ex mollit dolore qui esse sit reprehenderit.';
  }

  getPromptType() {
    return 'checkbox';
  }

  getChoices() {
    return YesNo;
  }
}
