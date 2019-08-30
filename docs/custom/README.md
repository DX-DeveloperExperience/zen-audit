---
sidebarDepth: 2
---

# Creating custom Stacks and Rules

## Introduction

ZenAudit is written with **TypeScript**, as a result, if you want to add custom Stacks and Rules, you will have to write them using **TypeScript**. You may write them in JavaScript but no documentation is provided for it. You will need to install {{ projectName }} as a **devDependency**, so you should [generate a Node project](https://docs.npmjs.com/creating-node-js-modules) first.

## First steps

### Install ZenAudit as a devDependency

In order to add your custom rules, first you have to install {{ projectName }} as a devDependency with :

`npm i -DE {{ packageName }}`

### Prepare your directory structure

For your Stacks and Rules to be read by {{ projectName }}, you need to create a folder with the name of your choice, containing two folders; **rules** and **stacks**. In these folder, you will need to create a folder for **every stack and rule**. It's inside these folders that you will write your TypeScript files, that must be named **index.ts**.

Your directory structure should look like this :

```
custom-folder
    ├─ rules
    │    ├─ my-custom-rule1
    │    |   └─ index.ts
    |    └─ my-custom-rule2
    |        └─ index.ts
    └─ stacks
        ├─ my-custom-stack1
        |   └─ index.ts
        └─ mu-custom-stack2
            └─ index.ts
```

## Custom Rules

### Writing custom Rules

Before you start writing your first rule, let's take a look at the Rule interface as you will need to implement its methods :

```ts
export default interface Rule {
  /**
   * Resolves a promise to true if the audited project should apply this rule. For example,
   * if the rule is to add rules to the .gitignore file, if the existing .gitignore does not contains
   * all the rules, this method resolves to true.
   */
  shouldBeApplied(): Promise<boolean>;
  /**
   * Add what is necessary to the project so the rule should not be applied again.
   * Takes a boolean or an array of string to tell if the rule has to be applied,
   * or the choices to apply if the user has multiple choices to apply.
   */
  apply?: (answers: boolean | string[]) => Promise<void>;
  /**
   * Returns the name of the Rule as it will be seen in the prompt.
   */
  getName(): string;
  /**
   * Returns the description of the stack that will be seen before asking if the user wants to apply it.
   */
  getShortDescription(): string;
  /**
   * Returns a longer description that will appear in the generated Markdown/PDF report.
   */
  getLongDescription(): string;
  /**
   * Gives the prompt type as a string. Please refer to Inquirer documentation to know which
   * prompt types exists. For Yes|No or confirmation, use "list" as prompt type,
   * and use the "YesNo" or "Ok" types in getChoices() method.
   */
  getPromptType(): string;
  /**
   * Returns a list of Choices for the user to chose. For Yes|No question, use native YesNo type,
   * for just a confirmation, use Ok type.
   */
  getChoices(): Choice[] | Promise<Choice[]>;
}
```

Create a TypeScript file inside your **custom rule folder** named **index.ts**, and write your class definition like this:

```ts
@RuleRegister.register
@StackRegister.registerRuleForStacks([Stack1, Stack2...]) // Replace Stack1, Stack2... with Stack classes
/* or @StackRegister.registerRuleForAll({excludes: [Stacks to exclude]}) to register
for all stacks except the ones you provide in the array */
export class Rule2 {
  shouldBeApplied(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /**
   * This method is optional
   */
  apply(answers: boolean | string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getName(): string {
    throw new Error('Method not implemented.');
  }
  getShortDescription(): string | Promise<string>{
    throw new Error('Method not implemented.');
  }
  getLongDescription(): string | Promise<string> {
    throw new Error('Method not implemented.');
  }
  getPromptType(): string {
    throw new Error('Method not implemented.');
  }
  getChoices(): Choice[] | Promise<Choice[]> {
    throw new Error('Method not implemented.');
  }
}
```

::: warning
Decorators are an experimental feature for the moment, so you need to set **experimentalDecorators** option to true in your tsconfig.json
:::

### Sub-rules

If you want your Rule2 to be prompted only after Rule1 is applied, use the following decorator:

```ts
@RuleRegister.registerSubRuleOf(Rule1)
export class Rule2 {...}
```

## Custom Stacks

### Writing custom Stacks

Let's take a look at the Stack interface first :

```ts
export default interface Stack {
  /**
   * Resolves a Promise to true if the project contains what is necessary to detect the stack.
   */
  isAvailable(): Promise<boolean>;
  /**
   * Gives some additional data about the detected stack. Optional method.
   */
  getInformations?: () => string[];
  /**
   * Returns the name as it will be seen in the prompt.
   */
  name(): string;
}
```

When you're finished writing your custom Stacks and Rules, run our application using the custom flag **-c**:

```bash
bin/run -c=path/to/custom-rules-and-stacks path/to/your/project
```

<script>
export default {
    computed: {
        packageName: function() {
            const parsedPackage = require('../../package.json');

            return parsedPackage.name;
        },
        projectName: function() {
            const config = require('../.vuepress/config.js');

            return config.title;
        },
    }
}
</script>
