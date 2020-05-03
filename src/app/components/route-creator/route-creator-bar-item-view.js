import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {RouteCreatorTraits} from 'traits/route-creator-traits';
import {RouteBarDragTraits} from 'traits/route-bar-drag-traits';
import {RouteAnimTraits} from 'traits/route-anim-traits';
import {gsap} from 'gsap/all';
import {FiltersTrait} from 'traits/filters-trait';
import {compose,head,filter,propEq} from 'ramda';

export class RouteCreatorBarItemView extends ViewStream {

  constructor(props = {}) {
    props.tagName = 'li';
    props.sendLifecyleEvents=true;
    props.class=`route-creator-bar-item route-level-${props.routeLevel} group-${props.parentVsid}`;
    props.traits = [RouteCreatorTraits,RouteBarDragTraits,RouteAnimTraits,FiltersTrait];
    props.data.holderId = props.parentVsid;
    props.template=require('./templates/route-creator-bar-item.tmpl.html');
    //console.log("BAR ITEM PROPS ",props);
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    const {routeLevel} = this.props;
    const initItemsPayloadFilter = this.filter$InitDraggingItem();
    const checkForSwappedItemsFilter = this.filter$CheckForSwappedItems();
    const internalUIEventPayloadFilter = this.filter$BarItemOnInternalUIEvent();


    return [
      ['CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT', 'onRouteBarClickedEvent',internalUIEventPayloadFilter],
      ['CHANNEL_ROUTE_CREATOR_INIT_DRAG_ITEM_EVENT', 'onInitDragEvent', initItemsPayloadFilter],
      ['CHANNEL_ROUTE_CREATOR_DRAGGING_SWAP_ITEMS_EVENT', 'onSwapDragItemsEvent', checkForSwappedItemsFilter],
      ['CHANNEL_ROUTE_CREATOR_ANIMATE_ITEM_EVENT', 'onAnimateItem', checkForSwappedItemsFilter]

    ];
  }

  onAnimateItem(e){
    const {swapItems} = e.props();
    const {vsid} = this.props;


    const animateData = compose(head,filter(propEq('id', vsid)))(swapItems);
    const {yGsap} = animateData;
    this.props.yGsap = yGsap;
    this.routeAnim$ItemAnimateToYVal(yGsap);
    console.log("ANIMATE ITEM IS ",{yGsap,animateData,e});

  }

  onBeforeDispose() {
    console.log("ON BEFORE DISPOSE HERE ",this.props.vsid);
  }

  onRouteBarClickedEvent(e){
    const {routeBarEvent} = e.props();
    if (routeBarEvent==='delete'){
      this.routeAnim$ItemAnimateOutAndDispose();
    }

    console.log("ITEM HAS CLICKED ",{routeBarEvent,e},e.payload,this.props.vsid);
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
    } else if (this.props.autoInit===false) {
      this.routeAnim$ItemAnimateIn(yGsap);
    }
  }


  sendLastItemRenderedEvent(){

    const {vsid, parentVsid} = this.props;
    const action = 'CHANNEL_ROUTE_CREATOR_ROUTE_LASTITEM_RENDERED_EVENT';
    const channel = 'CHANNEL_ROUTE_CREATOR';
    this.sendInfoToChannel(channel, {vsid, parentVsid,action}, action);

  }

  sendRenderedEvent(isAddEvent=true){
    const {vsid, parentVsid, routeLevel} = this.props;
    const barId = vsid;
    const action = isAddEvent === true ?
          'CHANNEL_ROUTE_CREATOR_ITEM_ADDED_EVENT' :
          'CHANNEL_ROUTE_CREATOR_ITEM_REMOVED_EVENT';
    const channel = 'CHANNEL_ROUTE_CREATOR';
    this.sendInfoToChannel(channel, {barId, parentVsid, routeLevel, action}, action);


  }

  onRendered() {
    if (this.props.routeLevel<=0){
      this.routeCreator$CreateRouteBarHolder();
    }

    if (this.props.autoInit===true){
      console.log("AUTO INIT IS ",this.props);
      this.sendRenderedEvent();
    }

    this.routeCreator$InitBarItem();
    this.routeBarDrag$InitDraggable();
    if (this.props.data.isLastItem===true){
      this.sendLastItemRenderedEvent();
    }
    this.addChannel('CHANNEL_ROUTE_CREATOR');


  }


}