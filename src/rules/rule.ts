/**
 * The interface that defines a Rule like NodeJS, TS Lint..
 */
export default interface Rule {
  /**
   * An array containing all the required files of the Rule.
   */
  readonly requiredFiles: string[];
  /**
   * Returns true if the rule exists at the root of the project.
   */
  exists(): boolean;
  /**
   * Returns the name of the Rule.
   */
  getName(): string;
  /**
   * A function that applies the recommendations.
   */
  apply(): void;
}
