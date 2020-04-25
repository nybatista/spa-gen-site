import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {RouteCreatorBarItemView} from './route-creator-bar-item-view';
import {RouteCreatorTraits} from 'traits/route-creator-traits';
import {RouteAnimTraits} from 'traits/route-anim-traits';
import {omit, compose, prop,keys, is, forEachObjIndexed} from 'ramda';

export class RouteCreateBarHolder extends ViewStream {

  constructor(props = {}) {
    props.tagName='ul';
    props.traits=[RouteCreatorTraits, RouteAnimTraits]
    props.class=props.isMainHolder === true ? 'route-bar-items-list main' : 'route-bar-items-list';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    const {vsid} = this.props;
    const checkVsidPayloadFilter = new ChannelPayloadFilter({propFilters:{
      parentVsid: vsid
      }});
    return [
/*
      ['CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT', 'onRouteBarClickedEvent'],
*/
      ['CHANNEL_ROUTE_CREATOR_DRAG_START_EVENT', 'onDragStartEvent',checkVsidPayloadFilter],
      ['CHANNEL_ROUTE_CREATOR_DRAGGING_EVENT', 'onDraggingEvent',checkVsidPayloadFilter],
      ['CHANNEL_ROUTE_CREATOR_DRAG_END_EVENT', 'onDragEndEvent',checkVsidPayloadFilter]
    ];
  }

  onDragStartEvent(e){

    //const items = this.routeCreator$GetListItems$();
    const {dragVsid} = e.props();

    //console.log("draging ",{e},this.props.vsid,{dragVsid});
    this.routeAnim$StartBarPosWatcher(dragVsid);

  }

  onDraggingEvent(e){
    const {dragYPos,dragVsid} = e.props();
    console.log("DRAGGING ",{dragYPos, dragVsid});
  }
  onDragEndEvent(){
    console.log("DRAG END ",this.props.vsid);

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

  createBars(){
    const {props} = this;
    const createBar = (data)=>{
      data['initYPos'] = this.props.el.offsetHeight;
      this.routeCreator$CreateRouteBar(props, data);
      //console.log("create bar ",this.props.vsid,this.props.el.offsetHeight);
    }
    const barItemsData = this.routeCreator$ConformBarItemsData();
    forEachObjIndexed(createBar, barItemsData);

  }

  onRendered() {
    this.addChannel("CHANNEL_ROUTE_CREATOR");
    if (this.props.data!==undefined) {
      this.createBars();
    }



  }

}