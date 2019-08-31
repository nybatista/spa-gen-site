import {SpyneTrait} from 'spyne';
import {Draggable} from 'gsap/Draggable';
import {TweenMax, TimelineMax} from 'gsap';
import {mapObjIndexed, reduce, add, slice, clamp, map, filter, reject, multiply, range, compose, pathEq, prop, path, values} from 'ramda';

export class DragListTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dragList$';
    super(context, traitPrefix);

  }


  static dragList$CreateList(animate=true, rowHeight = this.props.rowHeight,items = this.props.el$(this.props.listClass).el){

    const createDragItem = (el, index)=>{
      el._gsTransform = undefined;
      const totalRows = items.length;
      const heightsArr = this.dragMethod$GegHeightsArr();

      const clamp = (value, a, b)=> value < a ? a : value > b ? b : value;
      const onDragging=()=>{
        const itemY = obj.position.y;
        const rowIndex = Math.abs(clamp(Math.round(itemY / rowHeight), 0, totalRows - 1));
        const currentIndex = obj.index*1;
        const changeIndex = rowIndex !== currentIndex;
        if (changeIndex === true){
          this.dragMethod$UpdateIndex(obj, currentIndex, rowIndex);
        }
      };

      const onDragUp = ()=>{
        const el = obj.el;
        const rowHeight = this.dragMethod$GetHeight(obj.index);// obj.index * this.props.rowHeight;
        TweenMax.to(el, .125, {y:rowHeight, ease: Power1.easeInOut, onComplete:this.dragMethod$ReOrder});
      };


      const onClickTest = (item)=>{
        const tagName = item.tagName.toLowerCase();
        const nearestUl = prop('id', item.closest('ul'));
        const liParent = path(['dataset', 'parentId'], item.closest('li'));
        const subNavUl = this.props.el.querySelector('div.node-hangar ul');
        const isSubNav =  subNavUl !== null && subNavUl.contains(item);
        return ['i','input','p.add-subnav', 'ul'].indexOf(tagName)>=0  || isSubNav === true;
      };

      const dragger = new Draggable(el, {
        type: 'y',
        onDrag: onDragging,
        dragClickables: false,
        clickableTest: onClickTest,
        onRelease: onDragUp,
        bounds: document.querySelector('#creative-list-holder'),
        scope: el
      });

      let position = el._gsTransform;
      let indexStart = index-1;
      indexStart =  indexStart<= 0 ? 0 : indexStart;
      let rowHeightStart = indexStart * rowHeight;

      rowHeightStart = this.dragMethod$GetHeight(indexStart, heightsArr);
      let rowHeightTo  = this.dragMethod$GetHeight(index, heightsArr);

      if (animate===true && position.y !== index*rowHeight) {
        TweenMax.fromTo(el, .25,
            {y: rowHeightStart, opacity:0},
            {y: rowHeightTo, opacity:1, ease: Power1.easeInOut});
      };
      let obj = {el,position, index, dragger};
      return obj;

    };
    items = items.length !== undefined ? items : [items];
    return values(mapObjIndexed(createDragItem, items));
  }


}