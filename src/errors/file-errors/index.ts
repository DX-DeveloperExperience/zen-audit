/**
 * Custom Errors for file handling.
 */
class FileError extends Error {
  /**
   * A custom Error used for file reading/writing errors.
   * @param err The original error.
   * @param filePath The path to the file.
   * @param className The class' name where the original error was thrown.
   * @param defaultMessage The default message to show if the error code is not handled.
   */
  constructor(
    err: NodeJS.ErrnoException,
    filePath: string,
    className: string,
    defaultMessage: string,
  ) {
    if (err.code === 'ENOENT') {
      super(`${className}: File not found: ${filePath}`);
    } else if (err.code === 'EACCES') {
      super(`${className}: Error trying to access file: ${filePath}`);
    } else if (err.code === 'EISDIR') {
      super(`${className}: Given path is a directory: ${filePath}`);
    } else {
      super(`${defaultMessage}`);
    }
    this.stack = err.stack;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ReadFileError extends FileError {
  /**
   * A custom Error used for file reading errors.
   * @param err The original error.
   * @param filePath The path to the file.
   * @param className The class' name where the original error was thrown.
   */
  constructor(err: NodeJS.ErrnoException, filePath: string, className: string) {
    super(
      err,
      filePath,
      className,
      `${className}: Error while reading file: ${filePath}`,
    );
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class WriteFileError extends FileError {
  /**
   * A custom Error used for file writing errors.
   * @param err The original error.
   * @param filePath The path to the file.
   * @param className The class' name where the original error was thrown.
   */
  constructor(err: NodeJS.ErrnoException, filePath: string, className: string) {
    super(
      err,
      filePath,
      className,
      `${className}: Error while writing to file: ${filePath}`,
    );
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class CreateFileError extends FileError {
  /**
   * A custom Error used for file creation errors.
   * @param err The original error.
   * @param filePath The path to the file.
   * @param className The class' name where the original error was thrown.
   */
  constructor(err: NodeJS.ErrnoException, filePath: string, className: string) {
    super(
      err,
      filePath,
      className,
      `${className}: Error while creating file: ${filePath}`,
    );
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
