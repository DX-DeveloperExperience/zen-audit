import Choice from '../../choice';

export interface ChoiceList {
  [stack: string]: Choice[];
}

export const possibleChoices: ChoiceList = {
  All: [{ name: 'GitLens', value: 'eamodio.gitlens' }],
  Angular: [
    { name: 'Angular Language Service', value: 'angular.ng-template' },
    { name: 'TSLint', value: 'ms-vscode.vscode-typescript-tslint-plugin' },
    { name: 'Angular Console', value: 'nrwl.angular-console' },
    { name: 'Prettier', value: 'esbenp.prettier-vscode' },
  ],
  VueJS: [
    { name: 'Vetur', value: 'octref.vetur' },
    { name: 'ESLint', value: 'dbaeumer.vscode-eslint' },
    { name: 'Prettier', value: 'esbenp.prettier-vscode' },
  ],
  TypeScript: [{ name: 'Prettier', value: 'esbenp.prettier-vscode' }],
  Node: [{ name: 'Prettier', value: 'esbenp.prettier-vscode' }],
};
