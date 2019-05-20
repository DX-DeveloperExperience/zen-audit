import { RuleRegister } from '../rule-register';
import * as fs from 'fs';
import { FileNotReadableError } from '../../errors/FileNotReadableError';
import { StackRegister } from '../../stacks/stack-register';
import { jsonObjectsToCheck } from './constants';
import Choice, { YesNo } from '../../choice';

/**
 * This implementation of Rule modifies Semver in npm's package.json and removes tilds and circumflex
 * accent in Semver of every dependency.
 */
@RuleRegister.register
@StackRegister.registerRuleForAll()
export class ExactNpmVersion {
  readonly requiredFiles: string[] = ['package.json'];
  readonly rootPath: string;
  private packageJSONPath: string;
  private packageFileExists: boolean;
  private parsedFile: any;
  readonly semverRegex = new RegExp(
    '^(\\^|\\~)((([0-9]+)\\.([0-9]+)\\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?)(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?)$',
    'g',
  );
  private jsonObjToCheckFound: string[] = [];

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
    this.packageJSONPath = `${this.rootPath}package.json`;

    try {
      this.parsedFile = JSON.parse(
        fs.readFileSync(this.packageJSONPath, {
          encoding: 'utf8',
        }),
      );
      this.packageFileExists = true;
      this.jsonObjToCheckFound = this.findJsonObjectsToCheck();
    } catch (err) {
      if (err.code === 'ENOENT') {
        this.packageFileExists = false;
      } else {
        throw new FileNotReadableError(this.packageJSONPath);
      }
    }
  }

  /**
   * Returns true if the project contains npm dependencies or devDependencies with semver that needs to be corrected.
   */
  shouldBeApplied() {
    let result = false;
    if (!this.packageFileExists) {
      return false;
    }
    jsonObjectsToCheck.forEach(jsonObjStr => {
      const jsonObj = this.parsedFile[jsonObjStr];

      if (jsonObj !== undefined) {
        const jsonObjValues: string[] = Object.values(jsonObj);
        if (this.valuesMatches(jsonObjValues, this.semverRegex)) {
          result = true;
        }
      }
    });
    return result;
  }

  /**
   * This method returns true if any string in the provided array of values matches the regexp.
   * @param values An array of string containing the values to match the regexp
   * @param regex A RegExp that will try to match with values
   */
  private valuesMatches(values: string[], regex: RegExp): boolean {
    return values.some(val => !!val.match(regex));
  }

  /**
   * Removes tilds or circumflex inside package.json's dependencies' Semvers
   */
  apply() {
    fs.writeFileSync(this.packageJSONPath, this.correctSemverNotation(), {
      encoding: 'utf8',
    });
  }

  /**
   * The replacement function that returns the semver without the tild or circumflex accents
   */
  private correctSemverNotation(): string {
    this.jsonObjToCheckFound.forEach(jsonObjName => {
      this.parsedFile[jsonObjName] = this.replaceMatchingEntriesForObj(
        jsonObjName,
        this.semverRegex,
      );
    });
    return JSON.stringify(this.parsedFile, null, '\t');
  }

  /**
   * The replacement occurs in this object's parsedFile json object.
   * @param jsonObjName
   * @param regex
   */
  private replaceMatchingEntriesForObj(jsonObjName: string, regex: RegExp) {
    const entries: string[][] = Object.entries(this.parsedFile[jsonObjName]);
    const changedEntries = entries.map(([dep, val]) => {
      if (val.match(regex)) {
        return [
          dep,
          val.replace(regex, (_A: string, _B: string, c: string) => {
            return c;
          }),
        ];
      }
      return [dep, val];
    });

    const result = changedEntries.reduce((acc, current) => {
      return {
        ...acc,
        [current[0]]: current[1],
      };
    }, {});
    return result;
  }

  private findJsonObjectsToCheck() {
    return jsonObjectsToCheck.filter(val => {
      return Object.keys(this.parsedFile).includes(val);
    });
  }

  /**
   * Returns the name of this rule.
   */
  getName() {
    return 'Exact npm version';
  }

  getDescription() {
    return `Strict version: in order to avoid breaking changes when running "npm install", \
    you should use a strict version for your dependencies. Would you like to do so ?`;
  }

  getPromptType() {
    return 'list';
  }

  getChoices() {
    return YesNo;
  }
}
