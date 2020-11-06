import { module, test } from 'ember-qunit';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { setupRenderingTest } from 'ember-qunit';

/* eslint-disable max-lines-per-function */
module('Unit | Service | tracked local storage', function(hooks) {
  setupRenderingTest(hooks);
  setupWindowMock(hooks);

  let trackedLocalStorage;
  const testKey = 'test-key';
  const testValue = 'test-value';

  function setTestPrefixes() {
    trackedLocalStorage.setGlobalPrefix('user', 1);
    trackedLocalStorage.setGlobalPrefix('account', 2);
  }

  hooks.beforeEach(function() {
    trackedLocalStorage = this.owner.lookup('service:tracked-local-storage');
    trackedLocalStorage.clear();
  });

  test('it sets and gets an item properly', function(assert) {
    trackedLocalStorage.setItem(testKey, testValue);

    assert.equal(trackedLocalStorage.getItem(testKey), testValue, 'it set the item properly');
  });

  test('it removes an item properly', function(assert) {
    trackedLocalStorage.setItem(testKey, testValue);
    trackedLocalStorage.removeItem(testKey);

    assert.equal(trackedLocalStorage.getItem(testKey), null, 'it returns null when getting a removed item');
  });

  test('it returns the correct length of items in storage', function(assert) {
    trackedLocalStorage.setItem('1', testValue);
    trackedLocalStorage.setItem('2', testValue);

    assert.equal(trackedLocalStorage.length, 2, 'it returns correct amount of items');

    trackedLocalStorage.setItem('3', testValue);

    assert.equal(trackedLocalStorage.length, 3, 'it returns correct amount of items');
  });

  test('it returns the correct key', function(assert) {
    trackedLocalStorage.setItem(testKey, testValue);

    assert.equal(trackedLocalStorage.key(0), testKey, 'it returns the correct value of the index passed in');
  });

  test('it clears all items properly', function(assert) {
    trackedLocalStorage.setItem('1', testValue);
    trackedLocalStorage.setItem('2', testValue);
    trackedLocalStorage.clear();

    assert.equal(trackedLocalStorage.getItem('1'), null, 'first cell has been removed');
    assert.equal(trackedLocalStorage.getItem('2'), null, 'second cell has been removed');
    assert.equal(trackedLocalStorage.length, 0, 'length is 0');
  });

  function assertSkipPrefixesWorks(assert, { skipPrefixes, expectedKey, label }) {
    trackedLocalStorage.setItem(testKey, testValue, skipPrefixes);
    let storedValue = window.localStorage.getItem(expectedKey);
    assert.equal(storedValue, testValue, `set value is correct when skipping ${skipPrefixes} prefix`);

    storedValue = trackedLocalStorage.getItem(testKey, skipPrefixes);
    assert.equal(storedValue, testValue, `get value is correct when skipping ${skipPrefixes} prefix`);

    trackedLocalStorage.removeItem(testKey, skipPrefixes);
    storedValue = window.localStorage.getItem(expectedKey);
    assert.equal(storedValue, undefined, `stored value is removed when skipping ${skipPrefixes} prefix`);
  }

  test('it allows skipping prefixes via options', function(assert) {
    setTestPrefixes();

    // Skip user
    assertSkipPrefixesWorks(assert, {
      skipPrefixes: ['user'],
      expectedKey: `2.${testKey}`,
      label: 'user' }
    )

    // Skip account
    assertSkipPrefixesWorks(assert, {
      skipPrefixes: ['account'],
      expectedKey: `1.${testKey}`,
      label: 'account' }
    )

    // Skip all
    assertSkipPrefixesWorks(assert, {
      skipPrefixes: ['account', 'user'],
      expectedKey: testKey,
      label: 'all'
    })
  });
});