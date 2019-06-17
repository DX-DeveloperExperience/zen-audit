import Choice from '../../choice';
/**
 * The interface that defines a Rule like NodeVersion, TSLint, GitIgnore..
 */
export default interface Rule {
  shouldBeApplied(): Promise<boolean>;
  apply?: (answers: boolean | string[]) => Promise<void>;
  getName(): string;
  getShortDescription(): string;
  getPromptType(): string;
  getChoices(): Choice[] | Promise<Choice[]>;
}
