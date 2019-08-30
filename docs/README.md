---
home: true
heroImage: /logo.png
actionText: Get Started →
actionLink: /#get-started
features:
  - title: Simplicity First
    details: No setup, just download and launch our Command Line Interface to audit your projects.
  - title: Modularity
    details: Use our default Stacks and Rules, or add your custom ones !
  - title: Safe to use
    details: Our default Stacks and Rules are safe to apply, nothing will break your project.
footer: MIT Licensed | Copyright © 2019 - Emmanuel Demey - Antoine Lafrance
---

# Get started

## What is ZenAudit ?

Hello and welcome to Zodit's documentation ! Zodit is a Command Line Interface tool that will help you to make an audit of your development projects. By scanning your project's files, it will suggest recommendations like: adding dependencies, scripts, Dockerfile, updating your NodeJS engine, adding rules to .gitignore etc.

Zodit is easy to use, just run it by giving it your project's path, and depending on the options you gave it, it will either just inform you, or prompt you to take actions.

## How to use it ?

Just download the [tarball](https://github.com/DX-DeveloperExperience/project-starter/releases) package corresponding to your OS, decompress it, and run the bin/project-starter-cli binary in your shell like this:

`./bin/project-starter-cli /path/to/your/project -flags`

### List of possible flags

|          Flag           |                                                        Description |
| :---------------------: | -----------------------------------------------------------------: |
|      -h or --help       |                               Displays flags and their description |
|     -v or --version     |                                      Displays the version of Zodit |
| -r or --rules (default) |         Searches and displays rules that may apply to your project |
|      -s or --stack      |                 Searches and displays stacks found in your project |
|     -m or --manual      | Searches for rules and prompt you for each of them to apply or not |
|      -l or --list       |                   Displays a list of all possible Stacks and Rules |
|      -d or --debug      |                                Debug mode, errors are more verbose |
| -c=path or --debug=path |                                                   Add custom rules |

## Included rules

We have a list of all already included rules that are shipped with ZenAudit archive when you download it. You can find the detailed list [here](/included/).

## Custom rules

You may add custom rules for your audit. Please follow the [guide](/custom/).

<script>
export default {
    computed: {
        projectName: function() {
            const config = require('./.vuepress/config.js');

            return config.title;
        }
    }
}
</script>
