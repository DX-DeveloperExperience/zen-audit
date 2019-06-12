import { RuleRegister } from '../rule-register';
import { StackRegister } from '../../stacks/stack-register';
import { ListStacks } from '../../stacks/list-stacks';
import { possibleChoices } from './constants';
import * as fs from 'fs-extra';
import * as cp from 'child_process';
import Elasticsearch from '../../stacks/elasticsearch';
import Choice from '../../choice';
import { JSONhasObj } from '../rules-utils/index';

@RuleRegister.register
@StackRegister.registerRuleForAll({ excludes: [Elasticsearch] })
export class VSCodeExtensions {
  readonly requiredFiles: string[] = ['.vscode/extensions.json'];
  readonly rootPath: string;
  private extensionsJSONPath: string;
  private parsedExtensionsFile: any;
  private extensionsFileExists: boolean;
  private missingRecommendations: string[] = [];
  private initialized: boolean = false;

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
    this.extensionsJSONPath = `${this.rootPath}.vscode/extensions.json`;

    try {
      this.parsedExtensionsFile = require(this.extensionsJSONPath);
      this.extensionsFileExists = true;
    } catch (e) {
      this.extensionsFileExists = false;
    }
  }

  async init() {
    if (!this.initialized) {
      return this.getMissingRecommendations().then(() => {
        this.initialized = true;
      });
    }
  }

  async shouldBeApplied() {
    return this.init().then(() => {
      return (
        (this.dotVSCodeExists() && !this.extensionsFileExists) ||
        (this.extensionsFileExists && !this.hasRecommendations()) ||
        (!this.extensionsFileExists && this.codeIsInPath()) ||
        this.missingRecommendations.length !== 0
      );
    });
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
      this.extensionsFileExists &&
      JSONhasObj(this.extensionsJSONPath, 'recommendations') &&
      Array.isArray(this.parsedExtensionsFile.recommendations) &&
      this.parsedExtensionsFile.recommendations.length !== 0
    );
  }

  private getMissingRecommendations(): Promise<string[]> {
    return this.getExtensionsList().then(extensionsList => {
      if (!this.hasRecommendations()) {
        this.missingRecommendations = extensionsList;
      } else {
        this.missingRecommendations = extensionsList.filter(extension => {
          return !this.parsedExtensionsFile.recommendations.includes(extension);
        });
      }

      return this.missingRecommendations;
    });
  }

  apply(answers: string[]) {
    return this.init().then(() => {
      if (this.parsedExtensionsFile === undefined) {
        this.parsedExtensionsFile = {
          recommendations: [],
        };
      }

      const filteredAnswers = answers.filter(recommendation => {
        return !this.parsedExtensionsFile.recommendations.includes(
          recommendation,
        );
      });

      this.parsedExtensionsFile.recommendations = this.parsedExtensionsFile.recommendations.concat(
        filteredAnswers,
      );

      return fs
        .ensureFile(this.extensionsJSONPath)
        .catch(err => {
          throw err;
        })
        .then(() => {
          return fs.writeJSON(
            this.extensionsJSONPath,
            this.parsedExtensionsFile,
            { spaces: '\t' },
          );
        });
    });
  }

  getName() {
    return 'VSCodeExtensions';
  }

  getDescription() {
    return 'This rule will add extension suggestions to your Visual Studio Code app.';
  }

  getPromptType() {
    return 'checkbox';
  }

  getExtensionsList(): Promise<string[]> {
    return this.getChoices().then((choices: Choice[]) => {
      return choices.map(choice => choice.value as string);
    });
  }

  getChoices(): Promise<Choice[]> {
    const stackNamesPromise = ListStacks.getAvailableStacksIn(
      this.rootPath,
    ).then(stacks =>
      stacks.map(stack => {
        return stack.name();
      }),
    );

    return stackNamesPromise.then(stackNames => {
      let existingRecommendations: string[] = [];
      if (this.parsedExtensionsFile !== undefined) {
        existingRecommendations = this.parsedExtensionsFile.recommendations;
      }

      return stackNames.reduce(
        (keptChoices, stackName) => {
          let choicesByStack: Choice[];

          if (possibleChoices[stackName] !== undefined) {
            // If some recommendations are existing...
            if (
              existingRecommendations !== undefined &&
              existingRecommendations.length !== 0
            ) {
              // ...do not add choices that are included in these recommendations
              choicesByStack = possibleChoices[stackName].reduce(
                (kept, curr) => {
                  if (!existingRecommendations.includes(curr.value as string)) {
                    return [...kept, curr];
                  }
                  return [...kept];
                },
                [] as Choice[],
              );
            } else {
              choicesByStack = possibleChoices[stackName];
            }
            if (choicesByStack !== undefined) {
              return [...keptChoices, ...choicesByStack];
            }
          }

          return [...keptChoices];
        },
        [] as Choice[],
      );
    });
  }
}
