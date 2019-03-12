import * as fs from 'fs';

/**
 * A tool class to check whether one or multiple files exist or not
 */
export default class FileUtils {
  /**
   * A function to check whether a file exists
   * @param filePath The file to check the existence of
   */
  static fileExists(filePath: string): boolean {
    try {
      fs.accessSync(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * A function to check whether multiple files exist
   * @param filesPaths An array of files to check the existence of
   */
  static filesExist(filesPaths: string[]): boolean {
    filesPaths.forEach(filePath => {
      try {
        fs.accessSync(filePath);
      } catch (error) {
        return false;
      }
    });
    return true;
  }
}
