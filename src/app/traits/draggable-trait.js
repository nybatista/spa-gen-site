import {SpyneTrait} from 'spyne';
import {Draggable} from 'gsap/Draggable';
import {TweenMax, TimelineMax} from 'gsap';

export class DraggableTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = '$drag';
    super(context, traitPrefix);

  }

  static $dragInitDraggable(){

    let item = '.nav-creator-list-item';

    Draggable.create(item, {type:"top",  edgeResistance:0.065, bounds:this.props.el$, throwProps:true});


  }
}