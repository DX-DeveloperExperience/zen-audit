import { RuleRegister } from '../../../rule-register';
import { StackRegister } from '../../../../stacks/stack-register';
import { ListStacks } from '../../../../stacks/list-stacks/index';
import { linterJSON } from './constants';
import { logger } from '../../../../logger/index';
import TypeScript from '../../../../stacks/typescript/index';
import Node from '../../../../stacks/node/index';
import * as fs from 'fs-extra';
import { hasDevDependency } from '../../../../utils/json';
import { YesNo } from '../../../../choice/index';
import Globals from '../../../../utils/globals';
import { installNpmDevDep } from '../../../../utils/commands';

@RuleRegister.register
@StackRegister.registerRuleForStacks([TypeScript, Node])
export class Linter {
  private packageJSONPath: string;
  private linterPaths: { [path: string]: string };
  private parsedPackageJSON: any;
  private initialized: boolean | undefined = undefined;
  private linterChoice: string = '';
  private linterhasConfigFile: boolean = false;
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

  private async init(): Promise<void> {
    if (!this.initialized) {
      return ListStacks.findAvailableStackIn(TypeScript, Globals.rootPath).then(
        stack => {
          this.linterChoice = stack !== undefined ? 'tslint' : 'eslint';
        },
      );
    }
  }

  async shouldBeApplied() {
    return this.init().then(async () => {
      this.linterhasConfigFile = await this.hasConfigFile(this.linterChoice);
      this.linterInDevDep = hasDevDependency(
        this.parsedPackageJSON,
        this.linterChoice,
      );

      return !this.linterInDevDep || !this.linterhasConfigFile;
    });
  }

  async apply(apply: boolean): Promise<void> {
    if (apply) {
      return this.init().then(() => {
        if (this.linterInDevDep) {
          logger.info(`${this.linterChoice} already installed.`);
        } else {
          const linterToInstall =
            this.linterChoice === 'tslint' ? 'tslint typescript' : 'eslint';

          return installNpmDevDep(linterToInstall).then(() => {
            if (!this.linterhasConfigFile) {
              return this.writeLinterFile();
            } else {
              logger.info(`${this.linterChoice}.json file already existing.`);
            }
          });
        }
      });
    }
  }

  private writeLinterFile() {
    return fs
      .ensureFile(this.linterPaths[this.linterChoice])
      .catch(err => {
        logger.error(`Error creating ${this.linterPaths[this.linterChoice]}`);
        logger.debug(err);
        return Promise.reject(err);
      })
      .then(() => {
        return fs
          .writeJson(
            this.linterPaths[this.linterChoice],
            linterJSON[this.linterChoice],
            { spaces: '\t' },
          )
          .then(() => {
            logger.info(
              `Succesfully written ${
                this.linterPaths[this.linterChoice]
              }. You may add more rules if you like, find documentation at : ${
                this.documentation[this.linterChoice]
              }`,
            );
          })
          .catch(err => {
            logger.error(
              `Linter Rule: Error trying to write to ${
                this.linterPaths[this.linterChoice]
              }`,
            );
          });
      });
  }

  hasConfigFile(linter: string): Promise<boolean> {
    return fs.pathExists(this.linterPaths[linter]);
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
