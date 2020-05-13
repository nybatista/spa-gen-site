import {ViewStream} from 'spyne';

export class DynamicAppSubnav extends ViewStream {

  constructor(props = {}) {
    props.class='dynamic-app-subnav';
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