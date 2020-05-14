import {ViewStream} from 'spyne';
import {DynamicAppHeaderContentView} from 'components/01-dynamic-app/ui/header/dynamic-app-header-content-view';
import {DynamicAppTraits} from 'traits/dynamic-app-traits';

export class DynamicAppHeader extends ViewStream {

  constructor(props = {}) {
    props.id='dynamic-app-header';
    props.traits = DynamicAppTraits;
    props.template = require('./templates/dynamic-app-header.tmpl.html')
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
        ['CHANNEL_DYNAMIC_APP_ROUTE_PAGE_CHANGE_EVENT', 'onRouteChangeEvent'],
        ['CHANNEL_DYNAMIC_APP_ROUTE_CONFIG_UPDATED_EVENT', 'onRouteConfigUpdated'],
    ];
  }

  onChannelUI(e){
    const {action,routeData, pageId} = e.props();
    console.log("CHANNEL _UI IS ",{action,routeData});
  }

  onRouteChangeEvent(e){
    const {isDeepLink, routeData} = e.props();
    const {pageId} = routeData;

    if (isDeepLink===true) {
      const routes = this.dynApp$GetCurrentRouteJson();
      this.appendView(new DynamicAppHeaderContentView({routes}), 'header');
    }

    const activeSel = `nav > [data-page-id='${pageId}']`;
    this.props.el$('nav > a').setActiveItem('selected', activeSel);

  }


  onRouteConfigUpdated(e){
    const {routes, updateConfigNum} = e.props();
    //console.log("dynamic app header listening to route update ", {routes,e});

    this.appendView(new DynamicAppHeaderContentView({routes, updateConfigNum}), 'header');



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