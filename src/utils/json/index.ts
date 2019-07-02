export function hasDevDependency(parsedJSON: object, dependency: string) {
  return pathExistsInJSON(parsedJSON, ['devDependencies', dependency]);
}

export function hasDependency(parsedJSON: object, dependency: string) {
  return pathExistsInJSON(parsedJSON, ['dependencies', dependency]);
}

export function pathExistsInJSON(parsedJSON: any, objs: string[]): boolean {
  if (objs.length === 0) {
    return true;
  }
  const [head, ...tail] = objs;
  return (
    parsedJSON[head] !== undefined && pathExistsInJSON(parsedJSON[head], tail)
  );
}
