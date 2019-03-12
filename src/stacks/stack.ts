/**
 * The interface that defines a programmatic Stack like NodeJS, tslint..
 */
export default interface Stack {
  /**
   * An array containing all the required files of the Stack.
   */
  readonly requiredFiles: string[];
  /**
   * Returns true if the stack exists at the root of the project.
   */
  exists(): boolean;
  /**
   * Returns the name of the Stack.
   */
  getName(): string;
  /**
   * A function that applies the recommendations.
   */
  apply(): void;
}
