import { Command, flags } from '@oclif/command';
import { ListStacks } from './list-stacks';

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
  };

  static args = [{ name: 'file' }];

  async run() {
    const { args, flags } = this.parse(ProjectFillerCli);

    const stacks = ListStacks.getProjectStacks();
    stacks.forEach(stack => {
      this.log('Stack found : ' + stack.getName());
      stack.apply();
    });
  }
}

export = ProjectFillerCli;
