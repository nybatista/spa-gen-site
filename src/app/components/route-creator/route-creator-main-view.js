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
        ["CHANNEL_ROUTEGEN_JSON_DATA_EVENT", 'onRouteGenData']

    ];
  }

  onRouteGenData(e){
    const {routes} = e.props();
    this.props.data = routes;
    console.log('route gen data received ',{routes,e});
    this.createMainBarHolder();

  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  createMainBarHolder(){
    this.props.routeLevel = -1;

    //console.log('routeBarItems Data ',{routeBarItemsData})
   // forEachObjIndexed(addBarItems, routeBarItemsData);
    this.routeCreator$CreateRouteBarHolder();
  }

  onRendered() {
    this.addChannel("CHANNEL_ROUTEGEN_JSON")

      //const delayer=()=> this.routeAnim$InitBarItensAnimation();
      //window.setTimeout(delayer,30);
      this.setTimeout(this.routeAnim$InitBarItemsAnimation, 150, true);

  }

}