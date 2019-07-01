export const semverRegex = new RegExp(
  '^(\\^|\\~)((([0-9]+)\\.([0-9]+)\\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?)(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?)$',
  'g',
);

export function getExactSemver(semver: string): string {
  return semver.replace(semverRegex, (_A: string, _B: string, c: string) => {
    return c;
  });
}

export function matchesSemver(value: string): boolean {
  return !!value.match(semverRegex);
}
