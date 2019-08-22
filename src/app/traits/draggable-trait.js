import {SpyneTrait} from 'spyne';
import {Draggable} from 'gsap/Draggable';
import {TweenMax, TimelineMax} from 'gsap';
import {mapObjIndexed, map, filter, reject, multiply, range, compose, pathEq, prop, values} from 'ramda';

export class DraggableTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'drag$';
    super(context, traitPrefix);

  }

  static drag$UpdateIndex(obj, from ,to, dragItems = this.props.dragItems){
    let tempObj = this.props.dragItems[to];
    dragItems[to] = obj;
    obj.index = to;
    dragItems[from] = tempObj;
    tempObj.index = from;
    let el = tempObj.el;
    let rowHeight = tempObj.index * this.props.rowHeight;
    TweenMax.to(el, .125, {y:rowHeight, ease: Power1.easeInOut});
  }


  static drag$RemoveDeletedDragItem(id, dragItems=this.props.dragItems){
    const rejectId = reject(pathEq(['el', 'id'], id));

    dragItems = rejectId(dragItems);
    return dragItems;
  }

  static drag$ResetPositions(createDragFn = this.drag$CreateDraggableList){
    const tl = new TimelineMax({paused:true, onComplete:this.createDragFn});
    const rowHeight = this.props.rowHeight;
    const onUpdateItem =(el, i)=>{
      const height = i*rowHeight;
      tl.to(el, .125, {y:height, ease: Power1.easeInOut});
    };

    let items = this.props.el$('.nav-creator-list-item').el;
    items = items.length !== undefined ? items : [items];

    items.forEach(onUpdateItem);
    tl.play();

  }

  static drag$ReOrder(el=this.props.el, dragItems = this.props.dragItems){
    const reorder = (obj)=> el.appendChild(obj.el);
    dragItems.forEach(reorder);
  }


  static drag$CreateDraggableList(animate=true, rowHeight = this.props.rowHeight,items = this.props.el$(".nav-creator-list-item").el){

    const createDragItem = (el, index)=>{
      el._gsTransform = undefined;
      const totalRows = items.length;
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
        TweenMax.to(el, .125, {y:rowHeight, ease: Power1.easeInOut, onComplete:this.drag$ReOrder});
      };


      const onClickTest = (item)=>{
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
      const rowHeightStart = indexStart * rowHeight;
      if (animate===true && position.y !== index*rowHeight) {
        TweenMax.fromTo(el, .25,
            {y: rowHeightStart, opacity:0},
            {y: index * rowHeight, opacity:1, ease: Power1.easeInOut});
      };
      let obj = {el,position, index, dragger};
      return obj;

    };
    items = items.length !== undefined ? items : [items];
    return values(mapObjIndexed(createDragItem, items));
  }


  static drag$InitDraggable(animate=true){
    this.props.dragItems = this.drag$CreateDraggableList(animate);
  }
}