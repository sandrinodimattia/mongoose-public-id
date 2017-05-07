export default (onAdd, onIndex, onPreSave) => ({
  index: (fields, options) => {
    onIndex(fields, options);
  },
  pre: (type, func) => {
    onPreSave(type, func);
  },
  add: (fields) => {
    onAdd(fields);
  }
});
