import { RuleRegister } from '../rule-register';
import { StackRegister } from '../../stacks/stack-register';
import { ListStacks } from '../../stacks/list-stacks';
import { possibleChoices } from './constants';
import * as fs from 'fs-extra';
import * as cp from 'child_process';
import Elasticsearch from '../../stacks/elasticsearch';
import Choice from '../../choice';
import { JSONhasObj } from '../../utils/json/index';
import Globals from '../../utils/globals';

@RuleRegister.register
@StackRegister.registerRuleForAll({ excludes: [Elasticsearch] })
export class VSCodeExtensions {
  readonly requiredFiles: string[] = ['.vscode/extensions.json'];
  private extensionsJSONPath: string;
  private parsedExtensionsFile: any;
  private extensionsFileExists: boolean;
  private missingExtensions: Choice[] = [];
  private initialized: boolean = false;

  constructor() {
    this.extensionsJSONPath = `${Globals.rootPath}.vscode/extensions.json`;

    try {
      this.parsedExtensionsFile = require(this.extensionsJSONPath);
      this.extensionsFileExists = true;
    } catch (e) {
      this.parsedExtensionsFile = {
        recommendations: [],
      };
      this.extensionsFileExists = false;
    }
  }

  async init() {
    if (!this.initialized) {
      return this.getMissingExtensions().then(result => {
        this.initialized = true;
        this.missingExtensions = result;
      });
    }
  }

  async shouldBeApplied() {
    return this.init().then(() => {
      return (
        this.missingExtensions.length !== 0 &&
        (this.dotVSCodeExists() ||
          (!this.extensionsFileExists && this.codeIsInPath()) ||
          (this.extensionsFileExists && !this.hasRecommendations()))
      );
    });
  }

  private dotVSCodeExists(): boolean {
    let fileStat;
    try {
      fileStat = fs.lstatSync(`${Globals.rootPath}.vscode`);
      return fileStat.isDirectory();
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

  apply(answers: string[]) {
    return this.init().then(() => {
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

  getPromptType() {
    return 'checkbox';
  }

  private getMissingExtensions(): Promise<Choice[]> {
    const stackNamesPromise = ListStacks.getAvailableStacksIn(
      Globals.rootPath,
    ).then(stacks =>
      stacks.map(stack => {
        return stack.name();
      }),
    );

    return stackNamesPromise.then(stackNames => {
      const existingRecommendations: string[] = this.parsedExtensionsFile
        .recommendations;

      let result = stackNames.reduce(
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

      // remove duplicates
      result = result.filter((val, i) => {
        return (
          result.findIndex(choice => {
            return choice.value === val.value;
          }) === i
        );
      });

      return result;
    });
  }

  getChoices(): Promise<Choice[]> {
    return this.getMissingExtensions();
  }

  getName() {
    return 'VSCodeExtensions';
  }

  getShortDescription() {
    return 'This rule will add extension suggestions to your Visual Studio Code app.';
  }

  getLongDescription() {
    return 'Laborum exercitation incididunt nulla veniam labore esse. Pariatur adipisicing sint aliqua adipisicing culpa consequat reprehenderit excepteur eiusmod. Est irure voluptate fugiat enim minim laborum. Magna anim eiusmod consectetur voluptate. Proident ad ex laborum in adipisicing sit minim aliquip duis. Do non voluptate mollit officia consequat proident ex mollit dolore qui esse sit reprehenderit.';
  }
}
