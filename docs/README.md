# Documentation

## What is Zodit ?

Hello and welcome to Zodit's documentation ! Zodit is a Command Line Interface tool that will help you to make an audit of your development projects. By scanning your project's files, it will suggest recommendations like: adding dependencies, scripts, Dockerfile, updating your NodeJS engine, adding rules to .gitignore etc.

Zodit is easy to use, just run it by giving it your project's path, and depending on the options you gave it, it will either just inform you, or prompt you to take actions.

## How to use it ?

Just download the [tarball](https://github.com/DX-DeveloperExperience/project-starter/releases) package corresponding to your OS, decompress it, and run the bin/project-starter-cli binary in your shell like this:

`./bin/project-starter-cli /path/to/your/project -flags`

### List of possible flags

|          Flag           |                                                               Description |
| :---------------------: | ------------------------------------------------------------------------: |
|      -h or --help       |                                      Displays flags and their description |
|     -v or --version     |                                             Displays the version of Zodit |
|      -r or --rules      | Searches and displays rules that may apply to your project (default flag) |
|      -s or --stack      |                        Searches and displays stacks found in your project |
|     -m or --manual      |        Searches for rules and prompt you for each of them to apply or not |
|      -l or --list       |                          Displays a list of all possible Stacks and Rules |
|      -d or --debug      |                                       Debug mode, errors are more verbose |
| -c=path or --debug=path |                                                          Add custom rules |

## Custom rules

You may add custom rules for your audit. Please follow the [guide](/custom-rules/)
