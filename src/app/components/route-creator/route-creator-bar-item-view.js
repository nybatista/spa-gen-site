import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {RouteCreatorTraits} from 'traits/route-creator-traits';
import {RouteBarDragTraits} from 'traits/route-bar-drag-traits';
import {gsap} from 'gsap/all';
import {FiltersTrait} from 'traits/filters-trait';
import {compose,head,filter,propEq} from 'ramda';

export class RouteCreatorBarItemView extends ViewStream {

  constructor(props = {}) {
    props.tagName = 'li';
    props.class=`route-creator-bar-item route-level-${props.routeLevel} group-${props.parentVsid}`;
    props.traits = [RouteCreatorTraits,RouteBarDragTraits,FiltersTrait];
    props.data.holderId = props.parentVsid;
    props.template=require('./templates/route-creator-bar-item.tmpl.html');
    //console.log("BAR ITEM PROPS ",props);
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    const initItemsPayloadFilter = this.filter$InitDraggingItem();
    const checkForSwappedItemsFilter = this.filter$CheckForSwappedItems();
    const internalUIEventPayloadFilter = this.filter$BarItemOnInternalUIEvent();


    return [
      ['CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT', 'onRouteBarClickedEvent',internalUIEventPayloadFilter],
      ['CHANNEL_ROUTE_CREATOR_INIT_DRAG_ITEM_EVENT', 'onInitDragEvent', initItemsPayloadFilter],
      ['CHANNEL_ROUTE_CREATOR_DRAGGING_SWAP_ITEMS_EVENT', 'onSwapDragItemsEvent', checkForSwappedItemsFilter]

    ];
  }

  onRouteBarClickedEvent(e){
    console.log("ITEM HAS CLICKED ",{e},e.payload,this.props.vsid);
  }

  broadcastEvents() {
    // return nexted array(s)
    return [
        [this.props.id$+' > section .icons i', 'click'],
        [this.props.id$+' > section .icons p', 'click']
    ];
  }


  onInitDragEvent(e){
    const {yGsap} = e.props();
    const {vsid} = this.props;
    this.props.data.yGsap = yGsap;

    //console.log("INIT DRAG EVENT ",{vsid,yGsap,e})
  }

  onSwapDragItemsEvent(e){
    const {swapItems} = e.props();
    const {vsid} = this.props;

    const dragData = compose(head,filter(propEq('id', vsid)))(swapItems);
    const {yGsap, isDragger} = dragData;

    if (isDragger===true){
      this.props.data.yGsap = yGsap;
    } else {
      gsap.to(this.props.el, {duration:.125, y:yGsap, ease:"Power1.easeInOut"});
    }
   // console.log("SWAP DRAG EVENT ",{yGsap,isDragger,vsid,dragData,e})
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
    this.addChannel('CHANNEL_ROUTE_CREATOR');


  }


}