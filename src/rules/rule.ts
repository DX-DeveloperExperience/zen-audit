/**
 * The interface that defines a Rule like NodeJS, TS Lint..
 */
export default interface Rule {
  /**
   * An array containing all the required files of the Rule.
   */
  readonly requiredFiles: string[];
  readonly rootPath: string;
  /**
   * Returns true if the rule should be applied.
   */
  shouldBeApplied(): boolean;
  /**
   * A function that applies the recommendations.
   */
  apply(): void;
  /**
   * Returns the name of the Rule.
   */
  name(): string;
  /**
   * Returns a description of the rule
   */
  description(): string;
}
