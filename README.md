project-starter-cli
===================

a tool that guides you to add all you need for your project deployment

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/project-starter-cli.svg)](https://npmjs.org/package/project-starter-cli)
[![CircleCI](https://circleci.com/gh/project-starter/project-starter/tree/master.svg?style=shield)](https://circleci.com/gh/project-starter/project-starter/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/project-starter-cli.svg)](https://npmjs.org/package/project-starter-cli)
[![License](https://img.shields.io/npm/l/project-starter-cli.svg)](https://github.com/project-starter/project-starter/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g project-starter
$ project-starter-cli COMMAND
running command...
$ project-starter-cli (-v|--version|version)
project-starter/0.0.0 linux-x64 node-v11.10.1
$ project-starter-cli --help [COMMAND]
USAGE
  $ project-starter-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`project-starter-cli hello [FILE]`](#project-starter-cli-hello-file)
* [`project-starter-cli help [COMMAND]`](#project-starter-cli-help-command)

## `project-starter-cli hello [FILE]`

describe the command here

```
USAGE
  $ project-starter-cli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ project-starter-cli hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/DX-DeveloperExperience/project-starter/blob/v0.0.0/src/commands/hello.ts)_

## `project-starter-cli help [COMMAND]`

display help for project-starter-cli

```
USAGE
  $ project-starter-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_
<!-- commandsstop -->
