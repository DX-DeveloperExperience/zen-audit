export class FileNotReadableError extends Error {
  constructor(filename: string) {
    super('File ' + filename + ' exists, but cannot be read.');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
