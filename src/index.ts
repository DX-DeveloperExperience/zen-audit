export { run } from '@oclif/command';
import Command, { flags } from '@oclif/command';
import { ListStacks } from './commands/list-kinds';

export class ProjectFiller extends Command {
  static flags = {
    list: flags.string({
      char: 'l',
      description: 'List found stacks in your project',
    }),
  };

  async run() {
    const { flags: flagsRun } = this.parse(ProjectFiller);
    if (flagsRun.list) {
    }
    for (const stack of ListStacks.getProjectStacks('./')) {
      console.log(stack);
    }
    console.log('test');
  }
}
