import {SpyneTrait} from 'spyne';
import {TweenMax, TimelineMax} from 'gsap';
import {mapObjIndexed, reduce, add, slice, clamp, map, filter, reject, multiply, range, compose, pathEq, prop, path, values} from 'ramda';

export class DragStatesTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dragState$';
    super(context, traitPrefix);

  }

  static dragState$InitDraggable(animate=true){
    this.props.dragItems = this.dragList$CreateList(animate);
  }


  static dragState$ResetPositions(createDragFn = this.dragList$CreateList){
    const tl = new TimelineMax({paused:true, onComplete:createDragFn});
    const rowHeight = this.props.rowHeight;
    let heightsArr = this.dragMethod$GegHeightsArr();
    const onUpdateItem =(el, i)=>{
      const height = this.dragMethod$GetHeight(i, heightsArr) ;// i*rowHeight;
      tl.to(el, .125, {y:height, ease: "Power1.easeInOut"});
    };

    let items = this.props.el$(this.props.listClass).el;
    items = items.length !== undefined ? items : [items];

    items.forEach(onUpdateItem);
    tl.play();

  }

}