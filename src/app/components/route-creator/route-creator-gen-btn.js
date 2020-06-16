import {ViewStream} from 'spyne';

export class RouteCreatorGenBtn extends ViewStream {

  constructor(props = {}) {
    props.id='route-gen-main-btn';
    props.template = require('./templates/route-creator-gen-btn.tmpl.html');
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