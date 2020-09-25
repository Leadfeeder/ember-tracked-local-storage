export default  {
  boolean: value => value !== 'false',
  object: value => value && JSON.parse(value),
  number: value => Number(value),
  integer: value => parseInt(value),
  array: value => JSON.parse(value),
  string: value => value,
};
