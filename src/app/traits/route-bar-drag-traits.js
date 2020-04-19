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
      //console.log("SELC IS ",this.props.id$+' > .dragger')
    const config =  {
      type: "y",

      bounds: el.parentElement,
      trigger: this.props.id$+' > section div.dragger',
      edgeResistance: ".65",
      lockAxis: true,
      inertia: true,

    }
    this.props.dragger = Draggable.create(el, config);


  }
}