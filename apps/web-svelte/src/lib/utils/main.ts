// Convert array of Objects into one Object in JavaScript
// https://stackoverflow.com/a/49247635
const convertErrorsArrayToObject = (errors: { field: string, message: string }[]) => {
  var mapped = errors.map(item => ({ [item.field]: item.message }));
  return Object.assign({}, ...mapped);
}
