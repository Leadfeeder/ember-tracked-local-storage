import { trackedInLocalStorage } from 'ember-tracked-local-storage/utils/tracked-in-local-storage';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';

/* eslint-disable max-lines-per-function */
module('Unit | Utility | tracked in local storage decorator', function(hooks) {
  setupTest(hooks);

  const testDefaultValue = 'test-default-value';
  const testKeyName = 'test-key';
  let trackedLocalStorage;

  function registerService({ keyName = testKeyName, defaultValue = testDefaultValue, skipPrefixes = [], format } = {}) {
    this.owner.register('service:test-service', class DummyService extends Service {
      @trackedInLocalStorage({
        defaultValue,
        keyName,
        skipPrefixes,
        format,
      })
      syncedProp;
    });
    return this.owner.lookup('service:test-service');
  }

  hooks.beforeEach(async function() {
    trackedLocalStorage = this.owner.lookup('service:tracked-local-storage');
    trackedLocalStorage.clear();
  });

  test('defaultValue syncWithLocalStorage works', function(assert) {
    let service = registerService.call(this);
    assert.equal(service.syncedProp, testDefaultValue, 'When LS has nothing, defaultValue is used');
    const valueFromLS = 'test-value-from-ls';
    trackedLocalStorage.setItem(testKeyName, valueFromLS);
    assert.equal(service.syncedProp, valueFromLS, 'Value from LS is used when available');
  });

  test('setting the macro will save the value to localStorage', function(assert) {
    let service = registerService.call(this);
    assert.notOk(trackedLocalStorage.getItem(testKeyName), 'There is no value in LS yet');

    const newValue = 'test-new-value';
    service.syncedProp = newValue;
    assert.equal(trackedLocalStorage.getItem(testKeyName), newValue, 'The value in LS has been updated');
    assert.equal(service.syncedProp, newValue, 'The getter also returns new value now');
  });

  test('normalization works in the macro', function(assert) {
    const booleanKey = 'test-key-boolean';
    let service = registerService.call(this, { keyName: booleanKey, format: 'boolean' });

    assert.notOk(trackedLocalStorage.getItem(booleanKey), 'There is no value in LS yet');
    trackedLocalStorage.setItem(booleanKey, true);
    assert.equal(service.syncedProp, true, 'The value is normalized from string to boolean');
  });
});