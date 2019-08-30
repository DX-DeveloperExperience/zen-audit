# Included Stacks and Rules

On this page you will find all the Stacks and Rules we packed in our solution. Feel free to re-use them as you wish with your custom ones.

## List of Stacks

|     Name      |                                                                                                                                                          Description |
| :-----------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|    NodeJS     |                                                                                                          Detects if you have a **package.json** file in your project |
| Node Backend  |                                                  Detects if **express**, **restify**, **@nestjs/core** or **hapi** is installed as a dependency in your package.json |
|    Angular    |                                                                                       Detects if **@angular/core** is installed as a dependency in your package.json |
|     React     |                                                                                             Detects if **react** is installed as a dependencies in your package.json |
|     VueJS     |                                                                                                 Detects if **vue** is installed as a dependency in your package.json |
|  TypeScript   |                                                                                       Detects if **typescript** is installed as a devDependency in your package.json |
|    Website    | Checks if the path to your project starts with **http** or **https**, then make a request to the url, checks if the headers' content type starts with **text/html**. |
| ElasticSearch |                               Checks if the path starts with **http**, then sends a request to the url, checks if the response's tagline is **You Know, for Search** |
|     Java      |                                                                                       Detects if you have a **pom.xml** and a **build.gradle** file in your project. |
|    GitHub     |                                             Checks if you have a **.git** folder, and run the **git remove -v** command to check if your project is hosted on GitHub |

## List of Rules

### Data rules

#### ElasticSearch

|       Name        |                                                                                                                 Description | Sub-rule of |
| :---------------: | --------------------------------------------------------------------------------------------------------------------------: | ----------: |
| Integration Tests | This rule asks the user if the ElasticSearch has integration tests, if not, suggests the user to download a skeleton of it. |          -- |
|       Mlock       |        This rule checks if the mlock in the ElasticSearch cluster is disabled, if it is, it advise the user to activate it. |          -- |
|   Nodes Version   |                     This rule checks if all version of the ElasticSearch cluster's node are the same. Tells the user if not |          -- |
|   Nodes Number    |                                           Checks if the ElasticSearch cluster has at least 3 nodes, if not, warns the user. |          -- |
|     Template      |                          Checks if the ElasticSearch cluster uses templates for configuring indices, warns the user if not. |          -- |

### Continuous Integration rules

|    Name    |                                                                                       Description |                   Stacks                    |
| :--------: | ------------------------------------------------------------------------------------------------: | :-----------------------------------------: |
| CI Scripts | Asks the user to add CI scripts in a **ci-scripts/** folder. Add the scripts if the user accepts. | All Stacks except ElasticSearch and Website |

### JavaScript / TypeScript rules

|       Name        |                                                                                                                                                                                                                                                                                                     Description |        Stacks         | Subrule of |
| :---------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------: | ---------- |
| Exact npm Version |                                                                                              Checks if all the **dependencies** and **devDependencies** of the project are using an **exact semver syntax**. If not, asks the user to update them. This will remove **^** or **~** from these packages version. |
|    LightHouse     |                                                                                                                      Checks if the project has [LightHouse](https://developers.google.com/web/tools/lighthouse/#programmatic) as devDependency. If not, asks the user to install it, and adds a default script. | React, Angular, VueJS |
|       Nginx       |                                                                                                                                                                                                Asks the user to add a default Nginx configuration file in the **nginx-conf/** folder at the root of the project | Angular, React, VueJS |
|    Dockerfile     |                                                                                                                                                                                                                                                           Asks the user to add a **Dockerfile** to its project. | Angular, React, VueJS | Nginx      |
|  Front App Debug  |                                                                                                                                                                                  Checks if the **.vscode/launch.conf** file misses **Visual Studio Code debug configurations**, then asks the user to add them. | Angular, React, VueJS |            |
|       Husky       | Checks if the project has [Husky](https://github.com/typicode/husky) as devDependency. If not, asks the user to install it, and adds a default npm pre-push script **exit 1** that will make the **git push** command fail. It suggest the user to update this script to run the wanted tasks before each push. |   Node, TypeScript    |            |
|      Linter       |                                                                   Checks if the project has [eslint](https://eslint.org/) or [tslint](https://palantir.github.io/tslint/) as devDependency, depending on the detected Stack. If not, asks the user to install it. Also writes a config file if none is present. |   Node, TypeScript    |            |
|   Node Version    |                                                                                                                                            Checks the version of node installed on the user's computer, compares it with the official Node Schedule. Will warn the user if the version is critical or outdated. |   Node, TypeScript    |            |
|      Nodemon      |                                                                                                                                                                           Checks if the project has Nodemon as devDependency. If not, asks the user to install it and adds a default npm script to run Nodemon. |         Node          |
|     Prettier      |                                                                                                                                                                                                                       Checks if the project has Prettier as devDEpendency. If not, asks the user to install it. |   Node, TypeScript    |            |

### Source Code Manager rules

|       Name       |                                                                                                                                                                                                                                                     Description |                   Stacks                    | Subrule of |
| :--------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------: | ---------- |
| GitHub Templates |                                                                                                               Checks if the project already contains a **.github/** folder containing an **ISSUE_TEMPLATE.md** file. If not, asks the user to add default ones. |                   GitHub                    |            |
|    Gitignore     | Checks if the **.gitignore** file exists. If it exists, checks if **rules are missing**, depending on the **detected Stacks**. However, this rule will ask the user to **add or complete** the **.gitignore** file with rules corresponding to detected Stacks. | All Stacks except ElasticSearch and Website |            |

### Text Editors rules

|       Name        |                                                                                                                                                                                                                                               Description |                   Stacks                    | Subrule of |
| :---------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------: | ---------- |
| VSCode extensions | Checks if the **.vscode** folder exists and contains an **extensions.json** file. If it exists, **searches for missing extensions**. However, this rule will ask the user to add or complete the **extensions.json** file with extensions we find useful. | All Stacks except ElasticSearch and Website |            |
