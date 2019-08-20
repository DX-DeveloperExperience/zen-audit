import { cli } from 'cli-ux';
import Rule from '../../rules/rule';
import inquirer = require('inquirer');
// import { RuleRegister } from '../../rules/rule-register';
import { Subject } from 'rxjs';
import { Register } from '../../register';
import { logger } from '../../logger';
const rx = require('rxjs');

function addRulesToPrompts(prompts: Subject<any>, rules: Rule[]) {
  rules.forEach(async rule => {
    if (await rule.shouldBeApplied()) {
      prompts.next({
        name: rule.constructor.name,
        message: rule.getShortDescription(),
        type: rule.getPromptType(),
        choices: await rule.getChoices(),
        filter: (input: any) => {
          return { input, rule };
        },
      });
    }
  });
}

export async function promptForRules(rules: Rule[]): Promise<void> {
  const prompts = new rx.Subject();

  let i = 1;
  addRulesToPrompts(prompts, [rules[0]]);

  inquirer.prompt(prompts).ui.process.subscribe((output: any) => {
    const rule: Rule = output.answer.rule;
    const apply = output.answer.rule.apply;
    const ruleAnswer = output.answer.input;

    if (apply) {
      cli.action.start('Applying rule');
      apply.call(rule, ruleAnswer).then(() => {
        cli.action.stop('Rule applied !\n');
            const subRules = Register.getSubRulesOf(rule);
        if (subRules.length !== 0) {
          addRulesToPrompts(prompts, subRules);
        } else if (rules[i] !== undefined) {
          addRulesToPrompts(prompts, [rules[i]]);
          i++;
        } else {
          prompts.complete();
        }
      });
    } else {
      if (rules[i] !== undefined) {
        addRulesToPrompts(prompts, [rules[i]]);
        i++;
      } else {
        prompts.complete();
      }
    }
  });
}
