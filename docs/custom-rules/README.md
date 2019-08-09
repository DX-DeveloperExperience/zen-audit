# Custom Rules

## How to add custom rules

In order to add your custom rules, first you have to install our project as a devDependency with :

`npm i -DE {{ packageName }}`

Then you need to create a folder with the name of your choice, containing another folder named 'rules'.
In this 'rules' folder, you can create your first rule. You need to write them using TypeScript as we use decorators to register rules into our application.
Each rule file must be an index.ts file inside a folder with the name of its corresponding rule.

Your directory structure should look like this:

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

::: warning
Decorators are an experimental feature for the moment, so you need to set "experimentalDecorators" option to true in your tsconfig.json
:::

Before you start writing your first rule, let's take a look at the Rule interface as you will need to implement its methods :

```ts
export default interface Rule {
  /**
   * Tells if the project contains what is necessary to apply this rule.
   */
  shouldBeApplied(): Promise<boolean>;
  /**
   * Add what is necessary to the project so the rule is applied.
   * Takes a boolean or an array of string to tell if the rule has to be applied,
   * or the choices to apply if the user has multiple choices to apply.
   */
  apply?: (answers: boolean | string[]) => Promise<void>;
  getName(): string;
  getShortDescription(): string;
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

Create a TypeScript file inside your custom-rule folder named index.ts, and write your class definition like this:

```ts
@StackRegister.registerRuleForStacks([Stack1, Stack2...]) // Replace Stack1, Stack2... with Stack classes
// or @StackRegister.registerRuleForAll({excludes: [Stacks to exclude]})
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
  getShortDescription(): string {
    throw new Error('Method not implemented.');
  }
  getLongDescription(): string {
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

### Sub-rules

If you want your Rule2 to be prompted only after Rule1 is applied, use the following decorator instead:

```ts
@RuleRegister.registerSubRuleOf(Rule1)
export class Rule2 {...}
```

When you're finished writing your rules, run our application using the custom flag :

```bash
bin/run -c=path/to/custom-folder path/to/your/project
```

<script>
export default {
    computed: {
        packageName: function() {
            const parsedPackage = require('../../package.json');

            return parsedPackage.name;
        }
    }
}
</script>
