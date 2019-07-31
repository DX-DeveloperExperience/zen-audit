import Rule from '../../rules/rule';
import inquirer = require('inquirer');
import { logger } from '../../logger';
import { RuleRegister } from '../../rules/rule-register';

export async function promptForRule(rule: Rule): Promise<void> {
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
      .then(async answer => {
        const apply = rule.apply;

        if (apply) {
          await apply.call(rule, answer);
        }
      })
      .then(() => {
        logger.info(`Rule ${rule.getName()} applied succesfully`);

        const subRules = RuleRegister.getSubRulesOf(rule);
        if (subRules.length !== 0) {
          return promptForRules(subRules);
        }
      });
  }
}

export async function promptForRules(rules: Rule[]): Promise<void> {
  const promptsProm = rules.map(async rule => {
    return {
      name: rule.constructor.name,
      message: rule.getShortDescription(),
      type: rule.getPromptType(),
      choices: await rule.getChoices(),
    };
  });

  const prompts = await Promise.all(promptsProm);

  const answers: {} = await inquirer.prompt(prompts);

  Object.entries(answers).forEach(([_, answer], i) => {
    const apply = rules[i].apply;

    if (apply) {
      return apply.call(rules[i], answer).then(
        async () => {
          const subRules = RuleRegister.getSubRulesOf(rules[i]);
          if (subRules.length !== 0) {
            await promptForRules(subRules);
          }
        },
        err => {
          logger.error(err);
        },
      );
    }
  });
}
