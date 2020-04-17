import {ViewStream} from 'spyne';
import {RouteCreatorBarItemView} from './route-creator-bar-item-view';
import {RouteCreatorTraits} from '../../traits/route-creator-traits';

export class RouteCreateBarHolder extends ViewStream {

  constructor(props = {}) {
    props.tagName='ul';
    props.traits=[RouteCreatorTraits]
    props.class=props.isMainHolder === true ? 'route-bar-items-list main' : 'route-bar-items-list';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
        ['CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT', 'onRouteBarClickedEvent']
    ];
  }

  onRouteBarClickedEvent(e){
    const {holderId, barId, routeBarEvent} = e.props();
    const {vsid,el}=this.props;
    const isCurrentHolderEvent = holderId === vsid;

    console.log("ROUTE BAR HOLDER LISTENS ",{vsid,isCurrentHolderEvent,holderId, barId, routeBarEvent,el})

  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.addChannel("CHANNEL_ROUTE_CREATOR");
    this.routeCreator$CreateRouteBar();
  }

}