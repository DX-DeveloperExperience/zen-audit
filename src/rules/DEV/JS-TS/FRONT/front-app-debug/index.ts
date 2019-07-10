import { Constructor } from '../../../../../stacks/stack-register/index';
import { ListStacks } from '../../../../../stacks/list-stacks/index';
import { RuleRegister } from '../../../../rule-register';
import { StackRegister } from '../../../../../stacks/stack-register';
import VueJS from '../../../../../stacks/vue-js';
import Angular from '../../../../../stacks/angular';
import { React } from '../../../../../stacks/react';
import { YesNo } from '../../../../../choice';
import Globals from '../../../../../utils/globals';
import { vscodeConfig, LaunchConfFile, configs, LaunchConf } from './constants';
import Stack from '../../../../../stacks/stack';
import { pathExistsInJSON } from '../../../../../utils/json';
import * as fs from 'fs-extra';
import { logger } from '../../../../../logger';

@RuleRegister.register
@StackRegister.registerRuleForStacks([VueJS, Angular, React])
export class FrontAppDebug {
  private parsedLaunchConf: LaunchConfFile;
  private existingConfigs: LaunchConf[] | undefined;
  private missingConfigs: LaunchConf[] | undefined;
  private foundStacks: Array<Constructor<Stack>> | undefined;
  private launchConfFilePath = `${Globals.rootPath}.vscode/launch.json`;
  private readonly stacksToCheck: Array<Constructor<Stack>> = [
    VueJS,
    Angular,
    React,
  ];

  constructor() {
    try {
      this.parsedLaunchConf = require(this.launchConfFilePath);
    } catch (err) {
      this.parsedLaunchConf = vscodeConfig;
    }
  }

  async shouldBeApplied(): Promise<boolean> {
    return this.getMissingConfigs().then(missingConfigs => {
      return missingConfigs.length !== 0;
    });
  }

  async apply(apply: boolean): Promise<void> {
    return this.addMissingConfigurations().then(() => {
      return fs.writeJSON(this.launchConfFilePath, this.parsedLaunchConf, {
        spaces: '\t',
      });
    });
  }

  private addMissingConfigurations(): Promise<void> {
    return this.getMissingConfigs()
      .then(missingConfigs => {
        missingConfigs.forEach(missingConf => {
          this.parsedLaunchConf.configurations.push(missingConf);
        });
      })
      .catch(err => {
        logger.debug(err.stacktrace);
        throw new Error(
          'FrontAppDebug: Error trying to add missing configurations',
        );
      });
  }

  private async getMissingConfigs(): Promise<LaunchConf[]> {
    if (this.missingConfigs !== undefined) {
      return this.missingConfigs;
    }

    return this.getFoundStacks().then(foundStacks => {
      this.missingConfigs = foundStacks.reduce(
        (prevMissingConfig, foundStack: Constructor<Stack>, i) => {
          const configsToAddStackName = Object.values(configs).find(obj => {
            return obj.stack === foundStack;
          });

          let configsToAdd;

          if (configsToAddStackName !== undefined) {
            configsToAdd = configsToAddStackName.confs.filter(configToAdd => {
              return !this.getExistingConfigs().some(existingConfig => {
                return configToAdd.type === existingConfig.type;
              });
            });
            return [...prevMissingConfig, ...configsToAdd];
          }

          return [...prevMissingConfig];
        },
        [],
      );

      return this.missingConfigs;
    });
  }

  private getExistingConfigs() {
    if (this.existingConfigs !== undefined) {
      return this.existingConfigs;
    }

    if (pathExistsInJSON(this.parsedLaunchConf, ['configurations'])) {
      return (this.existingConfigs = this.parsedLaunchConf.configurations);
    } else {
      return (this.existingConfigs = []);
    }
  }

  private async getFoundStacks(): Promise<Array<Constructor<Stack>>> {
    if (this.foundStacks !== undefined) {
      return this.foundStacks;
    } else {
      const areAvailablePromise = this.stacksToCheck.map(stackToCheck => {
        return ListStacks.stackIsAvailable(stackToCheck);
      });

      return Promise.all(areAvailablePromise).then(areAvailable => {
        this.foundStacks = this.stacksToCheck.filter((stackToCheck, i) => {
          return areAvailable[i];
        });
        return this.foundStacks;
      });
    }
  }

  getName(): string {
    return 'Front Application Debugging';
  }

  getShortDescription(): string {
    return 'In order to debug front-end applications made with Vue, Angular or React, this rule adds the config file in .vscode folder.';
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