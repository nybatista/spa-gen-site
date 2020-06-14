import {ViewStream} from 'spyne';
import {DraggerBarTraits} from 'traits/dragger-bar-traits';
import {gsap} from 'gsap/all';

export class CustomizeUIDragger extends ViewStream {

  constructor(props = {}) {
    props.id='dragger';
    props.traits = DraggerBarTraits;
    props.template = require('./templates/dragbar.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
        ['CHANNEL_CONTAINERS_TOGGLE_MAIN_CONTAINER_EVENT', 'onCustomizeContainerToggled'],
      ['CHANNEL_ROUTE_CREATOR_INIT_DRAG_ITEM_EVENT', 'onInitDragItems'],
      ['CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT', 'onInitDragItems'],
      ['CHANNEL_ROUTE_CREATOR_INIT_DRAG_ITEM_EVENT', 'onInitDragItems'],
      ['CHANNEL_ROUTE_CREATOR_DRAGGING_SWAP_ITEMS_EVENT', 'onInitDragItems'],
      ['CHANNEL_ROUTE_CREATOR_ANIMATE_ITEM_EVENT', 'onInitDragItems'],
      ['CHANNEL_ROUTE_CREATOR_ROUTE_LASTITEM_RENDERED_EVENT', 'onInitDragItems']

    ];
  }

  onCustomizeContainerToggled(e){
    const {eventType,type,value, revealContainerBool} = e.props();

    const delayTime = revealContainerBool === true ? 550 : 0;
    const opacityNum = revealContainerBool === true ? 1 : 0;
    console.log("LOADING DRAGGER OPACITY ",{revealContainerBool, delayTime, opacityNum});


    const onStartFadeAnim = ()=>{
      this.dragBar$InitYPos();
      gsap.to(this.props.el, {duration:.5, opacity:opacityNum });
    }

    this.setTimeout(onStartFadeAnim, delayTime);


  }

  onInitDragItems(e){

    console.log("DRAGGER INIT DRAG ITEMS ",{e});
    this.setTimeout(this.dragBar$InitYPos.bind(this), 1150);

  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    gsap.set(this.props.el, {opacity:0})
    this.addChannel('CHANNEL_ROUTE_CREATOR');
    this.addChannel("CHANNEL_CONTAINERS");

    this.dragBar$InitDraggable();

  }

}