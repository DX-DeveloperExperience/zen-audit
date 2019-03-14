export class FileNotFoundError extends Error {
  constructor(filename?: string) {
    super('File not found: ' + filename);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
