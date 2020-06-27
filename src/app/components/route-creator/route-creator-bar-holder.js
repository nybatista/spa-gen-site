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
    props.traits=[RouteCreatorTraits, RouteAnimTraits, FiltersTrait];
    props.reSortOnDragEnd = false;
    props.menuNameInc = 1;
    props.dataset = {};
    props.dataset['mainBar'] = props.subNavHolder;
    props.class=props.isMainHolder === true ? 'route-bar-items-list main' : 'route-bar-items-list';
    //console.log("BAR HOLDER DATA ",props.data);
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    const {vsid, routeLevel} = this.props;
    //console.log("ROUTE LEVEL IN HOLDER ",{routeLevel, vsid})
    const checkVsidPayloadFilter = new ChannelPayloadFilter({props:{
      parentVsid: vsid
      }});
    const internalUIEventPayloadFilter = this.filter$BarHolderOnInternalUIEvent();

    const itemRenderedPayloadFilter = this.filter$BarHolderItemRenderedEvent();
0
    return [
        ['CHANNEL_LIFECYCLE_DISPOSED_EVENT', 'onChannelLifecycle'],
      ['CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT',
        'onRouteBarClickedEvent',internalUIEventPayloadFilter],
      ['CHANNEL_ROUTE_CREATOR_GENERATE_DEFAULT_JSON_EVENT', 'onResetDefaultJson'],
      ['CHANNEL_ROUTE_CREATOR_ITEM_ADDED_EVENT', 'onItemAdded',itemRenderedPayloadFilter],
      ['CHANNEL_ROUTE_CREATOR_ITEM_REMOVED_EVENT', 'onItemRemoved',itemRenderedPayloadFilter],
      ['CHANNEL_ROUTE_CREATOR_DRAG_START_EVENT', 'onDragStartEvent',checkVsidPayloadFilter],
      ['CHANNEL_ROUTE_CREATOR_DRAGGING_EVENT', 'onDraggingEvent',checkVsidPayloadFilter],
      ['CHANNEL_ROUTE_CREATOR_DRAG_END_EVENT', 'onDragEndEvent',checkVsidPayloadFilter],
      ['CHANNEL_ROUTE_CREATOR_ROUTE_LASTITEM_RENDERED_EVENT', 'onAllItemsRenderedEvent']
    ];
  }


  onResetDefaultJson(e){
    this.disposeViewStream();

  }


  onChannelLifecycle(e){
    if (this.props.sendItemRemoveObj!==undefined){
      const {vsid} = e.props();
      const {barId, itemRemoveFn} = this.props.sendItemRemoveObj;
      const isRemovedItem = barId === vsid;
      itemRemoveFn();
      this.props.sendItemRemoveObj = undefined;
      //console.log("CHANNEL LIFECYLE ",{isRemovedItem, vsid,barId,itemRemoveFn,e});

    }

  }
  onItemAdded(e){
    const {barId, parentVsid} = e.props();
    const {vsid} = this.props;
    const isContainer = parentVsid === vsid;
    const item$ = this.props.el$(`#${barId}`);
    const el = isContainer === true ? item$.el : null;

    const {swapItems, swapItemsIds} =  this.routeAnim$AddItemToSorter(el);
    const animEvent = isContainer === true ? 'animateIn' : 'animate';;
    this.sendAnimInfoToChannel({swapItems,swapItemsIds,animEvent});


   // console.log("BAR HOLDER ADD ITEM ",{animEvent,isContainer, parentVsid, vsid, barId, swapItems, swapItemsIds, el});

  }
  onItemRemoved(e){
    const {barId, parentVsid} = e.props();
    const {vsid} = this.props;
    const isContainer = parentVsid === vsid;
    const animEvent = 'animateOut';
    if (isContainer===true) {
      const {swapItems, swapItemsIds} = this.routeAnim$RemoveItemFromSorter(barId);

      //console.log("REMOVE DATA TRUE IS ",{swapItemsIds, swapItems})
      this.sendAnimInfoToChannel({swapItems,swapItemsIds,animEvent})
    } else {
      const itemRemoveFn = ()=> {
        const {swapItems, swapItemsIds} = this.routeAnim$RemoveItemFromSorter(barId);
        this.sendAnimInfoToChannel({swapItems,swapItemsIds,animEvent})
      }
      this.props.sendItemRemoveObj = {
        barId,
        itemRemoveFn
      }
    }


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
      this.props.reSortOnDragEnd=true;
      this.sendDraggingEventToChannel(dragEvent, payload);
    }

  }
  onDragEndEvent(){
    //console.log("DRAG END ",this.props.reSortOnDragEnd);
   // this.routeAnim$OnDragEnd();
    if (this.props.reSortOnDragEnd === true) {
      this.routeCreator$ReorderChildElements();
    }
    this.props.reSortOnDragEnd = false;
  }


  onRouteBarClickedEvent(e){
    const {holderId, barId, routeBarEvent, payload} = e.props();
    const {vsid,routeLevel,el}=this.props;
    const isCurrentHolderEvent = holderId === vsid;

    if (routeBarEvent === 'add'){
      this.routeCreator$CreateRouteBar(this.props, undefined, true);
      this.props.menuNameInc +=1;
    } else{
      //this.props.menuNameInc -=1;
    }

    //console.log("ROUTE BAR HOLDER LISTENS ",{payload,vsid,isCurrentHolderEvent,holderId,routeLevel, barId, routeBarEvent,el},'--',this.props,'--')
  }

  sendAnimInfoToChannel(payload){
   const action = 'CHANNEL_ROUTE_CREATOR_ANIMATE_ITEM_EVENT';
   const channel = 'CHANNEL_ROUTE_CREATOR';
   this.sendInfoToChannel(channel, payload, action);
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
      data['isLastItem'] = lastItem === data.key;

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
    this.addChannel("CHANNEL_LIFECYCLE");
    if (this.props.autoInit===true){
      this.onAllItemsRenderedEvent();
    }

    if (this.props.data!==undefined) {
      this.createBars();
    }



  }

}