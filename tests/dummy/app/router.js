import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('index', { path: '/' });
  this.route('installation');
  this.route('how-to-use-it');
  this.route('service-class');
  this.route('global-prefixes');
  this.route('api-reference');
  this.route('tracked-in-local-storage-api');
  this.route('tracked-local-storage-service-api');
  this.route('application-tests');
});
