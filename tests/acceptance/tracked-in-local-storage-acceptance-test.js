import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { fillIn, visit, settled } from '@ember/test-helpers';
import { TEST_DEFAULT_VALUE, TEST_KEY_NAME } from 'dummy/components/test-component';

const page = {
  value: '[data-test-value]',
  input: '[data-test-value-input]',
};

function visitTestRoute() {
  return visit('/application-tests');
}

// eslint-disable-next-line max-lines-per-function
module('Acceptance | tracked local storage', function(hooks) {
  setupApplicationTest(hooks);

  let trackedLocalStorage;

  hooks.beforeEach(function() {
    trackedLocalStorage = this.owner.lookup('service:tracked-local-storage');
    trackedLocalStorage.clear();
  });

  test('basic getting and updating works and causes a template rerender', async function(assert) {
    const updatedValue = 'updated value';

    await visitTestRoute();

    assert.dom(page.value).hasText(TEST_DEFAULT_VALUE, 'it display default text');
    assert.notOk(trackedLocalStorage.getItem(TEST_KEY_NAME), 'value is not stored in local storage when default value is being used');

    await fillIn(page.input, updatedValue);

    assert.dom(page.value).hasText(updatedValue, 'the template has been rerendered with the updated text');
    assert.equal(trackedLocalStorage.getItem(TEST_KEY_NAME), updatedValue, 'value is stored in local storage when different to default value');
  });

  test('updating a global prefix correctly triggers a template rerender', async function(assert) {
    const testPrefixName = 'test-prefix-name';
    const updatedValue = 'updated value';
    trackedLocalStorage.setGlobalPrefix(testPrefixName, 1);

    await visitTestRoute();
    await fillIn(page.input, updatedValue);

    assert.dom(page.value).hasText(updatedValue, 'it shows the updated value when prefix matches');

    trackedLocalStorage.setGlobalPrefix(testPrefixName, 2);
    await settled();

    assert.dom(page.value).hasText(TEST_DEFAULT_VALUE, 'it reverts back to showing the default value when the prefix value changes');
  });

  test('removing a key reverts a value back to the default value triggers a template rerender', async function(assert) {
    const testPrefixName = 'test-prefix-name';
    const updatedValue = 'updated value';

    await visitTestRoute();
    await fillIn(page.input, updatedValue);

    assert.dom(page.value).hasText(updatedValue, 'it shows the updated value');

    trackedLocalStorage.removeItem(TEST_KEY_NAME);
    await settled();

    assert.dom(page.value).hasText(TEST_DEFAULT_VALUE, 'it reverts back to showing the default value when the key is removed');
  });
});
