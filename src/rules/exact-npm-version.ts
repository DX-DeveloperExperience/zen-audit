import { FileNotFoundError } from './../errors/FileNotFoundError';
import { RuleRegister } from './rule-register';
import * as fs from 'fs';
import { FileNotReadableError } from '../errors/FileNotReadableError';

/**
 * This implementation of Rule modifies Semver in npm's package.json and removes tilds and circumflex
 * accent in Semver of every dependency.
 */
@RuleRegister.register
export class ExactNpmVersion {
  readonly requiredFiles: string[] = ['package.json'];
  readonly rootPath: string;
  private packageJSONPath: string;
  private parsedFile: any;
  // tslint:disable-next-line: max-line-length
  readonly semverRegex = /^(\^|\~)((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/g;
  readonly jsonObjectsToCheck: string[] = [
    'dependencies',
    'devDependencies',
    'bundledDependencies',
    'optionalDependencies',
    'peerDependencies',
  ];

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;

    this.packageJSONPath = `${this.rootPath}package.json`;

    try {
      this.parsedFile = JSON.parse(
        fs.readFileSync(this.packageJSONPath, {
          encoding: 'utf8',
        }),
      );
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new FileNotFoundError(this.packageJSONPath);
      } else if (err.code === 'EACCESS') {
        throw new FileNotReadableError(this.packageJSONPath);
      }
    }
  }

  /**
   * Returns true if the project contains npm dependencies or devDependencies with semver that needs to be corrected.
   */
  shouldBeApplied() {
    this.jsonObjectsToCheck.map(jsonObjStr => {
      const jsonObj = this.parsedFile[jsonObjStr];

      if (jsonObj !== undefined) {
        const jsonObjValues: string[] = Object.values(jsonObj);

        if (this.valuesMatches(jsonObjValues, this.semverRegex)) {
          return true;
        }
      }
    });
    return false;
  }

  /**
   * This method returns true if any string in the provided array of values matches the regexp.
   * @param values An array of string containing the values to match the regexp
   * @param regex A RegExp that will try to match with values
   */
  valuesMatches(values: string[], regex: RegExp) {
    values.map((val: string) => {
      if (val.match(regex)) {
        return true;
      }
    });
    return false;
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
  correctSemverNotation(): string {
    const depEntries: string[][] = Object.entries(this.parsedFile.dependencies);
    const devDepEntries: string[][] = Object.entries(
      this.parsedFile.devDependencies,
    );

    this.parsedFile.dependencies = this.replaceMatchingEntries(
      depEntries,
      this.semverRegex,
    );
    this.parsedFile.devDependencies = this.replaceMatchingEntries(
      devDepEntries,
      this.semverRegex,
    );

    return JSON.stringify(this.parsedFile);
  }

  replaceMatchingEntries(entries: string[][], regex: RegExp) {
    const changedEntries = entries.map(([dep, val]) => {
      if (val.match(this.semverRegex)) {
        return [
          dep,
          val.replace(this.semverRegex, (_A: string, b: string, c: string) => {
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

  /**
   * Returns the name of this rule.
   */
  name() {
    return 'Exact npm version';
  }

  description() {
    return 'Strict version: in order to avoid breaking changes, you should use a strict version for your dependencies.';
  }
}
