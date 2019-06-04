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

    const rules = await ListRules.getRulesToApplyIn(path);
    await PromiseBlu.each(rules, async (rule: Rule) => {
      this.log(`Rule found: ${rule.getName()}`);
      await inquirer
        .prompt([
          {
            name: rule.constructor.name,
            message: rule.getDescription(),
            type: rule.getPromptType(),
            choices: await rule.getChoices(),
          },
        ])
        .then(answers => {
          if (rule.apply !== undefined) {
            const answer = Object.values(answers)[0];
            if (Array.isArray(answer) && answer.length !== 0) {
              rule.apply(answer);
            } else if (answer === true) {
              rule.apply();
            }
          }
        });
    });

    const tasks = new Listr([
      {
        title: 'Retrieving rules and stacks',
        enabled: () => runFlags.list,
        task: (result, task) => {
          return new Promise((resolve, reject) => {
            task.title = 'Possible stacks:';
            const stacks = StackRegister.getConstructors();
            result.rulesAndStacks = stacks.map(stack => {
              return {
                name: stack.name,
                rules: StackRegister.getRulesByStack(stack.name)
                  .map(rule => rule.name)
                  .join(', '),
              };
            });
            resolve();
          });
        },
      },
      {
        title: 'Searching for available Stacks',
        enabled: () => runFlags.stacks,
        task: (result, task) => {
          return new Promise((resolve, reject) => {
            const stacksFoundProm = ListStacks.getStacksIn(path);
            stacksFoundProm.then(stacksFound => {
              if (stacksFound.length === 0) {
                reject(new Error('No stack found.'));
              }
              task.title = 'Stacks found';
              result.foundStacks = stacksFound.map(stackFound => {
                return { name: stackFound.name() };
              });
              resolve();
            });
          });
        },
      },
    ]);

    tasks
      .run({})
      .then(result => {
        if (result.rulesAndStacks) {
          cli.table(result.rulesAndStacks, {
            name: {},
            rules: {},
          });
        } else if (result.foundStacks) {
          cli.table(result.foundStacks, {
            name: {},
          });
        }
      })
      .catch(() => ({}));
  }
}

export = ProjectFillerCli;
