const idGenerator = require('./id-generator');

module.exports = function MongoosePublicId(schema, options) {
  options = options || { };

  if (options.fieldName === null || options.fieldName === undefined) {
    throw new Error('A value for "options.fieldName" must be provided.');
  }

  if (typeof options.fieldName !== 'string') {
    throw new TypeError('The value of "options.fieldName" must be a string.');
  }

  if (options.namespace !== null && options.namespace !== undefined && typeof options.namespace !== 'string') {
    throw new TypeError('The value of "options.namespace" must be a string.');
  }

  if (options.separator !== null && options.separator !== undefined && typeof options.separator !== 'string') {
    throw new TypeError('The value of "options.separator" must be a string.');
  }

  if (options.index === null || options.index === undefined) {
    options.index = true;
  }

  if (typeof options.index !== 'boolean' && typeof options.index !== 'object') {
    throw new TypeError('The value of "options.index" must be an object or a boolean. ' + typeof options.index);
  }

  const field = { };
  field[options.fieldName] = {
    type: String,
    required: true
  };
  schema.add(field);

  if (options.index) {
    const index = { };
    index[options.fieldName] = 1;

    const indexOptions = {
      name: options.fieldName.toLowerCase() + '_public_id',
      unique: true
    };
    schema.index(index, (typeof options.index === 'object' && options.index) || indexOptions);
  }

  const generateId = idGenerator(options.namespace, options.separator);
  schema.pre('save', function generatePublicIdOnSave(next) {
    if (this[options.fieldName] === null || this[options.fieldName] === undefined) {
      this[options.fieldName] = generateId(this._id);
    }

    return next();
  });
};
