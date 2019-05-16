import { RuleRegister } from '../rule-register';
import { StackRegister } from '../../stacks/stack-register';
import { Angular } from '../../stacks/angular';
import { VueJS } from '../../stacks/vue-js';
import { ListStacks } from '../../stacks/list-stacks';
import Choice from '../../choice';
import * as fs from 'fs';
import * as cp from 'child_process';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Angular, VueJS])
export class VSCodeExtensions {
  readonly requiredFiles: string[] = ['.vscode/extensions.json'];
  readonly rootPath: string;
  private extensionsJSON: string;
  private parsedExtensionsFile: any;
  private extensionsFileExists: boolean;
  private choices: Choice[] = [];

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
    this.extensionsJSON = `${this.rootPath}.vscode/extensions.json`;

    try {
      const parsedChoicesFile = JSON.parse(
        fs.readFileSync(`${__dirname}/choices.json`, {
          encoding: 'utf8',
        }),
      );
      this.setChoices(parsedChoicesFile);

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
    return (
      (this.dotVSCodeExists() && !this.extensionsFileExists) ||
      (this.extensionsFileExists && !this.hasRecommendations()) ||
      (!this.extensionsFileExists && this.codeIsInPath()) ||
      this.missRecommendations()
    );
  }

  private dotVSCodeExists(): boolean {
    let fileStat;
    try {
      fileStat = fs.lstatSync(`${this.rootPath}.vscode`);
      if (fileStat.isDirectory()) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  private codeIsInPath(): boolean {
    try {
      cp.execSync('code -v');
      return true;
    } catch (err) {
      return false;
    }
  }

  private hasRecommendations(): boolean {
    return (
      this.parsedExtensionsFile.recommendations !== undefined &&
      Array.isArray(this.parsedExtensionsFile.recommendations) &&
      this.parsedExtensionsFile.recommendations.length !== 0
    );
  }

  private missRecommendations(): boolean {
    this.getChoices().forEach(choice => {
      if (!this.parsedExtensionsFile.recommendations.includes(choice.value)) {
        return true;
      }
    });

    return false;
  }

  apply() {
    const extensionsList = this.choices.reduce(
      (prev, curr) => {
        return [...prev, ...curr.value];
      },
      [''],
    );

    const extensionsJson = JSON.stringify(
      {
        recommendations: extensionsList,
      },
      null,
      '\t',
    );

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

  private setChoices(parsedChoicesFile: any) {
    Array.prototype.push.apply(this.choices, parsedChoicesFile.default);

    const stacks = ListStacks.getStacksIn(this.rootPath);
    stacks.forEach(stack =>
      Array.prototype.push.apply(
        this.choices,
        parsedChoicesFile[stack.constructor.name],
      ),
    );
  }

  getChoices() {
    return this.choices;
  }
}
