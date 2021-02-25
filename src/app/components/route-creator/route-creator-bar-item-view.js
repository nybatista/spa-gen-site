import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {RouteCreatorTraits} from 'traits/route-creator-traits';
import {RouteBarDragTraits} from 'traits/route-bar-drag-traits';
import {RouteAnimTraits} from 'traits/route-anim-traits';
import {gsap} from 'gsap/all';
import {FiltersTrait} from 'traits/filters-trait';
import {compose,head,filter,propEq} from 'ramda';

import {RouteCreatorBarItemBackground} from 'main_components/route-creator/route-creator-bar-item-background';

export class RouteCreatorBarItemView extends ViewStream {

  constructor(props = {}) {
    props.tagName = 'li';
    props.sendLifecyleEvents=true;
    props.class=`route-creator-bar-item route-level-${props.routeLevel} group-${props.parentVsid}`;
    props.traits = [RouteCreatorTraits,RouteBarDragTraits,RouteAnimTraits,FiltersTrait];
    props.data.holderId = props.parentVsid;
    props.data.inputLabel = props.routeLevel === 0 ? "menu" : "submenu";
    props.data.label = props.data.keyValue!== '^$' ? props.data.keyValue : props.data.key;
    props.data.routeLevel = props.routeLevel;
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


    const arr =  [
      ['CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT', 'onRouteBarClickedEvent',internalUIEventPayloadFilter],
      ['CHANNEL_ROUTE_CREATOR_INIT_DRAG_ITEM_EVENT', 'onInitDragEvent', initItemsPayloadFilter],
      ['CHANNEL_ROUTE_CREATOR_DRAGGING_SWAP_ITEMS_EVENT', 'onSwapDragItemsEvent', checkForSwappedItemsFilter],
      ['CHANNEL_ROUTE_CREATOR_ANIMATE_ITEM_EVENT', 'onAnimateItem', checkForSwappedItemsFilter]

    ];

    if (this.props.routeLevel === 1){
      const {vsid} = this.props;
      const focusFilter = new ChannelPayloadFilter({props:{"vsid" : vsid}})
      arr.push(['CHANNEL_ROUTE_CREATOR_INPUT_FOCUS.*_EVENT', 'onFocusInputEvent',focusFilter]);
    }


    return arr;
  }

  onFocusInputEvent(e){
    const {action} = e.props();
    const addFocusBool = action === "CHANNEL_ROUTE_CREATOR_INPUT_FOCUSIN_EVENT";
    this.props.el$('section.input-bar').toggleClass('focus', addFocusBool);

    const currentVsid = this.props.vsid;
    //console.log("FOCUS IN ACTIONAL ELEMENT ", {currentVsid,e});
  }

  onAnimateItem(e){
    const {swapItems, animEvent} = e.props();
    const {vsid} = this.props;
    const animateFn = animEvent === 'animateIn' ? this.routeAnim$ItemAnimateIn : this.routeAnim$ItemAnimateToYVal;

  //  const animateData = compose(head,filter(propEq('id', vsid)))(swapItems);
    const animateData = this.routeAnim$GetSwapData(swapItems, vsid);
    const {yGsap} = animateData;
    //console.log("ANIMATE Y ",{yGsap, animateData, e});

    this.props.yGsap = yGsap;
    animateFn(yGsap);
   // this.routeAnim$ItemAnimateToYVal(yGsap);
   // console.log("ANIMATE ITEM IS ",{yGsap,animateData,animEvent,swapItems,e});

  }


  onRouteBarClickedEvent(e){
    const {routeBarEvent} = e.props();
    if (routeBarEvent==='delete'){
      this.routeAnim$ItemAnimateOutAndDispose();
    }

    //console.log("ITEM HAS CLICKED ",{routeBarEvent,e},e.payload,this.props.vsid);
  }

  broadcastEvents() {
    // return nexted array(s)
    const arr = [
        [this.props.id$+' > section .icons i', 'click'],
        [this.props.id$+' > section .icons p', 'click']
    ];

    if (this.props.routeLevel<=1){
      const inputSel = `div.input input.rl-${this.props.routeLevel}`
      arr.push([inputSel, 'focusin'])
      arr.push([inputSel, 'focusout'])
    }

    return arr;
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
    } else  {
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

  addRouteItemBackground(){
    const parentVsid = this.props.vsid;
    this.prependView(new RouteCreatorBarItemBackground({parentVsid}));
  }

  onRendered() {
    this.addChannel('CHANNEL_ROUTE_CREATOR');

    if (this.props.routeLevel<=0){
      const autoInit = this.props.autoInit === true;
      this.routeCreator$CreateRouteBarHolder(this.props.data, autoInit);
      //console.log("CREATE ROUTE NAME ",this.props.data);

      this.routeCreator$CreateRouteName();

      this.addRouteItemBackground();


    }

    if (this.props.autoInit===true){
      //console.log("AUTO INIT IS ",this.props);
      const delayer = ()=> {
        this.sendRenderedEvent();
      }

      gsap.set(this.props.el, {opacity:0, x:"-=15"});
      gsap.to(this.props.el, {duration:.5, delay:.5, x:0, opacity:1})
        this.setTimeout(delayer, 5);
    }

    this.routeCreator$InitBarItem();
    this.routeBarDrag$InitDraggable();

    if (this.props.data.isLastItem===true){
      this.sendLastItemRenderedEvent();
    }


  }


}
