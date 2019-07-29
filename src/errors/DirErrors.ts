export class DirError extends Error {
  constructor(
    err: NodeJS.ErrnoException,
    filePath: string,
    className: string,
    defaultMessage: string = 'Error trying to access directory',
  ) {
    if (err.code === 'ENOENT') {
      super(`${className}: Directory not found: ${filePath}`);
    } else if (err.code === 'ENOTDIR') {
      super(`${className}: Given path is not a directory: ${filePath}`);
    } else {
      super(`${className}: ${defaultMessage}: ${filePath}`);
    }
    this.stack = err.stack;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
