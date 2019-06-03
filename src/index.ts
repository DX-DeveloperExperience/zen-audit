import { ListRules } from './rules/list-rules';
import { Command, flags, run } from '@oclif/command';
import { cli } from 'cli-ux';
import * as inquirer from 'inquirer';
import * as Path from 'path';
import Rule from './rules/rule';
import { init } from './init/index';
import { StackRegister } from './stacks/stack-register';

init();

class ProjectFillerCli extends Command {
  static description = 'describe the command here';

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
    apply: flags.boolean({
      char: 'a',
      description: 'Apply rules',
    }),
    rules: flags.boolean({
      char: 'r',
      description: 'Search for rules that may apply to your project',
    }),
    list: flags.boolean({
      char: 'l',
      description: 'List all rules and stacks available',
    }),
  };

  static args = [{ name: 'path' }];

  async run() {
    const { args, flags: runFlags } = this.parse(ProjectFillerCli);

    if (runFlags.list) {
      this.log('Stacks available:');
      const stacks = StackRegister.getConstructors();
      cli.table(stacks, {
        name: {},
        rules: {
          get: stack =>
            StackRegister.getRulesByStack(stack.name)
              .map(rule => rule.name)
              .join(', '),
        },
      });
      return;
    }

    let path = './';

    if (args.path !== undefined) {
      path = args.path.endsWith('/') ? args.path : args.path + '/';
    }

    if (!path.startsWith('http') && !Path.isAbsolute(path)) {
      path = Path.resolve(path) + '/';
    }

    const rulesWithPromptProm = await ListRules.getRulesToApplyIn(path).then(
      rules => {
        return rules.map(async (rule: Rule) => {
          const question: inquirer.Question = {
            name: rule.constructor.name,
            message: rule.getDescription(),
            type: rule.getPromptType(),
            choices: await rule.getChoices(),
          };
          return {
            rule,
            promptObject: question,
          };
        });
      },
    );

    Promise.all(rulesWithPromptProm).then(rulesWithPrompt => {
      rulesWithPrompt.forEach(async ruleWithPrompt => {
        await inquirer
          .prompt([ruleWithPrompt.promptObject])
          .then(async answers => {
            if (ruleWithPrompt.rule.apply !== undefined) {
              const answer = Object.values(answers)[0];
              if (Array.isArray(answer) && answer.length !== 0) {
                await ruleWithPrompt.rule.apply(answer);
              } else if (answer === true) {
                await ruleWithPrompt.rule.apply();
              }
            }
          });
      });
    });
  }
}

export = ProjectFillerCli;
