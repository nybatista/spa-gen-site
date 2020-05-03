import {SpyneTrait} from 'spyne';
import {gsap, Draggable, InertiaPlugin} from 'gsap/all';

export class RouteBarDragTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'routeBarDrag$';
    super(context, traitPrefix);

  }

  static routeBarDrag$SendInfoToChannel(payload){
    const action = 'CHANNEL_ROUTE_CREATOR_DRAG_EVENT';
    this.sendInfoToChannel('CHANNEL_ROUTE_CREATOR', payload, action);

  }

  static routeBarDrag$OnPress(e){
    const dragEvent = 'dragStart';
    const {parentVsid, vsid} = this.props;
    const dragVsid = vsid;
    const payload = {dragEvent, parentVsid, dragVsid};
    this.routeBarDrag$SendInfoToChannel(payload);
  }

  static routeBarDrag$OnDrag(e){
    const {pageY,target,currentTarget} = e;
    const {endY,deltaY,y} = this.props.dragger[0];
    const dragEvent = 'dragging';
    const dragYPos = endY;
    const {parentVsid, vsid} = this.props;
    //console.log("DRAGGING ",{endY,deltaY,y,pageY,target,currentTarget,e},this.props.dragger);
    const dragVsid = vsid;
    this.routeBarDrag$SendInfoToChannel({dragEvent,dragVsid,parentVsid, dragYPos});

  }

  static routeBarDrag$OnDragEnd(e){
    const dragEvent = 'dragEnd';
    const {parentVsid} = this.props;
    this.routeBarDrag$SendInfoToChannel({dragEvent,parentVsid});
  }

  static routeBarDrag$InitDraggable(props=this.props){
    gsap.registerPlugin(Draggable);
    gsap.registerPlugin(InertiaPlugin);

    const onSnapItem = (y)=>{
      const {yGsap} = this.props.data;
      //console.log('this is ',{y,yGsap});
      //this.props.dragger[0].endDrag();
      //gsap.to(this.props.el,{duration:.125, y:yGsap, ease:"Power1.easeInOut"});
      return yGsap;
    }


    const {el} = props;
      //console.log("SELC IS ",this.props.id$+' > .dragger')
    const config =  {
      type: "y",
      bounds2: {minY:0, maxY:1600},
      bounds3: document.querySelector('#route-creator-container'),
      trigger: this.props.id$+' > section div.dragger',
      edgeResistance: ".25",
      lockAxis: true,
      maxDuration:.125,
      inertia: true,
      onPress: this.routeBarDrag$OnPress.bind(this),
      onDrag: this.routeBarDrag$OnDrag.bind(this),
      snap:{y:onSnapItem}


    }
    this.props.dragger = Draggable.create(el, config);


  }
}