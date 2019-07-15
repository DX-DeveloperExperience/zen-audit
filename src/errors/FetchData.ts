export class FetchDataError extends Error {
  constructor(url: string, className: string) {
    super(`${className}: Error fetching data from url: ${url}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
