import { Command, flags, run } from '@oclif/command';
import { cli } from 'cli-ux';
import * as Path from 'path';
import { init, importCustomClassesIn } from './init/index';
import { logger } from './logger/index';
import * as fs from 'fs-extra';
import { YesNo, Ok } from './choice/index';
import { generateReport } from './report';
import Globals from './utils/globals/index';
import { promptForRules } from './utils/prompt';
import { Register } from './register';

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
    custom: flags.string({
      char: 'c',
      description: 'Provide a path to a folder containing custom rules',
    }),
    apply: flags.boolean({
      char: 'a',
      description: 'Apply rules',
    }),
    rules: flags.boolean({
      char: 'r',
      default: true,
      description:
        'Search for rules that may apply to your project (default flag)',
    }),
    stacks: flags.boolean({
      char: 's',
      description: 'Search for stacks found in your project',
    }),
    list: flags.boolean({
      char: 'l',
      description: 'List all rules and stacks available',
    }),
    debug: flags.boolean({
      char: 'd',
      description: 'Debug mode',
    }),
    manual: flags.boolean({
      char: 'm',
      description:
        'List all rules and prompt for each one of them to let you make a choice',
    }),
  };

  static args = [
    {
      name: 'path',
      required: true,
      description: 'The path to your project',
    },
  ];

  async run() {
    const { args, flags: runFlags } = this.parse(ProjectFillerCli);

    if (args.path === undefined) {
      logger.error('Please provide the path to the project to be audited.');
      return;
    }

    this.parseProjectPath(args.path);

    init();

    if (runFlags.custom) {
      const customPath = Path.resolve(runFlags.custom);
      importCustomClassesIn(customPath);
    }

    if (runFlags.debug) {
      logger.level = 'debug';
    }

    if (runFlags.list) {
      this.listAllStacksAndRules();
    } else if (runFlags.stacks) {
      this.listFoundStacks();
    } else if (runFlags.apply) {
      this.applyAllRules();
    } else if (runFlags.manual) {
      this.applyFoundRulesManually();
    } else if (runFlags.rules) {
      this.listFoundRules();
    }
  }

  parseProjectPath(path: string) {
    Globals.rootPath = path;

    try {
      if (
        !Globals.rootPath.startsWith('http') &&
        !Path.isAbsolute(Globals.rootPath)
      ) {
        Globals.rootPath = Path.resolve(Globals.rootPath);

        const fileStat = fs.statSync(Globals.rootPath);
        if (!fileStat.isDirectory()) {
          logger.error(
            `The provided path: ${Globals.rootPath} is not a directory.`,
          );
          return;
        }

        const splittedPath = Globals.rootPath.split('/');
        Globals.projectName = splittedPath[splittedPath.length - 1];
      } else {
        Globals.projectName = Globals.rootPath;
      }
      if (!Globals.rootPath.endsWith('/')) {
        Globals.rootPath = Globals.rootPath + '/';
      }
    } catch (err) {
      logger.error(
        "An error occured while trying to parse arguments. Did you provide a path to your project's directory ?",
      );
      logger.debug(err);
      return;
    }
  }

  listAllStacksAndRules() {
    cli.action.start('Retrieving rules and stacks');
    const stacksMaps = Register.getStacksMaps();
    cli.action.stop();
    cli.table(stacksMaps, {
      name: {
        get: stackMap => stackMap.stack.name(),
      },
      rules: {
        get: stackMap =>
          stackMap.ruleMaps.map(ruleMap => ruleMap.rule.getName()),
      },
    });
  }

  listFoundStacks() {
    cli.action.start('Searching for available stacks');
    Register.getAvailableStacks()
      .then(stacksFound => {
        if (stacksFound.length === 0) {
          cli.action.stop('No stack found.');
        }
        cli.action.stop('Stacks found: ');
        stacksFound.map(stackFound => {
          this.log(stackFound.name());
        });
      })
      .catch(err => {
        logger.error(err.message);
        logger.debug(err.stack);
      });
  }

  applyAllRules() {
    cli.action.start('Search for rules');
    Register.getRulesToApply()
      .then(foundRules => {
        foundRules.forEach(async rule => {
          const choices = await rule.getChoices();
          const apply = rule.apply;
          if (apply) {
            // We call apply with true as answer because it is a YesNo or an Ok Choice List
            if (choices === YesNo || choices === Ok) {
              return apply.call(rule);
            } else {
              // Else we call it with all the possible choices
              const choicesStr = choices.map(choice => {
                return choice.value.toString();
              });
              return apply.call(rule, choicesStr);
            }
          }
        });
      })
      .catch(err => {
        logger.error(err.message);
        logger.debug(err.stack);
      });
  }

  applyFoundRulesManually() {
    cli.action.start('Searching for rules');
    Register.getRulesToApply()
      .then(async foundRules => {
        if (foundRules.length === 0) {
          cli.action.stop('No found rules.');
        } else {
          cli.action.stop(
            `${foundRules.length} rule${
              foundRules.length > 0 ? 's' : ''
            } found ! Let's go !`,
          );
        }

        return promptForRules(foundRules);
      })
      .then(async applies => {
        cli.action.stop('Rules applied ! Congratulations !');
      })
      .catch(err => {
        logger.error(err.message);
        logger.debug(err.stack);
      });
  }

  listFoundRules() {
    cli.action.start('Searching for rules to apply');
    Register.getRulesToApply()
      .then(rules => {
        if (rules.length === 0) {
          cli.action.stop();
          this.log('No rule found. Your project seems fine ! :)');
          return;
        }

        cli.action.stop();

        rules.forEach(rule => {
          this.log(`${rule.getName()}: ${rule.getShortDescription()}`);
        });

        return generateReport({
          projectName: Globals.projectName,
          rulesInfos: rules.map(rule => {
            return {
              name: rule.getName(),
              shortDescription: rule.getShortDescription(),
              longDescription: rule.getLongDescription(),
            };
          }),
        });
      })
      .catch(err => {
        logger.error(err.message);
        logger.debug(err.stack);
      });
  }
}

export = ProjectFillerCli;
