import macro from 'macro-decorators';
import { isNone } from '@ember/utils';
import { getOwner } from '@ember/application';
import normalizeFromString from 'ember-tracked-local-storage/utils/normalize-from-string';

/**
 * Core macro used for decorating a property to be synced with and tracked in local storage
 *
 * @param {object} params
 * @param {string} params.keyName a custom keyName to be used instead of the property name
 * @param {string} params.format the format the value should be parsed as
 * @param {string} params.defaultValue the default value, which won't be stored in browser storage
 * @param {string[]} params.skipPrefixes an array telling which globally set prefixes should be ignored
 * @returns {macro}
 */
export function trackedInLocalStorage({ keyName, format = 'string', defaultValue = '', skipPrefixes = [] } = {}) {
  return macro({
    get(obj, key) {
      return localStorageGet.call(this, { keyName: keyName || key, format, defaultValue, skipPrefixes });
    },

    set(obj, key, value) {
      return localStorageSet.call(this, { keyName: keyName || key, defaultValue, value, skipPrefixes });
    },
  });
}

/**
 * Gets the requested key's value from local storage or takes the default value if none existing
 *
 * @param {object} params
 * @param {string} params.keyName
 * @param {string} params.format
 * @param {string} params.defaultValue
 * @param {string[]} params.skipPrefixes
 * @returns {string}
 */
export function localStorageGet({ keyName, format, defaultValue, skipPrefixes }) {
  const lsValue = _getTrackedLocalStorageService(this).getItem(keyName, skipPrefixes);
  return isNone(lsValue) ? defaultValue : normalizeFromString[format](lsValue);
}

/**
 * Sets the requested key's value in local storage or removes it if default value is being used
 *
 * @param {object} params
 * @param {string} params.keyName
 * @param {string} params.format
 * @param {string} params.defaultValue
 * @param {string} params.value
 * @param {string[]} params.skipPrefixes
 * @returns {string}
*/
export function localStorageSet({ keyName, defaultValue, value, skipPrefixes }) {
  const trackedLocalStorage = _getTrackedLocalStorageService(this);

  if (value === defaultValue || value === undefined) {
    trackedLocalStorage.removeItem(keyName, skipPrefixes);
  } else {
    trackedLocalStorage.setItem(keyName, value, skipPrefixes);
  }

  return value;
}

/**
 * Gets the tracked local storage service
 */
function _getTrackedLocalStorageService(context) {
  // getOwner doesn't work in tests, but luckily, we can just pick the owner from the `context`
  const owner = context.owner || getOwner(context);
  return owner.lookup('service:tracked-local-storage');
}
