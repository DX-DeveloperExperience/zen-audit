import { ReadFileError, WriteFileError } from './../../../../errors/FileErrors';
import { RuleRegister } from '../../../rule-register';
import { StackRegister } from '../../../../stacks/stack-register';
import { YesNo } from '../../../../choice/index';
import { logger } from '../../../../logger';
import Node from '../../../../stacks/node';
import TypeScript from '../../../../stacks/typescript';
import * as fs from 'fs-extra';
import { hasDevDependency, pathExistsInJSON } from '../../../../utils/json';
import Globals from '../../../../utils/globals';
import { installNpmDevDep } from '../../../../utils/commands';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Node, TypeScript])
export class Husky {
  private parsedPackage: any;

  constructor() {
    this.parsedPackage = require(Globals.packageJSONPath);
  }

  async apply(apply: boolean): Promise<void> {
    if (apply) {
      return installNpmDevDep('husky').then(() => {
        return this.writeHuskyHook();
      });
    }
  }

  private async writeHuskyHook(): Promise<void> {
    if (!pathExistsInJSON(this.parsedPackage, ['husky', 'hooks', 'pre-push'])) {
      return new Promise<void>((resolve, reject) => {
        return fs
          .readJSON(Globals.packageJSONPath, { encoding: 'utf-8' })
          .then(
            parsed => {
              parsed.husky = {
                hooks: {
                  'pre-push': 'exit 1',
                },
              };
              return fs.writeJSON(Globals.packageJSONPath, parsed, {
                spaces: '\t',
              });
            },
            err => {
              reject(
                new ReadFileError(
                  err,
                  Globals.packageJSONPath,
                  this.constructor.name,
                ),
              );
            },
          )
          .then(
            () => {
              logger.info(
                `Husky Rule: Succesfully written pre-push hook to ${
                  Globals.packageJSONPath
                }. You may update this hook with a npm script for it to launch before pushing to git.`,
              );
              resolve();
            },
            err => {
              reject(
                new WriteFileError(
                  err,
                  Globals.packageJSONPath,
                  this.constructor.name,
                ),
              );
            },
          );
      });
    }
    return Promise.resolve();
  }

  async shouldBeApplied(): Promise<boolean> {
    return !hasDevDependency(this.parsedPackage, 'husky');
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
    return 'list';
  }

  getChoices() {
    return YesNo;
  }
}
