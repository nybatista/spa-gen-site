import {ViewStream} from 'spyne';
import {RouteCreatorTraits} from 'traits/route-creator-traits';
import {RouteBarDragTraits} from 'traits/route-bar-drag-traits';
import {gsap} from 'gsap/all';

export class RouteCreatorBarItemView extends ViewStream {

  constructor(props = {}) {
    props.tagName = 'li';
    props.class=`route-creator-bar-item route-level-${props.routeLevel} group-${props.parentVsid}`;
    props.traits = [RouteCreatorTraits,RouteBarDragTraits];
    props.data.holderId = props.parentVsid;
    props.template=require('./templates/route-creator-bar-item.tmpl.html');
    //console.log("BAR ITEM PROPS ",props);
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [];
  }

  broadcastEvents() {
    // return nexted array(s)
    return [
        [this.props.id$+' > section .icons i', 'click'],
        [this.props.id$+' > section .icons p', 'click']
    ];
  }

  initBar(){

  }

  sendLastItemRenderedEvent(){

    const {vsid, parentVsid} = this.props;
    const action = 'CHANNEL_ROUTE_CREATOR_ROUTE_LASTITEM_RENDERED_EVENT';
    const channel = 'CHANNEL_ROUTE_CREATOR';
    this.sendInfoToChannel(channel, {vsid, parentVsid,action}, action);

  }

  onRendered() {
    if (this.props.routeLevel<=0){
      this.routeCreator$CreateRouteBarHolder();
    }


    this.routeCreator$InitBarItem();
    this.routeBarDrag$InitDraggable();
    if (this.props.data.isLastItem===true){
      this.sendLastItemRenderedEvent();
    }

  }

}