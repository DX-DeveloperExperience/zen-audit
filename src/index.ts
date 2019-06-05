import { ListRules } from './rules/list-rules';
import { Command, flags, run } from '@oclif/command';
import { cli } from 'cli-ux';
import * as inquirer from 'inquirer';
import * as Path from 'path';
import Rule from './rules/rule';
import { init } from './init/index';
import { StackRegister } from './stacks/stack-register';
import * as PromiseBlu from 'bluebird';
import { ListStacks } from './stacks/list-stacks/index';
import * as Listr from 'listr';

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
    stacks: flags.boolean({
      char: 's',
      description: 'Search for stacks found in your project',
    }),
    list: flags.boolean({
      char: 'l',
      description: 'List all rules and stacks available',
    }),
  };

  static args = [{ name: 'path' }];

  async run() {
    const { args, flags: runFlags } = this.parse(ProjectFillerCli);
    let path = './';

    if (args.path !== undefined) {
      path = args.path.endsWith('/') ? args.path : args.path + '/';
    }

    if (!path.startsWith('http') && !Path.isAbsolute(path)) {
      path = Path.resolve(path) + '/';
    }

    if (runFlags.list) {
      cli.action.start('Retrieving rules and stacks');
      const stacks = StackRegister.getConstructors();
      cli.action.stop();
      cli.table(stacks, {
        name: {},
        rules: {
          get: stack =>
            StackRegister.getRulesByStack(stack.name)
              .map(rule => rule.name)
              .join(', '),
        },
      });
    }

    if (runFlags.stacks) {
      cli.action.start('Searching for available stacks');
      const stacksFoundProm = ListStacks.getStacksIn(path);
      stacksFoundProm.then(stacksFound => {
        if (stacksFound.length === 0) {
          cli.action.stop('No stack found.');
        }
        cli.action.stop('Stacks found: ');
        stacksFound.map(stackFound => {
          this.log(stackFound.name());
        });
      });
    }

    if (Object.keys(runFlags).length === 0) {
      cli.action.start('Searching for rules');
      ListRules.getRulesToApplyIn(path).then(foundRules => {
        const prompts = foundRules.map(async rule => {
          return {
            name: rule.constructor.name,
            message: rule.getDescription(),
            type: rule.getPromptType(),
            choices: await rule.getChoices(),
          };
        });

        if (prompts.length === 0) {
          cli.action.stop('No rule to apply, you\'re good to go ! :)');
          return;
        }

        Promise.all(prompts).then(prompts => {
          cli.action.stop(`${prompts.length} rules found ! Let's go !`);
          inquirer.prompt(prompts).then(answers => {
            Object.entries(answers).forEach(([ruleName, answer], i) => {
              const apply = foundRules[i].apply;
              if (apply) {
                const applyResult = apply.call(foundRules[i], answer);
              }
            });
          });
        });
      });
    }
  }
}

export = ProjectFillerCli;
