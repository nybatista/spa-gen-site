import {SpyneTrait} from 'spyne';
import {Draggable} from 'gsap/Draggable';
import {TweenMax, TimelineMax} from 'gsap';
import {mapObjIndexed, map, multiply, range, compose, path, prop, values} from 'ramda';

export class DraggableTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'drag$';
    super(context, traitPrefix);

  }




  static drag$UpdateIndex(obj, from ,to){
    let tempObj = this.props.dragItems[to];
    this.props.dragItems[to] = obj;
    obj.index = to;
    this.props.dragItems[from] = tempObj;
    tempObj.index = from;
    let el = tempObj.el;
    let rowHeight = tempObj.index * this.props.rowHeight;
    TweenMax.to(el, .125, {y:rowHeight, ease: Power1.easeInOut});
  }


  static drag$CreateDraggableList(){
    const items = this.props.items$.el;// this.props.el$('.nav-creator-list-item').el;


    const createDragItem = (el, index)=>{

      const rowHeight = this.props.rowHeight;
      const totalRows = this.props.items$.el.length;
      const clamp = (value, a, b)=> value < a ? a : value > b ? b : value;

      const onDragging=()=>{
        const itemY = obj.position.y;
        const rowIndex = clamp(Math.round(itemY / rowHeight), 0, totalRows - 1);
        const currentIndex = obj.index*1;

        const changeIndex = rowIndex !== currentIndex;

        if (changeIndex === true){
          this.drag$UpdateIndex(obj, currentIndex, rowIndex);
        }
      };
      const onDragUp = ()=>{
        const el = obj.el;
        const rowHeight = obj.index * this.props.rowHeight;
        TweenMax.to(el, .125, {y:rowHeight, ease: Power1.easeInOut});
      };


      const dragger = new Draggable(el, {
          type: 'y',
          onDrag: onDragging,
          onRelease: onDragUp,
          bounds: this.props.id$,
          scope: el
      });

      let position = el._gsTransform;
      TweenMax.to(el, .5, {y:index*rowHeight, ease: Power1.easeInOut});
      let obj = {el,position, index, dragger};
      return obj;

    };

    return values(mapObjIndexed(createDragItem, items));
  }


  static drag$InitDraggable(){

    let item = '.nav-creator-list-item';

    //this.drag$CheckToResetItemsOrder();

/*
    const onDragging = (e)=>{
      console.log("THIS INDEX ",this.index);
    };
*/


    this.props.dragItems = this.drag$CreateDraggableList();
   // console.log("DRAG ITEMS IS ");
/*    Draggable.create(item, {
      type:"y",

      onDrag: onDragging,
      edgeResistance:0.065,
      liveSnap1: {  y: function(value) {
          //snap to the closest increment of 25.
          return Math.round(value / 60) * 60;
        }},

      bounds:this.props.id$,
      throwProps:true});*/


  }
}