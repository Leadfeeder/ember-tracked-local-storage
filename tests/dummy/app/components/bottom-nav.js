import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class BottomNavComponent extends Component {
  @service router;

  get currentRouteIndex() {
    const currentRoute = this.args.routes.find(({ route }) => this.router.currentRouteName === route);
    return this.args.routes.indexOf(currentRoute);
  }

  get previousRoute() {
    return this.args.routes[this.currentRouteIndex - 1];
  }

  get nextRoute() {
    return this.args.routes[this.currentRouteIndex + 1];
  }
}
