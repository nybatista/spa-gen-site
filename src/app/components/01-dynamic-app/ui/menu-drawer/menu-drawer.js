import {DomEl, ViewStream} from 'spyne';
import {MenuDrawerContent} from 'components/01-dynamic-app/ui/menu-drawer/menu-drawer-content';
import {DynamicAppTraits} from 'traits/dynamic-app-traits';
import {DynamicAppHeaderContentView} from 'components/01-dynamic-app/ui/header/dynamic-app-header-content-view';

export class MenuDrawer extends ViewStream {

  constructor(props = {}) {
    props.id = 'menu-drawer';
    props.class = 'menu-drawer';
    props.data = DynamicAppTraits.dynApp$FormatRouteConfigForMenuDrawer();

    //console.log("PROPS DATA IS ",props.data);
  //  props.template = require('./templates/menu-drawer.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ["CHANNEL_MENU_DRAWER_.*_EVENT", "onShowMenuDrawerEvent"],
      ['CHANNEL_DYNAMIC_APP_ROUTE_PAGE_CHANGE_EVENT', 'onRouteChangeEvent'],
      ['CHANNEL_DYNAMIC_APP_ROUTE_CONFIG_UPDATED_EVENT', 'onRouteConfigUpdated']
    ];
  }

  onRouteChangeEvent(e){
    const {isDeepLink, routeData} = e.props();
    const {pageId} = routeData;

    if (isDeepLink===true) {
     // const routes = this.dynApp$GetCurrentRouteJson();
      console.log("MENU DRAWER DEEP LINK");
      this.appendView(new MenuDrawerContent());
    }


  }

  onRouteConfigUpdated(e){
    const {routes, updateConfigNum} = e.props();
    //console.log("dynamic app header listening to route update ", {routes,e});

    this.appendView(new MenuDrawerContent({routes, updateConfigNum}), 'header');





  }


  onShowMenuDrawerEvent(e){
    const {action} = e.props();
    const showDrawer = action === 'CHANNEL_MENU_DRAWER_SHOW_EVENT';
    this.props.el$.toggleClass('open', showDrawer);

  }




  broadcastEvents() {
    // return nexted array(s)
    return [];
  }



  onRendered() {
   // this.addAnchors();
    //console.log("MENU DRAWER");
   // this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");

    this.addChannel('CHANNEL_MENU_DRAWER');

  }

}