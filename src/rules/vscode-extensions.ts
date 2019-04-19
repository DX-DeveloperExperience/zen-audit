import { RuleRegister } from './rule-register';
import * as fs from 'fs';
import { StackRegister, Constructor } from '../stacks/stack-register';
import { Angular } from '../stacks/angular';
import { VueJS } from '../stacks/vue-js';
import { ListStacks } from '../stacks/list-stacks';
import Choice from '../choice';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Angular, VueJS])
export class VSCodeExtensions {
  readonly requiredFiles: string[] = ['.vscode/extensions.json'];
  readonly rootPath: string;
  private extensionsJSON: string;
  private parsedExtensionsFile: any;
  private extensionsFileExists: boolean;
  private choices: Choice[];

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
    this.extensionsJSON = `${this.rootPath}.vscode/extensions.json`;
    this.choices = [{ name: 'GitLens', value: 'eamodio.gitlens' }];

    try {
      this.parsedExtensionsFile = JSON.parse(
        fs.readFileSync(this.extensionsJSON, {
          encoding: 'utf8',
        }),
      );

      this.extensionsFileExists = true;
    } catch (err) {
      this.extensionsFileExists = false;
    }
  }

  shouldBeApplied() {
    return !(this.extensionsFileExists && this.hasRecommendations());
  }

  hasRecommendations() {
    return (
      this.parsedExtensionsFile.recommendations !== undefined &&
      Array.isArray(this.parsedExtensionsFile.recommendations) &&
      this.parsedExtensionsFile.recommendations.length !== 0
    );
  }

  apply() {
    const extensionsList = this.choices.reduce(
      (prev, curr) => {
        return [...prev, ...curr.value];
      },
      [''],
    );

    const extensionsJson = {
      recommendations: extensionsList,
    };

    try {
      fs.writeFileSync(
        `${this.rootPath}/.vscode/extensions.json`,
        extensionsJson,
        { encoding: 'utf8' },
      );
    } catch (err) {
      //
    }
  }

  getName() {
    return 'VSCode extensions.json';
  }

  getDescription() {
    return 'This rule will add extension suggestions to your Visual Studio Code app. Please check the extensions you would like to install:';
  }

  getPromptType() {
    return 'checkbox';
  }

  getChoices() {
    const foundStacks = ListStacks.findStacksIn(this.rootPath);
    if (foundStacks.includes(Angular.prototype)) {
      this.choices.push(
        { name: 'Angular Language Service', value: 'angular.ng-template' },
        { name: 'TSLint', value: 'ms-vscode.vscode-typescript-tslint-plugin' },
        { name: 'Angular Console', value: 'nrwl.angular-console' },
        { name: 'Prettier', value: 'esbenp.prettier-vscode' },
      );
    } else if (foundStacks.includes(VueJS.prototype)) {
      this.choices.push(
        { name: 'Vetur', value: 'octref.vetur' },
        { name: 'ESLint', value: 'dbaeumer.vscode-eslint' },
        { name: 'Prettier', value: 'esbenp.prettier-vscode' },
      );
    }

    return this.choices;
  }
}
