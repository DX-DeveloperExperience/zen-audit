import Rule from '../../rules/rule';
import inquirer = require('inquirer');
import { logger } from '../../logger';

export async function promptForRule(rule: Rule) {
  if (rule.shouldBeApplied()) {
    return inquirer
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
          return apply.call(rule, answer);
        }
      })
      .then(() => {
        logger.info(`Rule ${rule.getName()} applied succesfully`);
      });
  }
}
