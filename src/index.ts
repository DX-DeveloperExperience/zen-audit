import { ListRules } from './rules/list-rules';
import { Command, flags, run } from '@oclif/command';
import { cli } from 'cli-ux';
import * as inquirer from 'inquirer';
import * as Path from 'path';
import { init } from './init/index';
import { StackRegister } from './stacks/stack-register';
import { ListStacks } from './stacks/list-stacks/index';
import { logger } from './logger/index';
import * as fs from 'fs-extra';
import { YesNo, Ok } from './choice/index';
import { generateReport } from './report';
import Globals from './utils/globals/index';

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

  static args = [{ name: 'path' }];

  async run() {
    const { args, flags: runFlags } = this.parse(ProjectFillerCli);

    if (args.path === undefined) {
      logger.error('Please provide the path to the project to be audited.');
      return;
    }

    Globals.rootPath = args.path;

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

    init();

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

  listAllStacksAndRules() {
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

  listFoundStacks() {
    cli.action.start('Searching for available stacks');
    ListStacks.getAvailableStacks()
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
    ListRules.getRulesToApply()
      .then(foundRules => {
        foundRules.forEach(async rule => {
          const choices = await rule.getChoices();
          const apply = rule.apply;
          if (apply) {
            // We call apply with true as answer because it is a YesNo or an Ok Choice List
            if (choices === YesNo || choices === Ok) {
              return apply.call(rule, true);
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
    ListRules.getRulesToApply()
      .then(async foundRules => {
        const promptsProm = foundRules.map(async rule => {
          return {
            name: rule.constructor.name,
            message: rule.getShortDescription(),
            type: rule.getPromptType(),
            choices: await rule.getChoices(),
          };
        });

        if (promptsProm.length === 0) {
          return [];
        }

        const prompts = await Promise.all(promptsProm);

        cli.action.stop(
          `${prompts.length} rule${
            prompts.length > 0 ? 's' : ''
          } found ! Let's go !`,
        );

        const answers: {} = await inquirer.prompt(prompts);

        return Object.entries(answers).map(([_, answer], i) => {
          const apply = foundRules[i].apply;

          if (apply) {
            return apply.call(foundRules[i], answer);
          }
        });
      })
      .then(async applies => {
        if (applies.length === 0) {
          logger.info("No rule to apply, you're good to go ! :)");
          return;
        } else {
          cli.action.start('Applying rules, please wait');
          return Promise.all(applies).then(() => {
            cli.action.stop('Rules applied ! Congratulations !');
          });
        }
      })
      .catch(err => {
        logger.error(err.message);
        logger.debug(err.stack);
      });
  }

  listFoundRules() {
    cli.action.start('Searching for rules to apply');
    ListRules.getRulesToApply()
      .then(rules => {
        if (rules.length === 0) {
          cli.action.stop();
          this.log('No rule found. Your project seems fine ! :)');
          return;
        }

        rules.forEach(rule => {
          this.log(`${rule.getName()}: ${rule.getShortDescription()}`);
        });

        cli.action.stop();

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
