import Choice, { YesNo } from './../../../../choice/index';
import { Website } from './../../../../stacks/website/index';
import { React } from './../../../../stacks/react/index';
import { RuleRegister } from '../../../rule-register';
import { StackRegister } from '../../../../stacks/stack-register';
import Angular from '../../../../stacks/angular';
import VueJS from '../../../../stacks/vue-js';
import Globals from '../../../../utils/globals';
import { IPackageJSON } from '../../../../utils/json/types/package';
import { pathExistsInJSON } from '../../../../utils/json';

@RuleRegister.register
@StackRegister.registerRuleForStacks([React, Angular, VueJS, Website])
export class LightHouse {
  private parsedPackage: IPackageJSON;
  private scripts: string[] | undefined;
  private hasDevdependency: boolean;

  constructor() {
    this.parsedPackage = require(Globals.packageJSONPath);
    this.hasDevdependency = pathExistsInJSON(this.parsedPackage, [
      'devDependencies',
      'lighthouse',
    ]);
    if (this.parsedPackage.scripts !== undefined) {
      this.scripts = Object.keys(this.parsedPackage.scripts);
    }
  }

  async shouldBeApplied(): Promise<boolean> {
    if (this.scripts !== undefined) {
      return !this.scripts.includes('lighthouse');
    }

    return true;
  }

  async apply(apply: boolean): Promise<void> {
    // TODO
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
