import {SpyneTrait} from 'spyne';
import {gsap,Draggable, InertiaPlugin} from 'gsap/all';
import {TweenMax, TimelineMax} from 'gsap';
import {mapObjIndexed, reduce, add, slice, clamp, map, filter, reject, multiply, range, compose, pathEq, prop, path, values} from 'ramda';

export class DragListTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dragList$';
    gsap.registerPlugin(Draggable);
    gsap.registerPlugin(InertiaPlugin);
    super(context, traitPrefix);

  }


  static dragList$CreateList(animate=true, rowHeight = this.props.rowHeight,items = this.props.el$(this.props.listClass).el){

    const createDragItem = (el, index)=>{
      el._gsTransform = undefined;
      const totalRows = items.length;
      const heightsArr = this.dragMethod$GegHeightsArr();

      const clamp = (value, a, b)=> value < a ? a : value > b ? b : value;
      const onDragging=()=>{
        //console.log("OBJ IS ",obj);
        const itemY = gsap.getProperty(obj.el, 'y');
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
        gsap.to(el, .125, {y:rowHeight, ease: "Power1.easeInOut", onComplete:this.dragMethod$ReOrder});
      };


      const onClickTest = (item)=>{
        const tagName = item.tagName.toLowerCase();
        const nearestUl = prop('id', item.closest('ul'));
        const liParent = path(['dataset', 'parentId'], item.closest('li'));
        const subNavUl = this.props.el$('div.node-hangar ul').arr;

        //console.log("SUB NAV UL ",{subNavUl});
        const isSubNav =  subNavUl[0] !== undefined && subNavUl[0].contains(item);
        return ['i','input','p.add-subnav', 'ul'].indexOf(tagName)>=0  || isSubNav === true;
      };

      //console.log("EL IS ",{el});

      const dragger =  Draggable.create(el, {
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

      if (animate===true && gsap.getProperty(el, 'y') !== index*rowHeight) {
        gsap.fromTo(el, .25,
            {y: rowHeightStart, opacity:0},
            {y: rowHeightTo, opacity:1, ease: '"Power1.easeInOut"'});
      };
      let obj = {el,position, index, dragger};
      return obj;

    };
    items = items.length !== undefined ? items : [items];
    return values(mapObjIndexed(createDragItem, items));
  }


}