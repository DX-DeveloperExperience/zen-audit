import { RuleRegister } from '../rule-register';
import { StackRegister } from '../../stacks/stack-register';
import { ListStacks } from '../../stacks/list-stacks/index';
import { linterJSON } from './constants';
import { logger } from '../../logger/index';
import TypeScript from '../../stacks/typescript/index';
import Node from '../../stacks/node/index';
import * as fs from 'fs-extra';
import * as cp from 'child_process';
import * as util from 'util';

@RuleRegister.register
@StackRegister.registerRuleForStacks([TypeScript, Node])
export class Linter {
  readonly rootPath: string;
  private packageJSONPath: string;
  private linterPaths: { [path: string]: string };
  private parsedPackageJSON: any;
  private initialized: boolean | undefined = undefined;
  private linterChoice: string = '';
  private linterhasConfigFile: boolean = false;
  private linterInDevDep: boolean = false;

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
    this.packageJSONPath = `${this.rootPath}package.json`;
    this.linterPaths = {
      tslint: `${this.rootPath}tslint.json`,
      eslint: `${this.rootPath}eslint.json`,
    };

    this.parsedPackageJSON = require(this.packageJSONPath);
  }

  private async init(): Promise<void> {
    if (!this.initialized) {
      return ListStacks.getStackByName('TypeScript').then(stack => {
        return stack.isAvailable().then(result => {
          this.linterChoice = result ? 'tslint' : 'eslint';
          return;
        });
      });
    }
    return;
  }

  async shouldBeApplied() {
    return this.init().then(async () => {
      this.linterhasConfigFile = await this.hasConfigFile(this.linterChoice);
      this.linterInDevDep = this.isInDevDep(this.linterChoice);

      return !this.linterInDevDep || !this.linterhasConfigFile;
    });
  }

  async apply(apply: boolean) {
    if (apply) {
      const exec = util.promisify(cp.exec);
      return this.init()
        .then(() => {
          if (!this.linterInDevDep) {
            const installCmd =
              this.linterChoice === 'tslint'
                ? 'npm i tslint typescript -DE'
                : 'npm i eslint -DE';

            return exec(installCmd, { cwd: this.rootPath })
              .then(() => {
                logger.info(`Installed ${this.linterChoice} succesfully`);
              })
              .catch(() => {
                logger.error(
                  `Could notCould not install ${
                    this.linterChoice
                  }, try installing it using "${installCmd}" command.`,
                );
              });
          } else {
            logger.info(`${this.linterChoice} already installed.`);
          }
        })
        .then(() => {
          if (!this.linterhasConfigFile) {
            const documentation: { [linter: string]: string } = {
              tslint: 'https://palantir.github.io/tslint/usage/configuration/',
              eslint: 'https://eslint.org/docs/user-guide/configuring',
            };
            this.writeLinterFile()
              .then(() => {
                logger.info(
                  ` ${
                    this.linterChoice
                  }.json succesfully written to root folder. You may add more rules if you like, find documentation at : ${
                    documentation[this.linterChoice]
                  }`,
                );
              })
              .catch(err => {
                logger.error(`Error writing to ${this.linterChoice} file.`);
                logger.debug(err);
              });
          } else {
            logger.info(`${this.linterChoice}.json file already existing.`);
          }
        });
    }
  }

  private writeLinterFile() {
    return fs
      .ensureFile(this.linterPaths[this.linterChoice])
      .catch(err => {
        logger.error(`Error creating ${this.linterChoice}.json`);
        logger.debug(err);
        return;
      })
      .then(() => {
        return fs.writeJson(
          this.linterPaths[this.linterChoice],
          linterJSON[this.linterChoice],
          { spaces: '\t' },
        );
      });
  }

  hasConfigFile(linter: string): Promise<boolean> {
    return fs.pathExists(this.linterPaths[linter]);
  }

  isInDevDep(linter: string): boolean {
    return (
      this.hasDevDep() &&
      this.parsedPackageJSON.devDependencies[linter] !== undefined
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
