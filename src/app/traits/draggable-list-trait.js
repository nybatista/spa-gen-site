import {SpyneTrait} from 'spyne';
import {Draggable} from 'gsap/Draggable';

export class DraggableListTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dragList$';
    super(context, traitPrefix);

  }

  static createDragItem(el, index){
    el._gsTransform = undefined;
    const totalRows = items.length;
    const heightsArr = this.drag$GegHeightsArr();

    const clamp = (value, a, b)=> value < a ? a : value > b ? b : value;
    const onDragging=()=>{
      const itemY = obj.position.y;
      const rowIndex = Math.abs(clamp(Math.round(itemY / rowHeight), 0, totalRows - 1));
      const currentIndex = obj.index*1;
      const changeIndex = rowIndex !== currentIndex;

      //console.log("ON DRAGGING: ",{el, totalRows,itemY, rowIndex, currentIndex, changeIndex, heightsArr},this.props.el);
      if (changeIndex === true){
        this.drag$UpdateIndex(obj, currentIndex, rowIndex);
      }
    };

    const onDragUp = ()=>{
      const el = obj.el;
      const rowHeight = this.drag$GetHeight(obj.index);// obj.index * this.props.rowHeight;
      //console.log("ROW HEIGHT INDEX ",this.drag$GetHeight(obj.index));
      TweenMax.to(el, .125, {y:rowHeight, ease: Power1.easeInOut, onComplete:this.drag$ReOrder});
    };


    const onClickTest = (item)=>{
      const tagName = item.tagName.toLowerCase();
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

    rowHeightStart = this.drag$GetHeight(indexStart, heightsArr);
    let rowHeightTo  = this.drag$GetHeight(index, heightsArr);

    if (animate===true && position.y !== index*rowHeight) {
      TweenMax.fromTo(el, .25,
          {y: rowHeightStart, opacity:0},
          {y: rowHeightTo, opacity:1, ease: Power1.easeInOut});
    };
    let obj = {el,position, index, dragger};

    //console.log("ANIM START ",{rowHeightStart, rowHeightTo, el,position,index,dragger});
    return obj;
  }


  static drag$CreateDraggableList(animate=true, rowHeight = this.props.rowHeight,items = this.props.el$(this.props.listClass).el){

    const createDragItem = (el, index)=>{


    };
    items = items.length !== undefined ? items : [items];
    return values(mapObjIndexed(this.createDragItem, items));
  }




}