export default interface Choice {
  name: string;
  value: string | boolean;
}

export const YesNo: Choice[] = [
  { name: 'Yes', value: true },
  { name: 'No', value: false },
];

export const Ok: Choice[] = [{ name: 'Understood', value: true }];
