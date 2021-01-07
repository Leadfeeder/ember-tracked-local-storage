import normalizeFromString from 'ember-tracked-local-storage/utils/normalize-from-string';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

/* eslint-disable max-lines-per-function */
module('Unit | Utility | normalize from string', function(hooks) {
  setupTest(hooks);

  test('normalizeFromString works', function(assert) {
    assert.equal(normalizeFromString.boolean('true'), true);
    assert.equal(normalizeFromString.boolean('false'), false);
    assert.equal(normalizeFromString.boolean('foo'), true);

    assert.deepEqual(normalizeFromString.object('{}'), {});
    assert.deepEqual(normalizeFromString.object('{"a":true}'), { a: true });

    assert.deepEqual(normalizeFromString.array('[]'), []);
    assert.deepEqual(normalizeFromString.array('[1, 2, 3]'), [1, 2, 3]);

    assert.equal(normalizeFromString.number('1'), 1);
    assert.equal(normalizeFromString.number('0'), 0);
    assert.ok(isNaN(normalizeFromString.number('foo')));
    assert.equal(normalizeFromString.number(''), 0);
    assert.equal(normalizeFromString.number('1.2345'), 1.2345);
    assert.equal(normalizeFromString.number('Infinity'), Infinity);

    assert.equal(normalizeFromString.integer('1.2345'), 1);
    assert.equal(normalizeFromString.integer('1'), 1);
    assert.equal(normalizeFromString.integer('0'), 0);
    assert.ok(isNaN(normalizeFromString.integer('')));
    assert.ok(isNaN(normalizeFromString.integer('foo')));
    assert.ok(isNaN(normalizeFromString.integer('Infinity')));

    assert.equal(normalizeFromString.string('foo'), 'foo');
    assert.equal(normalizeFromString.string(''), '');
  });
});
