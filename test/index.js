import test from 'ava';
import plugin from '../src/';
import schema from './helpers/schema';

const nothing = () => { };

test('fieldName is required', (t) => {
  const err = t.throws(() => plugin({ }, null));
  t.regex(err.message, /A value for "options.fieldName" must be provided/);
});

test('fieldName must be a string', (t) => {
  const err = t.throws(() => plugin({ }, { fieldName: 1 }));
  t.regex(err.message, /The value of "options.fieldName" must be a string/);
});

test('namespace must be a string', (t) => {
  const err = t.throws(() => plugin({ }, { fieldName: 'customerId', namespace: 1 }));
  t.regex(err.message, /The value of "options.namespace" must be a string/);
});

test('separator must be a string', (t) => {
  const err = t.throws(() => plugin({ }, { fieldName: 'customerId', namespace: 'cus', separator: 1 }));
  t.regex(err.message, /The value of "options.separator" must be a string/);
});

test('index must be an object or boolean', (t) => {
  const err = t.throws(() => plugin({ }, { fieldName: 'customerId', namespace: 'cus', separator: '-', index: 1 }));
  t.regex(err.message, /The value of "options.index" must be an object or a boolean/);
});

test('should add public id to the schema', (t) => {
  const onAdd = (fields) => {
    t.deepEqual(fields, { customerId: { type: String, required: true } });
  };

  plugin(schema(onAdd, nothing, nothing), {
    fieldName: 'customerId',
    namespace: 'cus'
  });
});

test('should create a default index', (t) => {
  const onIndex = (fields, options) => {
    t.deepEqual(fields, { customerId: 1 });
    t.deepEqual(options, { name: 'customerid_public_id', unique: true });
  };

  plugin(schema(nothing, onIndex, nothing), {
    fieldName: 'customerId',
    namespace: 'cus'
  });
});

test('should allow skipping index creation', (t) => {
  t.plan(0);
  const onIndex = () => {
    t.fail('Index should not be created');
  };

  plugin(schema(nothing, onIndex, nothing), {
    fieldName: 'customerId',
    namespace: 'cus',
    index: false
  });
});

test('should allow customizing the index', (t) => {
  const onIndex = (fields, options) => {
    t.deepEqual(fields, { customerId: 1 });
    t.deepEqual(options, { name: 'foo', unique: false });
  };

  plugin(schema(nothing, onIndex, nothing), {
    fieldName: 'customerId',
    namespace: 'cus',
    index: {
      name: 'foo',
      unique: false
    }
  });
});

test('should generate the public id', (t) => {
  const onPre = (type, func) => {
    if (type === 'save') {
      const model = { _id: '58e175ba8a7ca30011d39c8f' };
      func.call(model, () => {
        t.true(model.customerId.indexOf('cus_') === 0);
      });
    }
  };

  plugin(schema(nothing, nothing, onPre), {
    fieldName: 'customerId',
    namespace: 'cus'
  });
});

test('should not generate a public id if it already exists', (t) => {
  const onPre = (type, func) => {
    if (type === 'save') {
      const model = { _id: 1111, customerId: 'other-value' };
      func.call(model, () => {
        t.is(model.customerId, 'other-value');
      });
    }
  };

  plugin(schema(nothing, nothing, onPre), {
    fieldName: 'customerId',
    namespace: 'cus'
  });
});
