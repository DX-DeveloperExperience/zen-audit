import {
  WriteFileError,
  CreateFileError,
} from '../../../../errors/file-errors';
import { linterJSON } from './constants';
import { logger } from '../../../../logger/index';
import TypeScript from '../../../../stacks/typescript/index';
import Node from '../../../../stacks/node/index';
import * as fs from 'fs-extra';
import { hasDevDependency } from '../../../../utils/json';
import { YesNo } from '../../../../choice/index';
import Globals from '../../../../utils/globals';
import { installNpmDevDep } from '../../../../utils/commands';
import { Register } from '../../../../register';

@Register.ruleForStacks([TypeScript, Node])
export class Linter {
  private packageJSONPath: string;
  private linterPaths: { [path: string]: string };
  private parsedPackageJSON: any;
  private linterChoice: string | undefined;
  private linterHasConfigFile: boolean | undefined;
  private linterInDevDep: boolean = false;
  private documentation: { [linter: string]: string } = {
    tslint: 'https://palantir.github.io/tslint/usage/configuration/',
    eslint: 'https://eslint.org/docs/user-guide/configuring',
  };

  constructor() {
    this.packageJSONPath = `${Globals.rootPath}package.json`;
    this.linterPaths = {
      tslint: `${Globals.rootPath}tslint.json`,
      eslint: `${Globals.rootPath}eslint.json`,
    };

    this.parsedPackageJSON = require(this.packageJSONPath);
  }

  async shouldBeApplied() {
    const linterChoice = await this.getLinterChoice();
    this.linterHasConfigFile = await this.hasConfigFile(linterChoice);
    this.linterInDevDep = hasDevDependency(
      this.parsedPackageJSON,
      linterChoice,
    );

    return !this.linterInDevDep || !this.linterHasConfigFile;
  }

  async apply(): Promise<void> {
    const linterChoice = await this.getLinterChoice();
    return new Promise((resolve, reject) => {
      if (this.linterInDevDep) {
        logger.info(`${this.linterChoice} already installed.`);
        resolve();
      } else {
        const linterToInstall =
          linterChoice === 'tslint' ? 'tslint typescript' : 'eslint';
        installNpmDevDep(linterToInstall)
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      }
    }).then(() => {
      if (this.linterHasConfigFile) {
        logger.info(`${this.linterChoice}.json file already existing.`);
        return Promise.resolve();
      } else {
        this.writeLinterFile()
          .then(() => {
            return Promise.resolve();
          })
          .catch(err => {
            throw err;
          });
      }
    });
  }

  private async writeLinterFile(): Promise<void> {
    const linterChoice = await this.getLinterChoice();
    return new Promise<void>((resolve, reject) => {
      fs.ensureFile(this.linterPaths[linterChoice])
        .then(
          () => {
            return fs.writeJson(
              this.linterPaths[linterChoice],
              linterJSON[linterChoice],
              {
                spaces: '\t',
              },
            );
          },
          err => {
            reject(
              new CreateFileError(
                err,
                this.linterPaths[linterChoice],
                this.constructor.name,
              ),
            );
          },
        )
        .then(
          () => {
            logger.info(
              `Succesfully written ${
                this.linterPaths[linterChoice]
              }. You may add more rules if you like, find documentation at : ${
                this.documentation[linterChoice]
              }`,
            );
            resolve();
          },
          err => {
            reject(
              new WriteFileError(
                err,
                this.linterPaths[linterChoice],
                this.constructor.name,
              ),
            );
          },
        );
    });
  }

  async hasConfigFile(linter: string): Promise<boolean> {
    if (this.linterHasConfigFile !== undefined) {
      return this.linterHasConfigFile;
    }

    return fs.pathExists(this.linterPaths[linter]).then(result => {
      return (this.linterHasConfigFile = result);
    });
  }

  async getLinterChoice(): Promise<string> {
    if (this.linterChoice !== undefined) {
      return this.linterChoice;
    }

    return Register.stackIsAvailable(TypeScript).then(stack => {
      return stack ? 'tslint' : 'eslint';
    });
  }

  getName() {
    return 'Linter';
  }

  getShortDescription() {
    return 'Linter: you may use a linter (tslint or eslint) to keep your code error free and syntaxically correct. Would you like to add it ?';
  }

  getLongDescription() {
    return 'Proident duis cillum incididunt ipsum. Sint quis ut proident excepteur nulla cillum laborum qui mollit quis do nulla. Quis minim ipsum duis anim voluptate quis sit nisi. Aliqua exercitation elit adipisicing aliquip nisi cupidatat anim ut anim cillum exercitation. Sint excepteur commodo aliqua et mollit aliquip nisi aute ad. Anim nisi Lorem quis sunt. Ut ullamco laborum officia dolore aute non sunt do sint sit ipsum.';
  }

  getPromptType() {
    return 'list';
  }

  getChoices() {
    return YesNo;
  }
}
