import { tracked } from '@glimmer/tracking';
import { reads } from 'macro-decorators';

export const DOES_NOT_EXIST = Symbol();

/**
 * Core TrackedLocalService implementation - designed to be ember agnostic.
 *
 * The purpose of this class is to provide a layer on top of the browser local storage
 * that implements the exact same API, but stores an internal cellsMap object which dynamically
 * creates and holds copies of the values in the browser storage as 'Cell's, with the intention
 * that these cell values can be marked as tracked and trigger template rerenders as necessary.
 */

class Cell {
  @tracked value;
}

export default class TrackedLocalStorage {
  /**
   * Accessing the browser local storage
   */
  _localStorage = window.localStorage;

  /**
   * Internal map for mirroring the values stored in browser local storage, but with tracked values
   */
  _cellsMap = {};

  /**
   * Exposes the 'length' property of the browser local storage
   */
  @reads('_localStorage.length') length;

  /**
   * Exposes the 'key' method of the browser local storage
   *
   * @param {number} keyNumber
   * @returns {string}
   */
  key = this._localStorage.key.bind(this._localStorage);

  /**
   * Imitates the 'getItem' method of the browser local storage,
   * but returns the tracked value stored in the cellsMap
   *
   * @param {keyName} string
   * @returns {null|string}
   */
  getItem(keyName) {
    const { value } = this._getCell(keyName);

    if (value === DOES_NOT_EXIST) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  /**
   * Imitates the 'setItem' method of the browser local storage,
   * but also sets the stringified value in the internal cellsMap
   *
   * @param {keyName} string
   * @returns {void}
   */
  setItem(keyName, value) {
    const serializedValue = JSON.stringify(value);
    this._getCell(keyName).value = serializedValue;
    this._localStorage.setItem(keyName, serializedValue);
  }

  /**
   * Imitates the 'removeItem' method of the browser local storage,
   * but ensures the tracked value in the cellsMap also gets wiped
   *
   * @param {keyName} string
   * @returns {void}
   */
  removeItem(keyName) {
    const storageVal = this.getItem(keyName);

    if (storageVal !== null) {
      // wipe out the cell value if it exists
      this._dirtyCell(this._getCell(keyName));
      this._localStorage.removeItem(keyName);
    }
  }

  /**
   * Imitates the 'clear' method of the browser local storage,
   * but ensures the all tracked value in the cellsMap get wiped
   *
   * @param {keyName} string
   * @returns {void}
   */
  clear() {
    // Dirty every cell
    Object.values(this._cellsMap).forEach(this._dirtyCell);

    // Actually clear
    this._localStorage.clear();
  }

  /**
   * Forces a manual rerender by setting each tracked value to itself
   *
   * @returns {void}
   */
  triggerRerender() {
    Object.values(this._cellsMap).forEach((cell) => {
      const x = cell.value;
      cell.value = x;
    });
  }

  /**
   * Gets the requested keyName value from the internal cellsMap.
   * If this doesn't yet exist, creates it with the browser storage value
   * for that keyName, or use the Symbol designed to mark it as not existing
   *
   * @param {keyName} string
   * @returns {Cell}
   */
  _getCell(keyName) {
    let cell = this._cellsMap[keyName];

    if (cell === undefined) {
      const storageVal = this._localStorage.getItem(keyName);
      cell = new Cell();
      cell.value = storageVal ?? DOES_NOT_EXIST;
      this._cellsMap[keyName] = cell;
    }

    return cell;
  }

  /**
   * Manually wipe the content of a cell to trigger a tracking update
   *
   * @param {Cell} cell
   * @returns {void}
   */
  _dirtyCell(cell) {
    // dirty the cell by setting it to a new value
    cell.value = null;
  }
}
