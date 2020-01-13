export function removeFields(obj, ...fields) {
  const newObj = { ...obj };
  fields.forEach(field => {
    delete newObj[field];
  });
  return newObj;
}
