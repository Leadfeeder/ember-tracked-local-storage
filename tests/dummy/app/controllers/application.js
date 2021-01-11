import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  introductionRoutes = [
    { route: 'index', name: 'Introduction' },
    { route: 'installation', name: 'Installation' },
    { route: 'how-to-use-it', name: 'How to use it' },
    { route: 'service-class', name: 'Tracked local storage service' },
    { route: 'global-prefixes', name: 'Global prefixes' },
  ];

  apiReferenceRoutes = [
    { route: 'tracked-in-local-storage-api', name: 'trackedInLocalStorage' },
    { route: 'tracked-local-storage-service-api', name: 'trackedLocalStorage' },
  ];

  get allRoutes() {
    return [...this.introductionRoutes, ...this.apiReferenceRoutes];
  }
};
