import Choice from '../../choice';

/**
 * The interface that defines a Rule like NodeVersion, TSLint, GitIgnore..
 */
export default interface Rule {
  shouldBeApplied(): boolean;
  apply?: (choices: Choice[]) => void;
  getName(): string;
  getDescription(): string;
  getPromptType?: () => string;
  getChoices?: () => object[];
}
