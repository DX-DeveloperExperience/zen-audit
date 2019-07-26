import Rule from '../../rules/rule';
import inquirer = require('inquirer');

export async function promptForRule(rule: Rule) {
  if (rule.shouldBeApplied()) {
    inquirer
      .prompt([
        {
          name: rule.getName(),
          message: rule.getShortDescription(),
          type: rule.getPromptType(),
          choices: await rule.getChoices(),
        },
      ])
      .then(answer => {
        const apply = rule.apply;

        if (apply) {
          apply.call(rule, answer);
        }
      });
  }
}
