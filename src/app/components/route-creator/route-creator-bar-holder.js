import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {RouteCreatorBarItemView} from './route-creator-bar-item-view';
import {RouteCreatorTraits} from 'traits/route-creator-traits';
import {RouteAnimTraits} from 'traits/route-anim-traits';
import {FiltersTrait} from 'traits/filters-trait';
import {omit, compose, prop,keys, is, forEachObjIndexed} from 'ramda';
import {gsap} from 'gsap/all';

export class RouteCreateBarHolder extends ViewStream {

  constructor(props = {}) {
    props.tagName='ul';
    props.traits=[RouteCreatorTraits, RouteAnimTraits, FiltersTrait]
    props.class=props.isMainHolder === true ? 'route-bar-items-list main' : 'route-bar-items-list';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    const {vsid} = this.props;
    const checkVsidPayloadFilter = new ChannelPayloadFilter({propFilters:{
      parentVsid: vsid
      }});
    const internalUIEventPayloadFilter = this.filter$BarHolderOnInternalUIEvent();

    return [
      ['CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT', 'onRouteBarClickedEvent',internalUIEventPayloadFilter],

      ['CHANNEL_ROUTE_CREATOR_DRAG_START_EVENT', 'onDragStartEvent',checkVsidPayloadFilter],
      ['CHANNEL_ROUTE_CREATOR_DRAGGING_EVENT', 'onDraggingEvent',checkVsidPayloadFilter],
      ['CHANNEL_ROUTE_CREATOR_DRAG_END_EVENT', 'onDragEndEvent',checkVsidPayloadFilter],
        ['CHANNEL_ROUTE_CREATOR_ROUTE_LASTITEM_RENDERED_EVENT', 'onAllItemsRenderedEvent']
    ];
  }

  onDragStartEvent(e){
    const {dragVsid} = e.props();
    const payload =  this.routeAnim$OnDragStart(dragVsid);
    const dragEvent = 'dragInitDragItem';

    this.sendDraggingEventToChannel(dragEvent, payload);

  }


  sendDraggingEventToChannel(dragEvent, payload){
    const action = "CHANNEL_ROUTE_CREATOR_DRAG_EVENT";
    const channel = "CHANNEL_ROUTE_CREATOR";
    payload['dragEvent']=dragEvent;
    this.sendInfoToChannel(channel, payload, action);
  }

  onDraggingEvent(e){
    const {dragYPos,dragVsid} = e.props();
    const payload = this.routeAnim$OnDragging(dragYPos, dragVsid);
    if (payload!==undefined){
      const dragEvent = 'dragSwapItems';
      this.sendDraggingEventToChannel(dragEvent, payload);
    }

  }
  onDragEndEvent(){
    this.routeAnim$OnDragEnd();
  }


  onRouteBarClickedEvent(e){
    const {holderId, barId, routeBarEvent, payload} = e.props();
    const {vsid,routeLevel,el}=this.props;
    const isCurrentHolderEvent = holderId === vsid;

    if (routeBarEvent === 'add'){
      this.routeCreator$CreateRouteBar();
    }

    console.log("ROUTE BAR HOLDER LISTENS ",{payload,vsid,isCurrentHolderEvent,holderId,routeLevel, barId, routeBarEvent,el},'--',this.props,'--')
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  createBars(){
    const {props} = this;
    const {lastItem} = this.props.data;
   // console.log("LAST ITEM IS ",{lastItem}, this.props);
    const createBar = (data)=>{
      //data['initYPos'] = this.props.el.offsetHeight;
      data['isLastItem'] = lastItem === data.keyValue;
      this.routeCreator$CreateRouteBar(props, data);
      //console.log("create bar ",this.props.vsid,this.props.el.offsetHeight);
    }
    const barItemsData = this.routeCreator$ConformBarItemsData();

    forEachObjIndexed(createBar, barItemsData);

  }
  addNewBar(){

  }

  onAllItemsRenderedEvent(e){
    this.routeAnim$CreateBarItemsSorter();
  }

  onRendered() {
    this.addChannel("CHANNEL_ROUTE_CREATOR");
    if (this.props.data!==undefined) {
      this.createBars();
    }



  }

}