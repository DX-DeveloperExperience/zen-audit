export class FileNotFoundError extends Error {
  constructor(filepath: string) {
    super('File not found: ' + filepath);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
