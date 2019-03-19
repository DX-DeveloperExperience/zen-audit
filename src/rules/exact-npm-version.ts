import { FileNotFoundError } from './../errors/FileNotFoundError';
import { RuleRegister } from './rule-register';
import * as fs from 'fs';
import { FileNotReadableError } from '../errors/FileNotReadableError';

/**
 * This implementation of Rule modifies Semver in npm's package.json and removes tilds and circumflex
 * accent in Semver of every dependency.
 */
@RuleRegister.register
export default class ExactNpmVersion {
  readonly requiredFiles: string[] = ['package-lock.json', 'package.json'];
  readonly rootPath: string;
  private packageJSON: string;
  private parsedFile: string = '';

  constructor(rootPath?: string) {
    if (rootPath === undefined) {
      this.rootPath = './';
    } else {
      this.rootPath = rootPath;
    }

    this.packageJSON = this.rootPath + 'package.json';

    try {
      this.parsedFile = fs.readFileSync(this.packageJSON, {
        encoding: 'utf8',
      });
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new FileNotFoundError(this.packageJSON);
      } else if (err.code === 'EACCESS') {
        throw new FileNotReadableError(this.packageJSON);
      }
    }
  }

  /**
   * Returns true if the project contains npm dependencies with semver that needs to be corrected.
   */
  exists() {
    // tslint:disable-next-line: max-line-length
    return (
      this.parsedFile.match(
        /^"(\^|\~)((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)",?$/,
      ) !== null
    );
  }

  /**
   * Removes tilds or circumflex inside package.json's dependencies' Semvers
   */
  apply() {
    const correctedParse = this.parsedFile.replace(
      /^"(\^|\~?)((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)",?$/g,
      this.correctSemverNotation,
    );

    fs.writeFileSync(this.packageJSON, correctedParse, {
      encoding: 'utf8',
    });
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
    return 'Exact npm version';
  }
}