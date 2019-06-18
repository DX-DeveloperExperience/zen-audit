import { RuleRegister } from '../rule-register';
import * as fs from 'fs-extra';
import { StackRegister } from '../../stacks/stack-register';
import { jsonObjectsToCheck } from './constants';
import { YesNo } from '../../choice';
import Node from '../../stacks/node/index';
import TypeScript from '../../stacks/typescript/index';
import { logger } from '../../logger';

/**
 * This implementation of Rule modifies Semver in npm's package.json and removes tilds and circumflex
 * accent in Semver of every dependency.
 */
@RuleRegister.register
@StackRegister.registerRuleForStacks([Node, TypeScript])
export class ExactNpmVersion {
  readonly rootPath: string;
  private packageJSONPath: string;
  private parsedPackageJSON: any;
  readonly semverRegex = new RegExp(
    '^(\\^|\\~)((([0-9]+)\\.([0-9]+)\\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?)(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?)$',
    'g',
  );
  private jsonObjToCheckFound: string[] = [];

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
    this.packageJSONPath = `${this.rootPath}package.json`;
    this.parsedPackageJSON = require(this.packageJSONPath);
    this.jsonObjToCheckFound = this.findJsonObjectsToCheck();
  }

  /**
   * Returns true if the project contains npm dependencies or devDependencies with semver that needs to be corrected.
   */
  async shouldBeApplied(): Promise<boolean> {
    let result = false;

    this.jsonObjToCheckFound.forEach(jsonObjStr => {
      const jsonObj = this.parsedPackageJSON[jsonObjStr];

      const jsonObjValues: string[] = Object.values(jsonObj);
      if (this.valuesMatches(jsonObjValues, this.semverRegex)) {
        result = true;
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
  async apply(apply: boolean) {
    if (apply) {
      return fs
        .writeFile(this.packageJSONPath, this.correctSemverNotation(), {
          encoding: 'utf8',
        })
        .then(() => {
          logger.info(
            'Succesfully updated package.json with exact semver notation',
          );
        })
        .catch(err => {
          logger.error('Could not write to package.json');
          logger.debug(err);
        });
    }
    return;
  }

  /**
   * The replacement function that returns the semver without the tild or circumflex accents
   */
  private correctSemverNotation(): string {
    this.jsonObjToCheckFound.forEach(jsonObjName => {
      this.parsedPackageJSON[jsonObjName] = this.replaceMatchingEntriesForObj(
        jsonObjName,
        this.semverRegex,
      );
    });
    return JSON.stringify(this.parsedPackageJSON, null, '\t');
  }

  /**
   * The replacement occurs in this object's parsedFile json object.
   * @param jsonObjName
   * @param regex
   */
  private replaceMatchingEntriesForObj(jsonObjName: string, regex: RegExp) {
    const entries: string[][] = Object.entries(
      this.parsedPackageJSON[jsonObjName],
    );
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
      return Object.keys(this.parsedPackageJSON).includes(val);
    });
  }

  /**
   * Returns the name of this rule.
   */
  getName() {
    return 'Exact npm version';
  }

  getShortDescription() {
    return `Strict version: in order to avoid breaking changes when running "npm install", \
    you should use a strict version for your dependencies. Would you like to do so ?`;
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
