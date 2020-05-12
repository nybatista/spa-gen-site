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
        ['CHANNEL_ROUTE_CHANGE_EVENT', 'onChannelUI']
    ];
  }

  onChannelUI(e){
    const {routeData} = e.props();
    console.log("CHANNEL _UI IS ",{routeData});
  }


  onRouteConfigUpdated(e){
    const {routes} = e.props();
    //console.log("dynamic app header listening to route update ", {routes,e});

    const data = routes;
    this.appendView(new DynamicAppHeaderContentView({data}), 'header');



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