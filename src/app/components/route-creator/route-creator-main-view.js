import {ViewStream} from 'spyne';
import {RouteCreateBarHolder} from './route-creator-bar-holder';

export class RouteCreatorMainView extends ViewStream {

  constructor(props = {}) {
    props.id = 'route-creator-main';
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
    this.appendView(new RouteCreateBarHolder());
  }

}