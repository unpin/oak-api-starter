const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/;

export function isObjectIdValid(string: string | undefined) {
  return string && OBJECT_ID_REGEX.test(string);
}
