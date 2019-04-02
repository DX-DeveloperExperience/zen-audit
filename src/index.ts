import { ListRules } from './list-rules';
import { Command, flags } from '@oclif/command';
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

    this.log('Scanning your project...');
    const rules = ListRules.findRulesToApplyIn('./');

    if (runFlags.rules) {
      rules.forEach(rule => {
        this.log('Rule found: ' + rule.name());
      });
    }
    if (runFlags.apply) {
      rules.forEach(rule => {
        rule.apply();
      });
    }
  }
}

export = ProjectFillerCli;
