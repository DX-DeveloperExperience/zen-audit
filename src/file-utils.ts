import * as fs from 'fs';

/**
 * A tool class to check whether one or multiple files exist or not
 */
export default class FileUtils {
  static findFilesRecursively(path: string, fileName: string): boolean {
    let found = false;
    if (fs.lstatSync(path).isFile()) {
      if (path.endsWith(fileName)) {
        return true;
      } else {
        return false;
      }
    } else {
      fs.readdirSync(path).forEach(subPath => {
        if (this.findFilesRecursively(`${path}/${subPath}`, fileName)) {
          found = true;
        }
      });
    }
    return found;
  }
}
