import Rule from '../../rules/rule';
import inquirer = require('inquirer');
import { logger } from '../../logger';
import { RuleRegister } from '../../rules/rule-register';
import { Subject } from 'rxjs';
const rx = require('rxjs');

// export const ui = new inquirer.ui.BottomBar();

/* export async function promptForRule(rule: Rule): Promise<void> {
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
} */

function addRulesToPrompts(prompts: Subject<any>, rules: Rule[]) {
  rules.forEach(async rule => {
    prompts.next({
      name: rule.constructor.name,
      message: rule.getShortDescription(),
      type: rule.getPromptType(),
      choices: await rule.getChoices(),
      filter: (input: any) => {
        return { input, rule };
      },
    });
  });
}

export async function promptForRules(rules: Rule[]): Promise<void> {
  const prompts = new rx.Subject();

  addRulesToPrompts(prompts, rules);

  inquirer.prompt(prompts).ui.process.subscribe((output: any) => {
    const rule: Rule = output.answer.rule;
    const apply = output.answer.rule.apply;
    const ruleAnswer = output.answer.input;

    if (apply) {
      apply.call(rule, ruleAnswer).then(() => {
        const subRules = RuleRegister.getSubRulesOf(rule);

        if (subRules.length !== 0) {
          addRulesToPrompts(prompts, subRules);
        }
      });
    }
  });

  /* const promptsProm = rules.map(async rule => {
    return {
      name: rule.constructor.name,
      message: rule.getShortDescription(),
      type: rule.getPromptType(),
      choices: await rule.getChoices(),
      when: () => {},
    } as inquirer.Question;
  });

  const prompts = await Promise.all(promptsProm); */

  /* const answers: {} = await inquirer.prompt(prompts);

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
  }); */
}
