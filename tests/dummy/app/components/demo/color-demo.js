import Component from '@glimmer/component';
import { trackedInLocalStorage } from 'ember-tracked-local-storage';
import { action } from '@ember/object';

export default class ColorDemoComponent extends Component {
  colors = [
    'bg-red-400',
    'bg-orange-400',
    'bg-yellow-400',
    'bg-green-400',
    'bg-indigo-400',
    'bg-pink-400'
  ];

  @trackedInLocalStorage({
    defaultValue: 'bg-red-400'
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