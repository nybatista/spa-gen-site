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

      const onReorder = ()=>{
        const reorder = (obj)=>this.props.el.appendChild(obj.el);
        this.props.dragItems.forEach(reorder);

      };

      const onDragUp = ()=>{
        const el = obj.el;
        const rowHeight = obj.index * this.props.rowHeight;
        TweenMax.to(el, .125, {y:rowHeight, ease: Power1.easeInOut, onComplete:onReorder});
      };


      const onClickTest = (item)=>{
        console.log('e is ',{item});
        const tagName = item.tagName.toLowerCase();
        return ['i','input'].indexOf(tagName)>=0;

        };

      const dragger = new Draggable(el, {
          type: 'y',
          onDrag: onDragging,
          dragClickables: false,
          clickableTest: onClickTest,
          onRelease: onDragUp,
          bounds: this.props.id$,
          scope: el
      });

      let position = el._gsTransform;
      let indexStart = index-1;
      indexStart =  indexStart<= 0 ? 0 : indexStart;
      const rowHeightStart = indexStart * this.props.rowHeight;
      if (position.y !== index*rowHeight) {
        TweenMax.fromTo(el, .25,
            {y: rowHeightStart, opacity:0},
            {y: index * rowHeight, opacity:1, ease: Power1.easeInOut});
      };
      let obj = {el,position, index, dragger};
      return obj;

    };

    return values(mapObjIndexed(createDragItem, items));
  }


  static drag$InitDraggable(){
    this.props.dragItems = this.drag$CreateDraggableList();
  }
}