export function hasDevDependencies(packageJSON: any): boolean {
  return packageJSON.devDependencies !== undefined;
}

export function JSONhasObj(JSONPath: string, obj: string) {
  const parsedJSON = require(JSONPath);

  return parsedJSON[obj] !== undefined;
}
