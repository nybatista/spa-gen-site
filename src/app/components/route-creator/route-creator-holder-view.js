import {ViewStream} from 'spyne';

export class RouteCreatorHolderView extends ViewStream {

  constructor(props = {}) {
    props.id = 'route-creator-holder';
    props.template = require('./templates/route-creator-holder.tmpl.html');
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

  }

}