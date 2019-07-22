import { WriteFileError } from './../../../../../errors/FileErrors';
import { RuleRegister } from '../../../../rule-register';
import { YesNo } from '../../../../../choice/index';
import Choice from '../../../../../choice/index';
import Globals from '../../../../../utils/globals/index';
import { StackRegister } from '../../../../../stacks/stack-register';
import { pathExistsInJSON } from '../../../../../utils/json';
import Node from '../../../../../stacks/node';
import { logger } from '../../../../../logger/index';
import * as fs from 'fs-extra';
import {
  installNpmDevDep,
  execInRootpath,
} from '../../../../../utils/commands';
import { ReadFileError } from '../../../../../errors/FileErrors';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Node])
export class Nodemon {
  private parsedJSON: any;

  constructor() {
    this.parsedJSON = require(Globals.packageJSONPath);
  }

  async shouldBeApplied(): Promise<boolean> {
    if (pathExistsInJSON(this.parsedJSON, ['devDependencies', 'nodemon'])) {
      return false;
    } else {
      return execInRootpath('nodemon -v')
        .then(() => {
          return false;
        })
        .catch(err => {
          return true;
        });
    }
  }

  async apply(apply: boolean): Promise<void> {
    if (apply) {
      return new Promise((resolve, reject) => {
        installNpmDevDep('nodemon')
          .then(
            () => {
              logger.info(
                'Nodemon: Succesfully installed nodemon as dev dependency. Checking for existing script.',
              );
              return fs.readJSON(Globals.packageJSONPath, {
                encoding: 'utf-8',
              });
            },
            err => {
              reject(err);
            },
          )
          .then(
            packageJSON => {
              if (!pathExistsInJSON(packageJSON, ['scripts', 'nodemon'])) {
                if (!pathExistsInJSON(packageJSON, ['scripts'])) {
                  packageJSON.scripts = { nodemon: 'nodemon' };
                } else {
                  packageJSON.scripts.nodemon = 'nodemon';
                }
              } else {
                logger.info('Nodemon: Script already existing.');
              }

              return fs.writeJSON(Globals.packageJSONPath, packageJSON, {
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
                'Nodemon: Succesfully added nodemon script. Run "npm run nodemon" to run it.',
              );
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
  }

  getChoices(): Choice[] {
    return YesNo;
  }

  getName(): string {
    return 'Nodemon';
  }

  getShortDescription(): string {
    return 'You may use Nodemon to live-reload your nodeJS project when changing files';
  }

  getLongDescription(): string {
    return 'Ea reprehenderit aliquip laboris dolor commodo anim pariatur nulla id fugiat eiusmod adipisicing proident ad. Incididunt eiusmod adipisicing anim do pariatur nostrud reprehenderit voluptate anim dolore nostrud fugiat cillum mollit. Enim commodo consectetur ea adipisicing commodo reprehenderit dolor velit cillum. Mollit id dolore duis enim laboris commodo fugiat. Ad ea ipsum consectetur ut ut proident ullamco nulla ex enim culpa sunt.';
  }

  getPromptType(): string {
    return 'list';
  }
}
