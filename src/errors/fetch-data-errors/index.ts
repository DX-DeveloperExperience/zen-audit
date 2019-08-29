/**
 * A custom Error used for remote data fetching errors.
 */
export class FetchDataError extends Error {
  /**
   *
   * @param err The original error
   * @param url The url to which the data is fetched
   * @param className The class' name where the original error was thrown
   */
  constructor(err: NodeJS.ErrnoException, url: string, className: string) {
    super(`${className}: Error fetching data from url: ${url}`);
    this.stack = err.stack;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
