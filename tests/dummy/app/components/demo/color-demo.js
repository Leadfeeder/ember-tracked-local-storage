import Component from '@glimmer/component';
import { trackedInLocalStorage } from 'ember-tracked-local-storage';
import { action } from '@ember/object';

export default class ColorDemoComponent extends Component {
  colors = ['red', 'orange', 'yellow', 'green', 'indigo', 'pink'];

  @trackedInLocalStorage({
    defaultValue: 'red'
  })
  currentColor;

  @action
  changeColour() {
    this.currentColor = this._chooseRandomNewColor()
  }

  _chooseRandomNewColor() {
    const _colors = [...this.colors]
    _colors.splice(this.colors.indexOf(this.currentColor), 1);
    return _colors[Math.floor(Math.random() * _colors.length)];
  }
}