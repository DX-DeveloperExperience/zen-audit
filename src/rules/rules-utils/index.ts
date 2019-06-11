export function hasDevDependencies(packageJSON: any): boolean {
  return packageJSON.devDependencies !== undefined;
}
