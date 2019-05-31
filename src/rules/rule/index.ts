import Choice from '../../choice';
/**
 * The interface that defines a Rule like NodeVersion, TSLint, GitIgnore..
 */
export default interface Rule {
  shouldBeApplied(): Promise<boolean>;
  apply?: (answers?: any) => Promise<void> | Promise<string>;
  getName(): string;
  getDescription(): string;
  getPromptType(): string;
  getChoices(): Choice[] | Promise<Choice[]>;
}
