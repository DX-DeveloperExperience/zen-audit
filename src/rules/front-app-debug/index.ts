import { Constructor } from './../../stacks/stack-register/index';
import { ListStacks } from './../../stacks/list-stacks/index';
import { RuleRegister } from '../rule-register';
import { StackRegister } from '../../stacks/stack-register';
import VueJS from '../../stacks/vue-js';
import Angular from '../../stacks/angular';
import { React } from '../../stacks/react';
import { YesNo } from '../../choice';
import Globals from '../../utils/globals';
import { vscodeConfig, LaunchConfFile, configs, LaunchConf } from './constants';
import Stack from '../../stacks/stack';
import { pathExistsInJSON } from '../../utils/json';
import * as fs from 'fs-extra';

@RuleRegister.register
@StackRegister.registerRuleForStacks([VueJS, Angular, React])
export class FrontAppDebug {
  private parsedLaunchConf: LaunchConfFile;
  private existingConfigs: LaunchConf[] = [];
  private launchConfFilePath = `${Globals.rootPath}.vscode/launch.json`;
  private missingConfigurations: LaunchConf[] = [];
  private initialized: boolean = false;
  private readonly stacksToCheck: Array<Constructor<Stack>> = [
    VueJS,
    Angular,
    React,
  ];
  private foundStacks: Array<Constructor<Stack>> = [];

  constructor() {
    try {
      this.parsedLaunchConf = require(`${Globals.rootPath}.vscode/launch.json`);
    } catch (err) {
      this.parsedLaunchConf = vscodeConfig;
    }
  }

  async init() {
    if (!this.initialized) {
      this.foundStacks = this.stacksToCheck.filter(async stackToCheck => {
        return await ListStacks.stackIsAvailable(stackToCheck);
      });

      if (pathExistsInJSON(this.parsedLaunchConf, ['configurations'])) {
        this.existingConfigs = this.parsedLaunchConf.configurations;
      }

      this.missingConfigurations = this.getMissingConfigurations();
    }
    return Promise.resolve();
  }

  async shouldBeApplied(): Promise<boolean> {
    return this.init().then(() => {
      return this.getMissingConfigurations().length !== 0;
    });
  }

  async apply(apply: boolean): Promise<void> {
    return this.init().then(() => {
      this.addMissingConfigurations(this.missingConfigurations);
      return fs.writeJSON(this.launchConfFilePath, this.parsedLaunchConf, {
        spaces: '\t',
      });
    });
  }

  private addMissingConfigurations(missingConfigurations: LaunchConf[]): void {
    missingConfigurations.forEach(missingConf => {
      this.parsedLaunchConf.configurations.push(missingConf);
    });
  }

  private getMissingConfigurations(): LaunchConf[] {
    return this.foundStacks.reduce(
      (prevMissingConfig, foundStack: Constructor<Stack>, i) => {
        const configsToAddStackName = Object.values(configs).find(obj => {
          return obj.stack === foundStack;
        });

        let configsToAdd;

        if (configsToAddStackName !== undefined) {
          configsToAdd = configsToAddStackName.confs.filter(configToAdd => {
            return !this.existingConfigs.some(existingConfig => {
              return configToAdd.type === existingConfig.type;
            });
          });
          return [...prevMissingConfig, ...configsToAdd];
        }

        return [...prevMissingConfig];
      },
      [],
    );
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
