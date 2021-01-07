import Component from '@glimmer/component';
import { trackedInLocalStorage } from 'ember-tracked-local-storage';
import { action } from '@ember/object';

export const TEST_DEFAULT_VALUE = 'test default value';
export const TEST_KEY_NAME = 'test-key-name';

export default class TestComponent extends Component {
  @trackedInLocalStorage({
    defaultValue: TEST_DEFAULT_VALUE,
    keyName: TEST_KEY_NAME,
  })
  testValue;

  @action
  updateTestValue(value) {
    this.testValue = value;
  }
}
