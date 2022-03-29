// ember-cli-build.js
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const isProduction = EmberAddon.env() === 'production';

const purgeCSS = {
  module: require('@fullhuman/postcss-purgecss'),
  options: {
    content: [
      // add extra paths here for components/controllers which include tailwind classes
      './tests/dummy/app/templates/**/*.hbs',
      './tests/dummy/app/components/**/*.hbs',
      './tests/dummy/app/components/demo/color-demo.js',
    ],
    safelist: ['body', 'html'],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
  }
}

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    postcssOptions: {
      compile: {
        plugins: [
          {
            module: require('postcss-import'),
            options: {
              path: ['node_modules']
            }
          },
          require('tailwindcss')('./tailwind.config.js'),
          ...isProduction ? [purgeCSS] : []
        ]
      }
    }
  });
  return app.toTree();
};
