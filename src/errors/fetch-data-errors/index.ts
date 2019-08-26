export class FetchDataError extends Error {
  constructor(err: NodeJS.ErrnoException, url: string, className: string) {
    super(`${className}: Error fetching data from url: ${url}`);
    this.stack = err.stack;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
