import Stack from './stack';
import { StackRegister } from '../tests/stacks/stack-register';
import * as fs from 'fs';
import FileUtils from '../file-utils';
/**
 * NodeJS implementation of stack interface. This class checks if the given path
 * is a project using node.
 */
@StackRegister.register
export default class NodeJS {
  readonly requiredFiles: string[] = ['./package-lock.json', './package.json'];
  files: number[] = [];
  errors: string[] = [];

  /**
   * Returns true if the project contains the NodeJS stack.
   */
  exists() {
    return FileUtils.filesExist(this.requiredFiles);
  }

  /**
   * Apply recommendations for NodeJS projects. Here, it just removes tild or circumflex
   * for semver.
   */
  apply() {
    this.requiredFiles.forEach(file => {
      let fileToStr = fs.readFileSync(file, { encoding: 'utf8' });

      fileToStr = fileToStr.replace(
        /(\^|\~?)(([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/g,
        this.removeTildOrCircumflex,
      );

      fs.writeFileSync(file, fileToStr, {
        encoding: 'utf8',
      });
    });
  }

  /**
   * The replacement function that returns the semver without the tild or circumflex accents
   * @param corresponding The string that corresponds to the Regex
   * @param p1 The first string of sub-corresponding Regex
   * @param p2 The second string of sub-corresponding Regex
   */
  removeTildOrCircumflex(corresponding: string, p1: string, p2: string) {
    return p2;
  }

  /**
   * Returns the name of this stack. Here, it returns NodeJS
   */
  getName() {
    return 'NodeJS';
  }
}
