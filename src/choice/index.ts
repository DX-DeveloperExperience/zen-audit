/**
 * The Choice interface defines a Choice as it will be suggested to the user. It is used
 * in the getChoices() function in any Rule implementation. Usually the getChoices()
 * function returns an array of Choice.
 */
export default interface Choice {
  /**
   * The string that will be shown in the terminal as a choice.
   */
  name: string;
  /**
   * The value of the given choice. If it's a boolean,
   * the apply method will be called or not, depending on if it's true or false.
   * If it's a string, the string is passed to the apply.
   */
  value: string | boolean;
}

/**
 * The Yes|No Choice. If the user chose Yes, it returns true so the apply method is called.
 */
export const YesNo: Choice[] = [
  { name: 'Yes', value: true },
  { name: 'No', value: false },
];

/**
 * The Ok Choice. Always return true, it is used when you don't need to apply a rule for example.
 */
export const Ok: Choice[] = [{ name: 'Understood', value: true }];
