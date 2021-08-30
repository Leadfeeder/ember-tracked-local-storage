ember-tracked-local-storage
==============================================================================

An addon to allow the use of local storage values to use glimmer tracking and cause template re-renders on updates.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.12 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-tracked-local-storage
```

Usage
------------------------------------------------------------------------------

Simple use case:
```
import Component from '@glimmer/component';
import { trackedInLocalStorage } from 'ember-tracked-local-storage';

export default class DemoComponent extends Component {
  @trackedInLocalStorage() someProperty;
}
```

Full guides can be found on the [documentation site](https://leadfeeder.github.io/ember-tracked-local-storage).



Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
