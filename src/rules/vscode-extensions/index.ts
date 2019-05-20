import { RuleRegister } from '../rule-register';
import { StackRegister } from '../../stacks/stack-register';
import { ListStacks } from '../../stacks/list-stacks';
import Choice from '../../choice';
import * as fs from 'fs';
import * as cp from 'child_process';
import { choices } from './constants';

@RuleRegister.register
@StackRegister.registerRuleForAll({ excludes: [] })
export class VSCodeExtensions {
  readonly requiredFiles: string[] = ['.vscode/extensions.json'];
  readonly rootPath: string;
  private extensionsJSON: string;
  private parsedExtensionsFile: any;
  private extensionsFileExists: boolean;
  private missingRecommendations: string[] = [];

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
    this.extensionsJSON = `${this.rootPath}.vscode/extensions.json`;

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
    return (
      (this.dotVSCodeExists() && !this.extensionsFileExists) ||
      (this.extensionsFileExists && !this.hasRecommendations()) ||
      (!this.extensionsFileExists && this.codeIsInPath()) ||
      this.getMissingRecommendations().length !== 0
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

  private getMissingRecommendations(): string[] {
    if (this.missingRecommendations.length === 0) {
      this.getExtensionsList().forEach(choice => {
        if (!this.parsedExtensionsFile.recommendations.includes(choice)) {
          this.missingRecommendations.push(choice);
        }
      });
    }

    return this.missingRecommendations;
  }

  apply(answers: string[]) {
    if (this.parsedExtensionsFile === undefined) {
      this.parsedExtensionsFile = {
        recommendations: [],
      };
    }

    answers.forEach(mr => {
      this.parsedExtensionsFile.recommendations.push(mr);
    });

    // Create .vscode directory if it does not exist
    if (!fs.existsSync(`${this.rootPath}/.vscode`)) {
      try {
        fs.mkdirSync(`${this.rootPath}/.vscode`);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      fs.writeFileSync(
        `${this.rootPath}/.vscode/extensions.json`,
        JSON.stringify(this.parsedExtensionsFile, null, '\t'),
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

  getExtensionsList(): string[] {
    return this.getChoices().map(choice => choice.value as string);
  }

  getChoices(): Choice[] {
    const stacks = ListStacks.getStacksIn(this.rootPath);

    return stacks.reduce(
      (keptChoices, stack) => {
        const choicesByStack: Choice[] = choices[stack.name()];
        if (choicesByStack !== undefined) {
          return [...keptChoices, ...choicesByStack];
        }

        return [...keptChoices];
      },
      [...choices.default],
    );
  }
}
