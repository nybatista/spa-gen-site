import {ViewStream} from 'spyne';

export class DynamicAppHeader extends ViewStream {

  constructor(props = {}) {
    props.id='dynamic-app-header';
    props.template = require('./templates/dynamic-app-header.tmpl.html')
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
        ['CHANNEL_ROUTE_CONFIG_UPDATED_EVENT', 'onRouteConfigUpdated']
    ];
  }

  onRouteConfigUpdated(e){
    console.log("dynamic app is updated on route ",e);
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.addChannel("CHANNEL_ROUTE");
  }

}