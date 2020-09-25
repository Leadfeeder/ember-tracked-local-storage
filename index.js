'use strict';
/* global require, module */
module.exports = {
  name: require('./package').name,

  isDevelopingAddon: function() {
    return true;
  },
};
