import {SpyneTrait} from 'spyne';
import {Draggable, gsap, InertiaPlugin} from 'gsap/all';

export class DraggerBarTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dragBar$';
    super(context, traitPrefix);

  }


  static dragBar$SendInfoToChannel(payload, action='CHANNEL_CONTAINERS_DRAG_UPDATED_EVENT'){
    this.sendInfoToChannel('CHANNEL_CONTAINERS', payload, action);

  }



  static dragBar$OnDrag(e){
    const {pageY,target,currentTarget} = e;
    const {endY,deltaY,y} = this.props.dragger[0];
    const dragEvent = 'dragging';
    const dragYPos = endY;
    const {vsid} = this.props;
    //console.log("DRAGGING ",{endY,deltaY,y,pageY,target,currentTarget,e},this.props.dragger);
    const dragVsid = vsid;
    const containerHeight = y;// y-11;;
    //document.getElementById('customize-container').style.cssText=`height:${y-11}px`;



    if(y<=0){
      const action = "CHANNEL_CONTAINERS_HIDE_CUSTOM_CONTAINER_EVENT";
      this.dragBar$SendInfoToChannel({action}, action);
    } else {
      this.dragBar$SendInfoToChannel({y, containerHeight});

    }

    //this.routeBarDrag$SendInfoToChannel({dragEvent,dragVsid,parentVsid, dragYPos});

  }

  static dragBar$GetHeaderHeightAdjust(){
    const headerHeight = document.getElementById('app-header').getBoundingClientRect().height;
    return  (headerHeight-this.props.elHeight)/2;

  }

  static dragBar$SetYPos(){
    const draggerHeight = this.props.el.getBoundingClientRect().height;
    const {y,height} = this.props.headerBar.getBoundingClientRect();
    const yPos = y+(height-draggerHeight)/2;

    //console.log("DRAGGER STUFF ", {y,height,draggerHeight,yPos})

    gsap.set(this.props.el, {y:yPos});


  }


  static dragBar$UpdateYPos(val, animateToPositionBool=true){

    const conCompleteDragTween = ()=>{
      this.props.dragger[0].update();
    }

    const onYUpdated = (obj)=>{
      const {y} = this.props.el.getBoundingClientRect();
      const containerHeight = y;// y-11;;
      this.dragBar$SendInfoToChannel({y,containerHeight,animateToPositionBool});

      //console.log("Y UPDATED ",{obj,y,containerHeight});

    }
   const y = val;
   const containerHeight = val;
   this.dragBar$SendInfoToChannel({y,containerHeight,animateToPositionBool});

    gsap.to(this.props.el, {duration:.25, y:val, onComplete:conCompleteDragTween});

  }

  static dragBar$InitYPos(props=this.props){
    props.headerBar = document.querySelector("#app-header");
    props.draggerHeight = props.el.getBoundingClientRect().height;
    this.dragBar$SetYPos();

  }


  static dragBar$InitDraggable(props=this.props){
    gsap.registerPlugin(Draggable);
    //gsap.registerPlugin(InertiaPlugin);
    this.props.elHeight = this.props.el.getBoundingClientRect().height;
    this.props.headerHeightAdj = 68-this.dragBar$GetHeaderHeightAdjust();
    //console.log("HEADER DRAG ADJ ",this.props.headerHeightAdj, this.props.elHeight)

    const onSnapItem = (y)=>{


     // const {yGsap} = this.props.data;
      //console.log('this is ',{y,yGsap});
      //this.props.dragger[0].endDrag();
      //gsap.to(this.props.el,{duration:.125, y:yGsap, ease:"Power1.easeInOut"});
     // return yGsap;
      return y;
    }


    const {el} = props;
    //console.log("SELC IS ",this.props.id$+' > .dragger')
    const config =  {
      type: "y",
      cursor: 'row-resize',
      bounds: {minY:0, maxY: window.innerHeight-this.props.elHeight},
/*      bounds2: {minY:0, maxY:1600},
      bounds3: document.querySelector('#route-creator-container'),
      trigger: this.props.id$+' > section div.dragger',*/

      edgeResistance: ".25",

      lockAxis: true,
/*      maxDuration:.125,
      inertia: true,*/
      zIndexBoost: false,
      onDrag: this.dragBar$OnDrag.bind(this),
/*      onPress: this.routeBarDrag$OnPress.bind(this),
      onDragEnd: this.routeBarDrag$OnDragEnd.bind(this),*/
/*
      snap:{y:onSnapItem}
*/


    }
    this.props.dragger = Draggable.create(el, config);
/*    const isHome = this.props.routeLevel === 0 && this.props.data.key==='home';
    if (isHome===true){
      this.props.dragger[0].disable();
    }*/

  }

}