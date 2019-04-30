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
  getName(): string;
  /**
   * Returns a description of the rule
   */
  getDescription(): string;
  getPromptType(): string;
  getChoices(): object[];
}
