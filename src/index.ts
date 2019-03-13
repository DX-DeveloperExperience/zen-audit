import { ListRules } from './list-rules';
import { Command, flags } from '@oclif/command';
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
      description: 'Applies recommandations to every found stack',
    }),
    rules: flags.boolean({
      char: 'r',
      description: 'Search for rules that may apply to your project',
    }),
  };

  static args = [{ name: 'file' }];

  async run() {
    const { args, flags: runFlags } = this.parse(ProjectFillerCli);
    let stacks: Rule[] = [];

    this.log('Scanning your project...');
    stacks = ListRules.findRulesToApplyIn('./');

    if (runFlags.rules) {
      stacks.forEach(stack => {
        this.log('Stack found: ' + stack.getName());
      });
    }
    if (runFlags.apply) {
      stacks.forEach(stack => {
        stack.apply();
      });
    }
  }
}

export = ProjectFillerCli;
