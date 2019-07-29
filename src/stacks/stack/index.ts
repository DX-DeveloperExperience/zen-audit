export default interface Stack {
  /**
   * Tells if the project contains what is necessary to be sure the stack is present.
   */
  isAvailable(): Promise<boolean>;
  /**
   * Gives some additional data about the detected stack.
   */
  getInformations?: () => string[];
  name(): string;
}
