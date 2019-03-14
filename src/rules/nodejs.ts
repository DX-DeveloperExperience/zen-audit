import { RuleRegister } from './rule-register';
import * as fs from 'fs';
import FileUtils from '../file-utils';

/**
 * This implementation of Rule modifies Semver in npm's package.json and removes tilds and circumflex
 * accent in Semver of every dependency.
 */
@RuleRegister.register
export default class NodeJS {
  readonly requiredFiles: string[] = ['package-lock.json', 'package.json'];
  rootPath: string;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
  }

  /**
   * Returns true if the project contains npm dependencies with semver that needs to be corrected.
   */
  exists() {
    return FileUtils.filesExistIn(this.rootPath, this.requiredFiles);
  }

  /**
   * Removes tilds or circumflex inside package.json's dependencies' Semvers
   */
  apply() {
    const file = 'package.json';
    try {
      let fileToStr = fs.readFileSync(file, { encoding: 'utf8' });
      fileToStr = fileToStr.replace(
        /(\^|\~?)(([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/g,
        this.correctSemverNotation,
      );

      fs.writeFileSync(file, fileToStr, {
        encoding: 'utf8',
      });
    } catch (err) {
      throw new Error('File ' + file + ' not found.');
    }
  }

  /**
   * The replacement function that returns the semver without the tild or circumflex accents
   * @param corresponding The string that corresponds to the Regex
   * @param p1 The first string of sub-corresponding Regex
   * @param p2 The second string of sub-corresponding Regex
   */
  correctSemverNotation(corresponding: string, p1: string, p2: string) {
    return p2;
  }

  /**
   * Returns the name of this rule.
   */
  getName() {
    return 'NodeJS';
  }
}
