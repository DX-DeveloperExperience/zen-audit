export function hasDevDependencies(packageJSON: any): boolean {
  return packageJSON.devDependencies !== undefined;
}

export function hasDevDependency(path: string, dependency: string) {
  return hasKeyInObject(`${path}package.json`, 'devDependencies', dependency);
}

export function hasDependency(path: string, dependency: string) {
  return hasKeyInObject(`${path}package.json`, 'dependencies', dependency);
}

export function hasKeyInObject(
  JSONFilePath: string,
  obj: string,
  keyToFind: string,
): boolean {
  try {
    const parsedJSON = require(JSONFilePath);
    if (parsedJSON[obj] !== undefined) {
      return parsedJSON[obj][keyToFind] !== undefined;
    }
    return false;
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return false;
    }
    throw err;
  }
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

export function JSONhasObj(JSONPath: string, obj: string) {
  const parsedJSON = require(JSONPath);

  return parsedJSON[obj] !== undefined;
}
