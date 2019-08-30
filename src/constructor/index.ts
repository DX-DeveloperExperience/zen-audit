/**
 * The representation of a Constructor, used for the registration decorators.
 * @ignore
 */
export default interface Constructor<T> {
  new (...args: any[]): T;
  readonly prototype: T;
}
