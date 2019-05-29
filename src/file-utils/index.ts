import * as fs from 'fs-extra';

/**
 * A tool class to check whether one or multiple files exist or not
 */
export function filesExistIn(path: string, fileNames: string[]): boolean {
  let found = false;
  fileNames.forEach(fileName => {
    found = findFileRecursively(path, fileName);
  });

  return found;
}

export function findFileRecursively(path: string, fileName: string): boolean {
  let found = false;
  const fileStat = fs.lstatSync(path);
  if (fileStat.isFile() || fileStat.isSymbolicLink()) {
    return path.endsWith(fileName);
  } else {
    fs.readdirSync(path).forEach(subPath => {
      if (
        findFileRecursively(`${path.replace(/\/$/, '')}/${subPath}`, fileName)
      ) {
        found = true;
      }
    });
  }
  return found;
}

export function deleteRecursively(path: string): void {
  const fileStat = fs.lstatSync(path);
  if (fileStat.isFile() || fileStat.isSymbolicLink()) {
    fs.unlinkSync(path);
  } else if (fileStat.isDirectory()) {
    fs.readdirSync(path).forEach(subPath => {
      deleteRecursively(`${path}/${subPath}`);
    });

    fs.rmdirSync(path);
  }
}

export function existsPaths(...paths: string[]): Promise<boolean> {
  return Promise.all(paths.map(path => fs.pathExists(path)))
    .then(exist => {
      return exist.includes(true);
    })
    .catch(e => false);
}
