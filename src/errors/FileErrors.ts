class FileError extends Error {
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
