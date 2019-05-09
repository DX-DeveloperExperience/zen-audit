import { ListRules } from './rules/list-rules';
import { Command, flags, run } from '@oclif/command';
import * as inquirer from 'inquirer';
import Rule from './rules/rule';
import './init';

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
  };

  static args = [{ name: 'path' }];

  async run() {
    const { args, flags: runFlags } = this.parse(ProjectFillerCli);
    let path;
    if (args.path !== undefined) {
      path = args.path.endsWith('/') ? args.path : args.path + '/';
    } else {
      path = './';
    }

    const rules = ListRules.getRulesToApplyIn(path);
    const responses: object[] = [];
    this.log('Scanning your project...');
    await this.asyncForEach(rules, async (rule: Rule) => {
      this.log(`Rule found: ${rule.getName()}`);
      responses.push(
        await inquirer.prompt([
          {
            name: rule.getName(),
            message: rule.getDescription(),
            type: rule.getPromptType(),
            choices: rule.getChoices(),
          },
        ]),
      );
    });

    await this.asyncForEach(responses, async (resp: object) => {
      // console.log(resp);
    });
  }

  async asyncForEach(array: any[], callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}

export = ProjectFillerCli;
