export const linterJSON: { [linter: string]: any } = {
  tslint: {
    defaultSeverity: 'error',
    extends: ['tslint:recommended'],
    jsRules: {
      'no-unused-expression': true,
    },
    rules: {
      quotemark: [true, 'single'],
    },
    rulesDirectory: [],
  },
  eslint: {},
};
