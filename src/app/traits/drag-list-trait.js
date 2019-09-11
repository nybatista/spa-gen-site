import {SpyneTrait} from 'spyne';
import {Draggable} from 'gsap/Draggable';
import {TweenMax, TimelineMax} from 'gsap';
import {mapObjIndexed, reduce, add, slice,  map, filter, reject, multiply, range, compose, pathEq, prop, path, values} from 'ramda';

export class DragListTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dragList$';
    super(context, traitPrefix);

  }

  static dragList$OnDragUp(obj){
    return ()=>{
       const el = obj.el;
       const rowHeight = this.dragMethod$GetUpHeight(obj.index);// obj.index * this.props.rowHeight;
       TweenMax.to(el, .125, {y:rowHeight, ease: Power1.easeInOut,
         onComplete:this.dragMethod$ReOrder});
    }
  }

  static dragList$OnClickTest(item){
    const tagName = item.tagName.toLowerCase();
    const subNavUl = this.props.el.querySelector('div.node-hangar ul');
    const isSubNav =  subNavUl !== null && subNavUl.contains(item);
    return ['i','input','p.add-subnav', 'ul'].indexOf(tagName)>=0  || isSubNav === true;
  }


  static dragList$OnDragging(obj){
      let count = 0;
    return ()=>{
      const clamp = (value, a, b)=> value < a ? a : value > b ? b : value;
      const itemY = obj.position.y;
      const rowHeight = this.props.rowHeight;//= this.dragMethod$GetHeight(obj.index);
      let max = Math.round(itemY / rowHeight);
      const totalRows = this.props.el$(this.props.listClass).len;// obj.totalRows - 1;
      const rowIndex = this.dragMethod$GetNearestHeight(itemY);
      const currentIndex = obj.index*1;
      const changeIndex = rowIndex !== currentIndex;
      if (changeIndex === true && count!==-10){
        count ++;
        this.dragMethod$UpdateIndex(obj, currentIndex, rowIndex, this.props.dragItems);
      }
    }
  }


  static dragList$CreateList(animate=true, rowHeight = this.props.rowHeight,items = this.props.el$(this.props.listClass).el){
    const vsid = this.props.vsid;
    console.log("CREATE LIST ",{animate, vsid},this.constructor.name)
    const createDragItem = (el, index)=>{
      el._gsTransform = undefined;
      let position;
      let obj = {};

      const totalRows = items.length;
      const heightsArr = this.dragMethod$GetHeightsArr();


      const dragger = new Draggable(el, {
        type: 'y',
        onDrag: this.dragList$OnDragging(obj),
        onClick: this.dragState$OnItemClicked,
        clickableTest: this.dragList$OnClickTest,
        onRelease: this.dragList$OnDragUp(obj),
        dragClickables: false,
        bounds: document.querySelector('#creative-list-holder'),
        scope: el
      });

      position = el._gsTransform;
      let indexStart = index-1;
      indexStart =  indexStart<= 0 ? 0 : indexStart;
      let rowHeightStart = this.dragMethod$GetHeight(indexStart, heightsArr);
      let rowHeightTo  = this.dragMethod$GetHeight(index, heightsArr);

      if (animate===true && position.y !== index*rowHeight) {
        TweenMax.fromTo(el, .25,
            {y: rowHeightStart, opacity:0},
            {y: rowHeightTo, opacity:1, ease: Power1.easeInOut});
      }

      obj.el = el;
      obj.position = position;
      obj.index= index*1;
      obj.origIndex = Math.random();
      obj.totalRows = totalRows;
      obj.dragger = dragger;
     // console.log("DRAG INIT OBJ ",index, obj);

      return obj;

    };
    items = items.length !== undefined ? items : [items];
    return values(mapObjIndexed(createDragItem, items));
  }


}