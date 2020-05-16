import {ViewStream} from 'spyne';
import {RouteCreateBarHolder} from 'components/route-creator/route-creator-bar-holder';
import {RouteCreatorTraits} from 'traits/route-creator-traits';
import {RouteAnimTraits} from 'traits/route-anim-traits';
import {elementAt} from 'rxjs/operators';

export class RouteCreatorMainView extends ViewStream {

  constructor(props = {}) {
    props.id = 'route-creator-main';
    props.traits = [RouteCreatorTraits, RouteAnimTraits]
    props.data = props.data!==undefined ? props.data : {};
    props.data.holderId = props.data.holderId!==undefined ? props.data.holderId : 'main';
    props.template = require('./templates/route-creator-main.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
/*
      ["CHANNEL_ROUTEGEN_JSON_DATA_EVENT", 'onRouteGenData'],
*/

       ['CHANNEL_ROUTE_CREATOR_GENERATE_DEFAULT_JSON_EVENT', 'onResetDefaultJson'],
      ['CHANNEL_ROUTE_CREATOR_ROUTE_LASTITEM_RENDERED_EVENT', 'routeAnim$InitBarItemsAnimation'],
      ['CHANNEL_ROUTE_CREATOR_ITEM_ADDED_EVENT', 'onItemAdded'],
      ['CHANNEL_ROUTE_CREATOR_ITEM_REMOVED_EVENT', 'onItemAdded']
    ];
  }

  onResetDefaultJson(e){
    //console.log("RESET DEFAULT JSON -- RETRIEVE DATA AND RELOAD BARS ",e);

    this.setTimeout(this.onRouteGenData.bind(this), 500);
   //onRouteGenData

  }

  onItemAdded(e){
    //console.log("E IS ",e);
    const minHeight = 600;

    const delayer = ()=> {
      const elArr = this.props.el$('.route-bar-items-list.main li').arr;
      const elItemIndex = elArr.length > 2 ? elArr.length - 2 : 1;
      const secondToLastEl = elArr[elItemIndex];

      const box = secondToLastEl.getBoundingClientRect();
      const newHeight = box.y + box.height * 2;
      const mainHeight = newHeight <= minHeight ? minHeight : newHeight;
      const newHeightStr = `height:${mainHeight}px;`;
      const mainEl = document.getElementById('customize-container');
      mainEl.style.cssText = newHeightStr
     // console.log("ITEM IS ", {e,newHeight, newHeightStr, elItemIndex, elArr, box, secondToLastEl}, this.props.el);

    }

    this.setTimeout(delayer, 0);

  }



  onRouteGenData(e){
   // const {routes} = e.props();
    //this.props.data = routes;

    const routeData = RouteCreatorTraits.routeCreator$GetRouteDataFromConfig();
    const {routes} = routeData;
    this.props.data = routes;

    this.createMainBarHolder();

  }

  broadcastEvents() {
    return [
        ['.btn.btn-blue.main-route-btn', 'click'],
    ];
  }

  createMainBarHolder(){
    this.props.routeLevel = -1;
    this.routeCreator$CreateRouteBarHolder();
    this.routeCreator$CreateRouteName();
    this.props.el$('.main > li:first-child').addClass('disabled');

    console.log("MAIN VIEW ",this.props.el$("#route-creator-container > .route-creator-route-name input").addClass('disabled'));
   // this.props.el$('input.main-input').addClass('disabled');


  }

  onRendered() {
   // this.addChannel("CHANNEL_ROUTEGEN_JSON");
    this.addChannel("CHANNEL_ROUTE_CREATOR");
    this.routeCreator$InitBarItem();
    this.setTimeout(this.onRouteGenData.bind(this),10);

  }

}