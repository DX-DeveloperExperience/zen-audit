import { ListRules } from './rules/list-rules';
import { Command, flags, run } from '@oclif/command';
import * as inquirer from 'inquirer';
import Rule from './rules/rule';

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

  static args = [{ name: 'file' }];

  async run() {
    const { args, flags: runFlags } = this.parse(ProjectFillerCli);
    const path = args.file.endsWith('/') ? args.file : args.file + '/';
    const rules = ListRules.findRulesToApplyIn(path);
    let responses;
    
    this.log('Scanning your project...');
    this.asyncForEach(rules, async (rule: Rule) => {
      this.log(`Rule found: ${rule.getName()}`);
      responses = await inquirer.prompt([
        {
          name: rule.getName(),
          message: rule.getDescription(),
          type: rule.getPromptType(),
          choices: rule.getChoices(),
        }
      ])
    })
  }

  async asyncForEach(array: any[], callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}


export = ProjectFillerCli;
