import * as fs from 'fs';

/**
 * A tool class to check whether one or multiple files exist or not
 */
export default class FileUtils {
  static filesExistIn(path: string, fileNames: string[]): boolean {
    let found = false;
    fileNames.forEach(fileName => {
      found = FileUtils.findFileRecursively(path, fileName);
    });

    return found;
  }

  static findFileRecursively(path: string, fileName: string): boolean {
    let found = false;
    if (fs.lstatSync(path).isFile()) {
      if (path.endsWith(fileName)) {
        return true;
      } else {
        return false;
      }
    } else {
      fs.readdirSync(path).forEach(subPath => {
        if (this.findFileRecursively(`${path}/${subPath}`, fileName)) {
          found = true;
        }
      });
    }
    return found;
  }
}
