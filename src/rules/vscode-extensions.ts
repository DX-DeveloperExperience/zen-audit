import { RuleRegister } from './rule-register';
import * as fs from 'fs';

@RuleRegister.register
export class VSCodeExtensions {
  readonly requiredFiles: string[] = ['.vscode/extensions.json'];
  readonly rootPath: string;
  private extensionsJSON: string;
  private parsedExtensionsFile: any;
  private extensionsFileExists: boolean;

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
    // TODO
  }

  getName() {
    return 'VSCode extensions.json';
  }

  getDescription() {
    return 'This rule will add extension suggestions to your Visual Studio Code app. Please check the extensions you would like to install:';
  }

  getPromptType() {
    return 'list';
  }
}
