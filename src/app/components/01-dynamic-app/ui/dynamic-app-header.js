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
        ['CHANNEL_DYNAMIC_APP_ROUTE_CONFIG_UPDATED_EVENT', 'onRouteConfigUpdated']
    ];
  }

  onRouteConfigUpdated(e){
    const {routes} = e.props();
    console.log("dynamic app header listening to route update ", {routes,e});

    /*
    *
    * TODO: CREATE A HEADER CONTENT VIEW THAT RECREATES EACH TIME
    *
    * */

  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");
  }

}