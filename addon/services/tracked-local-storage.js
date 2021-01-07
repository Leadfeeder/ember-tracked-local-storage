import Service from '@ember/service';
import TrackedLocalStorage from 'ember-tracked-local-storage/utils/tracked-local-storage';
import { reads } from 'macro-decorators';
import { isEmpty } from '@ember/utils';

/**
 * TrackedLocalStorage Service designed to create an instance of the base TrackedLocalStorage class
 * for ember lifecycle management and provide shorthand access to the API.
 *
 * Also implements some extra features regarding prefixing values and validation messages.
 */

export default class TrackedLocalStorageService extends Service {
  /**
   * Creates the instance of the TrackedLocalStorage class
   */
  _trackedLocalStorage = new TrackedLocalStorage();

  /**
   * Array for storing the configured global prefixes to be applied to keys being saved and accessed
   */
  _globalPrefixes = [];

  /**
   * Shorthand access for the 'length' property of the TrackedLocalStorage
   */
  @reads('_trackedLocalStorage.length') length;

  /**
   * Shorthand access for the 'clear' method of the TrackedLocalStorage
   */
  clear = this._trackedLocalStorage.clear.bind(this._trackedLocalStorage);

  /**
   * Shorthand access for the 'key' method of the TrackedLocalStorage
   */
  key = this._trackedLocalStorage.key.bind(this._trackedLocalStorage);

  /**
   * Method used for adding or updating a global prefix. Orders the prefixes reverse alphabetically for consistency.
   *
   * @param {string} name
   * @param {string} value
   * @returns {void}
   */
  setGlobalPrefix(name, value) {
    const existingPrefix = this._globalPrefixes.find(({ prefixName }) => prefixName === name);
    if (existingPrefix) {
      existingPrefix.prefixValue = value;
    } else {
      this._globalPrefixes = [
        ...this._globalPrefixes,
        { prefixName: name, prefixValue: value }
      ].sort((a, b) => b.prefixName.localeCompare(a.prefixName));
    }
    // Ensure to trigger a rerender after prefix change so new values are taken into account
    this._trackedLocalStorage.triggerRerender();
  }

  /**
   * First validates the keyName then calls the 'getItem' method of
   * TrackedLocalStorage with the prefixed version of the keyName.
   *
   * @param {string} keyName
   * @param {string[]} skipPrefixes
   * @returns {void}
   */
  getItem(keyName, skipPrefixes) {
    try {
      this._validateKey(keyName);
      return this._trackedLocalStorage.getItem(this._getPrefixedKey(keyName, skipPrefixes));
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * First validates the keyName and value then calls the 'setItem' method of
   * TrackedLocalStorage with the prefixed version of the keyName.
   *
   * @param {string} keyName
   * @param {string} value
   * @param {string[]} skipPrefixes
   * @returns {void}
   */
  setItem(keyName, value, skipPrefixes) {
    try {
      this._validateKey(keyName);
      this._validateValue(value);
      this._trackedLocalStorage.setItem(this._getPrefixedKey(keyName, skipPrefixes), value);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * First validates the keyName and then calls the 'removeItem' method of
   * TrackedLocalStorage with the prefixed version of the keyName.
   *
   * @param {string} keyName
   * @param {string[]} skipPrefixes
   * @returns {void}
   */
  removeItem(keyName, skipPrefixes) {
    try {
      this._validateKey(keyName);
      this._trackedLocalStorage.removeItem(this._getPrefixedKey(keyName, skipPrefixes));
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Applies the prefixes stored in globalPrefixes array to a keyName, providing they
   * are not requested to be skipped
   *
   * @param {string} keyName
   * @param {string[]} skipPrefixes
   * @returns {string}
   */
  _getPrefixedKey(keyName, skipPrefixes = []) {
    return [
      ...this._globalPrefixes
        .map(({ prefixName, prefixValue }) => !skipPrefixes.includes(prefixName) && prefixValue)
        .filter(Boolean),
      keyName,
    ].join('.');
  }

  /**
   * Validates a keyName is present
   *
   * @param {string} keyName
   * @returns {void}
   */
  _validateKey(keyName) {
    if (isEmpty(keyName)) {
      throw new Error(`LocalStorage :: Key must not be empty.`);
    }
  }

  /**
   * Validates a value is present
   *
   * @param {string} value
   * @returns {void}
   */
  _validateValue(value) {
    if (isEmpty(value)) {
      throw new Error(`LocalStorage :: Value must not be empty.`);
    }
  }
}
