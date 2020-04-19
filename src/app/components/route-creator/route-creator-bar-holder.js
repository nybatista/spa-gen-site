import {ViewStream} from 'spyne';
import {RouteCreatorBarItemView} from './route-creator-bar-item-view';
import {RouteCreatorTraits} from '../../traits/route-creator-traits';
import {omit, compose, prop,keys, is, forEachObjIndexed} from 'ramda';

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

   // console.log("ROUTE BAR HOLDER LISTENS ",{vsid,isCurrentHolderEvent,holderId, barId, routeBarEvent,el})

  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  createBars(){
    const {props} = this;

    const createBar = (data)=>{
      data['initYPos'] = this.props.el.offsetHeight;
      this.routeCreator$CreateRouteBar(props, data);
      console.log("create bar ",this.props.vsid,this.props.el.offsetHeight);

    }

    const barItemsData = this.routeCreator$ConformBarItemsData();


    forEachObjIndexed(createBar, barItemsData);

    //console.log('bar holder data ', {barItemsData},this.props.data);

  //  this.routeCreator$CreateRouteBar();

  }

  onRendered() {
    this.addChannel("CHANNEL_ROUTE_CREATOR");
    if (this.props.data!==undefined) {
      this.createBars();
    }
  }

}