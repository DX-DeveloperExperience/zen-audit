import Choice from '../../choice';
/**
 * The interface that defines a Rule like NodeVersion, TSLint, GitIgnore..
 */
export default interface Rule {
  /**
   * Resolves a promise to true if the audited project should apply this rule. For example,
   * if the rule is to add rules to the .gitignore file, if the existing .gitignore does not contains
   * all the rules, this method resolves to true.
   */
  shouldBeApplied(): Promise<boolean>;
  /**
   * Add what is necessary to the project so the rule should not be applied again.
   * Takes a boolean or an array of string to tell if the rule has to be applied,
   * or the choices to apply if the user has multiple choices to apply.
   */
  apply?: (answers: boolean | string[]) => Promise<void>;
  /**
   * Returns the name of the Rule as it will be seen in the prompt.
   */
  getName(): string;
  /**
   * Returns the description of the stack that will be seen before asking if the user wants to apply it.
   */
  getShortDescription(): string;
  /**
   * Returns a longer description that will appear in the generated Markdown/PDF report.
   */
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
