import { RuleRegister } from '../rule-register';
import { StackRegister } from '../../stacks/stack-register';
import { TypeScript } from '../../stacks/typescript/index';
import { Node } from '../../stacks/node/index';
import * as fs from 'fs-extra';
import { linterJSON } from './constants';
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

  private async init() {
    if (!this.initialized) {
      return new TypeScript(this.rootPath).isAvailable().then(result => {
        this.linterChoice = result ? 'tslint' : 'eslint';
        return Promise.resolve();
      });
    }

    return Promise.resolve();
  }

  async shouldBeApplied() {
    return this.init().then(async () => {
      this.linterhasConfigFile = await this.hasConfigFile(this.linterChoice);
      this.linterInDevDep = this.isInDevDep(this.linterChoice);
      return this.linterInDevDep && this.linterhasConfigFile;
    });
  }

  async apply() {
    const exec = util.promisify(cp.exec);
    return this.init()
      .then(() => {
        if (!this.linterInDevDep) {
          const installCmd =
            this.linterChoice === 'tslint'
              ? 'npm i tslint typescript -DE'
              : 'npm i eslint -DE';
          return exec(installCmd)
            .then(() => {
              return `Installed ${this.linterChoice} succesfully`;
            })
            .catch(() => {
              return `Could notCould not install ${
                this.linterChoice
              }, try installing it using "${installCmd}" command.`;
            });
        }
        return `${this.linterChoice} already installed.`;
      })
      .then(feedBack => {
        const documentation: { [linter: string]: string } = {
          tslint: 'https://palantir.github.io/tslint/usage/configuration/',
          eslint: 'https://eslint.org/docs/user-guide/configuring',
        };

        if (!this.linterhasConfigFile) {
          return fs.ensureFile(this.linterPaths[this.linterChoice]).then(() => {
            return fs
              .writeJson(
                this.linterPaths[this.linterChoice],
                linterJSON[this.linterChoice],
                { spaces: '\t' },
              )
              .then(() => {
                return (
                  feedBack +
                  ` ${
                    this.linterChoice
                  }.json succesfully written to root folder. You may add more rules if you like, find documentation at : ${
                    documentation[this.linterChoice]
                  }`
                );
              });
          });
        } else {
          return feedBack + `${this.linterChoice}.json file already existing.`;
        }
      });
  }

  hasConfigFile(linter: string): Promise<boolean> {
    return fs
      .pathExists(this.linterPaths[linter])
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
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
