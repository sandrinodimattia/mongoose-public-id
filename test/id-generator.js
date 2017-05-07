import test from 'ava';
import idGenerator from '../src/id-generator';

test('should add a prefix using the namespace and separator', (t) => {
  const generator = idGenerator('cus', '-');
  const id = generator(1111);
  t.true(id.indexOf('cus-') === 0);
});

test('should not add a prefix if namespace is null', (t) => {
  const generator = idGenerator(null, '-');
  const id = generator(1111);
  t.true(id.length === 4);
});

test('should not add a prefix if namespace is empty', (t) => {
  const generator = idGenerator('', '-');
  const id = generator(1111);
  t.true(id.length === 4);
});

test('should fallback to default separator', (t) => {
  const generator = idGenerator('cus');
  const id = generator(1111);
  t.true(id.indexOf('cus_') === 0);
});
