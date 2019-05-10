export default interface Choice {
  name: string;
  value: string;
}

export const YesNo = [
  { name: 'Yes', value: true },
  { name: 'No', value: false },
];

export const Ok = [{ name: 'Understood', value: true }];
