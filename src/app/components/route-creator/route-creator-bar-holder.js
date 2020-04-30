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

    //const items = this.routeCreator$GetListItems$();
    const {dragVsid} = e.props();
    const payload =  this.routeAnim$OnDragStart(dragVsid);

    const dragEvent = 'dragInitDragItem';

    this.sendDraggingEventToChannel(dragEvent, payload);
    //console.log("START DRAGGER OBJ ",dragObj);
    //console.log("draging ",{e},this.props.vsid,{dragVsid});
   // this.routeAnim$StartBarPosWatcher(dragVsid);

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
      //const {el, yGsap} = draggingData;
      //gsap.to(el, {duration:.125, y:yGsap, ease: "Power1.easeInOut"});
     // const action = "CHANNEL_ROUTE_CREATOR_DRAGGING_UPDATE_EVENT";
      //this.sendInfoToChannel("CHANNEL_ROUTE_CREATOR", draggingData, action);
      //console.log("DRAGGING DATA US ",{payload});

    }


  }
  onDragEndEvent(){

    this.routeAnim$OnDragEnd();

/*    const draggerObjData = this.routeAnim$GetDraggerItemData();
    const {el, yGsap} = draggerObjData;
    console.log("DRAG END ",{el,yGsap});
    this.props.dragger.endDrag()
    const delayer = ()=>gsap.to(el, {duration:.125, y:yGsap, ease: "Power1.easeInOut"});

    this.setTimeout(delayer,50);*/


  }


  onRouteBarClickedEvent(e){
    const {holderId, barId, routeBarEvent} = e.props();
    const {vsid,routeLevel,el}=this.props;
    const isCurrentHolderEvent = holderId === vsid;
    console.log("ROUTE BAR HOLDER LISTENS ",{vsid,isCurrentHolderEvent,holderId,routeLevel, barId, routeBarEvent,el})
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
      data['initYPos'] = this.props.el.offsetHeight;
      data['isLastItem'] = lastItem === data.keyValue;
      this.routeCreator$CreateRouteBar(props, data);
      //console.log("create bar ",this.props.vsid,this.props.el.offsetHeight);
    }
    const barItemsData = this.routeCreator$ConformBarItemsData();

    forEachObjIndexed(createBar, barItemsData);

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