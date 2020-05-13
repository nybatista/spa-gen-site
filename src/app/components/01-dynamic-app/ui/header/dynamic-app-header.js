import {ViewStream} from 'spyne';
import {DynamicAppHeaderContentView} from 'components/01-dynamic-app/ui/header/dynamic-app-header-content-view';

export class DynamicAppHeader extends ViewStream {

  constructor(props = {}) {
    props.id='dynamic-app-header';
    props.template = require('./templates/dynamic-app-header.tmpl.html')
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
        ['CHANNEL_DYNAMIC_APP_ROUTE_CONFIG_UPDATED_EVENT', 'onRouteConfigUpdated'],
        ['CHANNEL_ROUTE_.*_EVENT', 'onChannelUI']
    ];
  }

  onChannelUI(e){
    const {action,routeData} = e.props();
    console.log("CHANNEL _UI IS ",{action,routeData});
  }


  onRouteConfigUpdated(e){
    const {routes} = e.props();
    //console.log("dynamic app header listening to route update ", {routes,e});

    this.appendView(new DynamicAppHeaderContentView({routes}), 'header');



  }

  broadcastEvents() {
    // return nexted array(s)
    return [
        ['a', 'click']

    ];
  }

  onRendered() {
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");
    this.addChannel("CHANNEL_ROUTE");
  }

}