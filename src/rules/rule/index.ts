import Choice from '../../choice';
/**
 * The interface that defines a Rule like NodeVersion, TSLint, GitIgnore..
 */
export default interface Rule {
  /**
   * Tells if the project contains what is necessary to apply this rule.
   */
  shouldBeApplied(): Promise<boolean>;
  /**
   * Add what is necessary to the project so the rule is applied.
   * Takes a boolean or an array of string to tell if the rule has to be applied,
   * or the choices to apply if the user has multiple choices to apply.
   */
  apply?: (answers: boolean | string[]) => Promise<void>;
  getName(): string;
  getShortDescription(): string;
  getLongDescription(): string;
  /**
   * Gives the prompt type as a string. Please refer to Inquirer documentation to know which
   * prompt types exists. For Yes|No or confirmation, use "list" as prompt type,
   * and use the "YesNo" or "Ok" types in getChoices() method.
   */
  getPromptType(): string;
  /**
   * Returns a list of Choices for the user to chose. For Yes|No question, use native YesNo type,
   * for just a confirmation, use Ok type.
   */
  getChoices(): Choice[] | Promise<Choice[]>;
}
