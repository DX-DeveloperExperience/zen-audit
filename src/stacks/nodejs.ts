import Stack from './stack';

export default class NodeJS implements Stack {
  readonly requiredFiles: string[] = ['package-lock.json', 'package.json'];

  existsInPaths(paths: string[]): boolean {
    if (paths.length === 0) {
      return false;
    }
    for (const path of paths) {
      for (const requiredFile of this.requiredFiles) {
        if (!path.includes(requiredFile)) {
          return false;
        }
      }
    }
    return true;
  }
}
