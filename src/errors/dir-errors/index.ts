/**
 * A custom Error used for directory errors, will check error code and return an Error with an appropriate message.
 */
export class DirError extends Error {
  /**
   * @param err The original error
   * @param filePath The path to the folder
   * @param className The class' name where the original error was thrown
   * @param defaultMessage The default message to show if the error code is something else than ENOENT or ENOTDIR
   */
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
