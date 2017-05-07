const Hashids = require('hashids');

module.exports = function idGenerator(namespace, separator) {
  separator = separator || '_';
  const prefix = (namespace && namespace.length && (namespace + separator)) || '';

  const hashids = new Hashids(namespace || null);
  return function generateIdFromHex(id) {
    return prefix + hashids.encodeHex(id);
  };
};
