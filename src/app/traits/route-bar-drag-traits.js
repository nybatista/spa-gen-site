import {SpyneTrait} from 'spyne';
import {gsap, Draggable, InertiaPlugin} from 'gsap/all';

export class RouteBarDragTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'routeBarDrag$';
    super(context, traitPrefix);

  }

  static routeBarDrag$InitDraggable(props=this.props){
    gsap.registerPlugin(Draggable);
    gsap.registerPlugin(InertiaPlugin);

    const {el} = props;

    const config =  {
      type: "y",

      bounds: el.parentElement,

      edgeResistance: ".65",
      lockAxis: true,
      inertia: true,

    }
    this.props.dragger = Draggable.create(el, config);


    console.log("INIT DRAGGAGBLE ",el);

  }
}