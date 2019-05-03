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
  getName(): string;
  getDescription(): string;
  getPromptType(): string;
  getChoices(): object[];
}
