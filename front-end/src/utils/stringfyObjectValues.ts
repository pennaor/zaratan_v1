interface IObject { [k: string]: any }

export function stringfyObjectValues<T>(
  object: IObject,
) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, value !== null ? String(value) : '']),
  ) as unknown as T;
}

export function stringfyArrayObjectsValues<T>(
  array: IObject[],
) {
  return array.map((object) => stringfyObjectValues<T>(object));
}
