import { WriteFileError } from './../../../../errors/FileErrors';
import Choice, { YesNo } from './../../../../choice/index';
import { React } from './../../../../stacks/react/index';
import Angular from '../../../../stacks/angular';
import VueJS from '../../../../stacks/vue-js';
import Globals from '../../../../utils/globals';
import { IPackageJSON } from '../../../../utils/json/types/package';
import { pathExistsInJSON } from '../../../../utils/json';
import { installNpmDevDep } from '../../../../utils/commands';
import { copyFile, ensureDir, readJSON, writeJSON, promises } from 'fs-extra';
import { DirError } from '../../../../errors/DirErrors';
import { logger } from '../../../../logger';
import { Register } from '../../../../register';

@Register.ruleForStacks([React, Angular, VueJS])
export class LightHouse {
  private parsedPackage: IPackageJSON;
  private scripts: string[] | undefined;
  private hasLighthouseScript: boolean = false;
  private hasDevdependency: boolean;

  constructor() {
    this.parsedPackage = require(Globals.packageJSONPath);
    this.hasDevdependency = pathExistsInJSON(this.parsedPackage, [
      'devDependencies',
      'lighthouse',
    ]);
    if (this.parsedPackage.scripts !== undefined) {
      this.scripts = Object.keys(this.parsedPackage.scripts);
      this.hasLighthouseScript = this.scripts.includes('lighthouse');
    }
  }

  async shouldBeApplied(): Promise<boolean> {
    return !this.hasDevdependency || !this.hasLighthouseScript;
  }

  async apply(apply: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.hasDevdependency) {
        resolve(installNpmDevDep('lighthouse'));
      }
      resolve();
    }).then(() => {
      logger.info('LightHouse: Succesfully installed LightHouse npm package.');
      return this.createScript();
    });
  }

  private async createScript(): Promise<void> {
    const scriptsDirPath = Globals.rootPath + 'lighthouse-scripts/';
    return new Promise((resolve, reject) => {
      return ensureDir(scriptsDirPath)
        .then(
          () => {
            return copyFile(
              __dirname + '/script.js',
              scriptsDirPath + 'lighthouse.js',
            );
          },
          err => {
            reject(new DirError(err, scriptsDirPath, this.constructor.name));
          },
        )
        .then(
          () => {
            return readJSON(Globals.packageJSONPath);
          },
          err => {
            reject(
              new WriteFileError(
                err,
                scriptsDirPath + 'lighthouse.js',
                this.constructor.name,
              ),
            );
          },
        )
        .then(result => {
          const packageJSON = result;
          if (packageJSON.scripts === undefined) {
            packageJSON.scripts = {};
          }

          if (packageJSON.scripts.lighthouse === undefined) {
            packageJSON.scripts.lighthouse =
              'node lighthouse-scripts/lighthouse.js';
          }

          return writeJSON(Globals.packageJSONPath, result, { spaces: '\t' });
        })
        .then(() => {
          logger.info(
            "LightHouse: Succesfully added LightHouse script. Run 'npm run lighthouse -- URL' command by replacing URL with the URL to your project to run it. Don't forget to install chrome before running the script",
          );
          resolve();
        });
    });
  }

  getName(): string {
    return 'LightHouse';
  }

  getShortDescription(): string {
    return 'Add LightHouse dependency and a npm script to run audits ?';
  }

  getLongDescription(): string {
    return 'lorem ipsum...';
  }

  getPromptType(): string {
    return 'list';
  }

  getChoices(): Choice[] {
    return YesNo;
  }
}
