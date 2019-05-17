import Choice from '../../choice';

/**
 * The interface that defines a Rule like NodeVersion, TSLint, GitIgnore..
 */
export default interface Rule {
  shouldBeApplied(): boolean;
  apply?: (answers?: string[]) => void;
  getName(): string;
  getDescription(): string;
  getPromptType(): string;
  getChoices(): Choice[];
}
