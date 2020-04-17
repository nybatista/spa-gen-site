import {ViewStream} from 'spyne';
import {RouteCreateBarHolder} from './route-creator-bar-holder';
import {RouteCreatorTraits} from '../../traits/route-creator-traits';
export class RouteCreatorMainView extends ViewStream {

  constructor(props = {}) {
    props.id = 'route-creator-main';
    props.traits = [RouteCreatorTraits]
    props.template = require('./templates/route-creator-main.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [];
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.props.routeLevel = -1;
    this.routeCreator$CreateRouteBarHolder();
  }

}