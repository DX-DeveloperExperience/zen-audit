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
    const fileStat = fs.lstatSync(path);
    if (fileStat.isFile() || fileStat.isSymbolicLink()) {
      return path.endsWith(fileName);
    } else {
      fs.readdirSync(path).forEach(subPath => {
        if (
          this.findFileRecursively(
            `${path.replace(/\/$/, '')}/${subPath}`,
            fileName,
          )
        ) {
          found = true;
        }
      });
    }
    return found;
  }
}
