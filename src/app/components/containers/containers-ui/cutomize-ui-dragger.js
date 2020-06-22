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
      ['CHANNEL_ROUTE_CREATOR_ITEM_ADDED_EVENT', 'onRouteCreatorItemAdded'],
      ['CHANNEL_ROUTE_CREATOR_ITEM_REMOVED_EVENT', 'onRouteCreatorItemAdded'],
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
    //console.log("LOADING DRAGGER OPACITY ",{revealContainerBool, delayTime, opacityNum});

    this.props.el$.toggleClass('reveal', revealContainerBool);

    const tempDisableDrag = ()=>{
      const enableDrag = ()=>this.props.dragger[0].enable();

      if (revealContainerBool === false){
        this.props.dragger[0].disable();
        this.setTimeout(enableDrag, 200);
      }

    }

    const onStartFadeAnim = ()=>{
      this.dragBar$InitYPos();
      gsap.to(this.props.el, {duration:.5, opacity:opacityNum });
    }

    this.setTimeout(onStartFadeAnim, delayTime);
    tempDisableDrag();

  }


  onRouteCreatorItemRemoved(e){
    const {parentVsid} = e.props();
    const {y} = document.getElementById(parentVsid).lastElementChild.getBoundingClientRect();
    const minY = y+90;
    const dragY = this.props.dragger[0].y



    this.dragBar$UpdateYPos(minY);



    //console.log('item removed ',{e},this.props);
  }



  onRouteCreatorItemAdded(e){
    const {barId, parentVsid, action} = e.props();



    const checkYPos = ()=> {
      const getYPos=()=>{
        //const yEl = document.getElementById(parentVsid).lastElementChild;
        const yEl = document.getElementById('route-creator-container');
        //console.log('y el is ',{yEl,parentVsid,barId}, document.getElementById(parentVsid));

        return yEl.getBoundingClientRect();
      }

      const {y,height} =  getYPos();
      const minY = y+height+60;
      const dragY = this.props.dragger[0].y

      const adjustYBool = dragY<minY;
     // console.log("ROUTE CREATOR ITEM ADJUST ",{y,height,minY,dragY,barId,parentVsid, adjustYBool},this.props);

    //  if (adjustYBool===true){

        this.dragBar$UpdateYPos(minY);

     // }

    }
    this.setTimeout(checkYPos, 600);

  }

  onInitDragItems(e){

    //console.log("DRAGGER INIT DRAG ITEMS ",{e});
   // this.setTimeout(this.dragBar$InitYPos.bind(this), 1150);

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