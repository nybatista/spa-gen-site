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
    const dragEvent = 'dragging';
    const dragYPos = e.y;
    const {parentVsid} = this.props;
    this.routeBarDrag$SendInfoToChannel({dragEvent,parentVsid, dragYPos});

  }

  static routeBarDrag$OnDragEnd(e){
    const dragEvent = 'dragEnd';
    const {parentVsid} = this.props;
    this.routeBarDrag$SendInfoToChannel({dragEvent,parentVsid});
  }

  static routeBarDrag$InitDraggable(props=this.props){
    gsap.registerPlugin(Draggable);
    gsap.registerPlugin(InertiaPlugin);

    const {el} = props;
      //console.log("SELC IS ",this.props.id$+' > .dragger')
    const config =  {
      type: "y",

      bounds: el.parentElement,
      trigger: this.props.id$+' > section div.dragger',
      edgeResistance: ".65",
      lockAxis: true,
      inertia: true,
      onPress: this.routeBarDrag$OnPress.bind(this),
      onDrag: this.routeBarDrag$OnDrag.bind(this),
      onDragEnd: this.routeBarDrag$OnDragEnd.bind(this)

    }
    this.props.dragger = Draggable.create(el, config);


  }
}