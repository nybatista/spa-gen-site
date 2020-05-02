import {ViewStream} from 'spyne';
import {RouteCreateBarHolder} from 'components/route-creator/route-creator-bar-holder';
import {RouteCreatorTraits} from 'traits/route-creator-traits';
import {RouteAnimTraits} from 'traits/route-anim-traits';

export class RouteCreatorMainView extends ViewStream {

  constructor(props = {}) {
    props.id = 'route-creator-main';
    props.traits = [RouteCreatorTraits, RouteAnimTraits]
    props.template = require('./templates/route-creator-main.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
        ["CHANNEL_ROUTEGEN_JSON_DATA_EVENT", 'onRouteGenData'],
      ['CHANNEL_ROUTE_CREATOR_ROUTE_LASTITEM_RENDERED_EVENT', 'routeAnim$InitBarItemsAnimation']

    ];
  }



  onRouteGenData(e){
    const {routes} = e.props();
    this.props.data = routes;
    this.createMainBarHolder();

  }

  broadcastEvents() {
    return [
        ['.btn.btn-blue.route-bar-btn', 'click']
    ];
  }

  createMainBarHolder(){
    this.props.routeLevel = -1;
    this.routeCreator$CreateRouteBarHolder();
  }

  onRendered() {
    this.addChannel("CHANNEL_ROUTEGEN_JSON");
    this.addChannel("CHANNEL_ROUTE_CREATOR");
    this.routeCreator$InitBarItem();

  }

}