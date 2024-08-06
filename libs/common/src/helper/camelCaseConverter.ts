export function convertKeysToCamelCase(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  }

  const camelCaseObj: { [key: string]: any } = {};

  for (const key of Object.keys(obj)) {
    const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    );
    camelCaseObj[camelCaseKey] = convertKeysToCamelCase(obj[key]);
  }

  return camelCaseObj;
}
