import {SpyneTrait} from 'spyne';
import {Draggable} from 'gsap/Draggable';
import {TweenMax, TimelineMax} from 'gsap';
import {mapObjIndexed, reduce, add, slice, clamp, map, filter, reject, multiply, range, compose, pathEq, prop, path, values} from 'ramda';

export class DraggableTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'drag$';
    super(context, traitPrefix);

  }

  static drag$GetListClass(){
    return `node-item-${this.props.vsid}`;
  }


  static drag$UpdateIndex(obj, from ,to, dragItems = this.props.dragItems){
    let tempObj = this.props.dragItems[to];
    dragItems[to] = obj;
    obj.index = to;
    dragItems[from] = tempObj;
    tempObj.index = from;
    let el = tempObj.el;
    let rowHeight = tempObj.index * this.props.rowHeight;
    rowHeight = this.drag$GetHeight(tempObj.index);
    TweenMax.to(el, .125, {y:rowHeight, ease: Power1.easeInOut});
  }

  static drag$GegHeightsArr(){
    const mapHeights = (obj)=>{
      let h = this.props.rowHeight;
      let el = obj.el;
      let nodeItemsLen = el.querySelectorAll('div.node-hangar ul li').length;
      let nodesHeight = nodeItemsLen * h;
      let finalHeight = h+nodesHeight;
      //console.log(" H NODECONTAINER ",{h,finalHeight,nodesHeight,el});
      return finalHeight;

    };

    let items = this.props.dragItems ? this.props.dragItems : this.props.el$(this.props.listClass).el;
    //console.log("HEIGHTS ARR ",this.props.vsid,map(mapHeights, items));
    return map(mapHeights, items);
  }

  static drag$GetHeight(index=0, arr = this.drag$GegHeightsArr()){
        return reduce(add,0, slice(0, index, arr))
  }



  static drag$RemoveDeletedDragItem(id, dragItems=this.props.dragItems){
    const rejectId = reject(pathEq(['el', 'id'], id));

    dragItems = rejectId(dragItems);
    return dragItems;
  }

  static drag$ResetPositions(createDragFn = this.drag$CreateDraggableList){
    const tl = new TimelineMax({paused:true, onComplete:this.createDragFn});
    const rowHeight = this.props.rowHeight;
    let heightsArr = this.drag$GegHeightsArr();
    const onUpdateItem =(el, i)=>{
      const height = this.drag$GetHeight(i, heightsArr) ;// i*rowHeight;
      tl.to(el, .125, {y:height, ease: Power1.easeInOut});
    };

    let items = this.props.el$(this.props.listClass).el;
    items = items.length !== undefined ? items : [items];

    items.forEach(onUpdateItem);
    tl.play();

  }

  static drag$ReOrder(el=this.props.el, dragItems = this.props.dragItems){
    const reorder = (obj)=> el.appendChild(obj.el);
    dragItems.forEach(reorder);
  }


  static drag$CreateDraggableList(animate=true, rowHeight = this.props.rowHeight,items = this.props.el$(this.props.listClass).el){

    const createDragItem = (el, index)=>{
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

        const nearestUl = prop('id', item.closest('ul'));
        const liParent = path(['dataset', 'parentId'], item.closest('li'));
        const noParentDrag = nearestUl === undefined || nearestUl !== liParent;
       // const isSubNav =  this.props.el$('div.node-hangar ul').exists === true &&  this.props.el$('div.node-hangar ul').el.contains(item);
        //console.log("ITEM IS ",this.props.vsid,item, this.props.el$('div.node-hangar ul').exists);
        const subNavUl = this.props.el.querySelector('div.node-hangar ul');
        const isSubNav =  subNavUl !== null && subNavUl.contains(item);
       //console.log("CLICKADY CLACK ",{obj,item,subNavUl, isSubNav});
        //console.log("ITEM IS ",{item,liParent, nearestUl, noParentDrag},item.closest('ul'));
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

    };
    items = items.length !== undefined ? items : [items];
    return values(mapObjIndexed(createDragItem, items));
  }


  static drag$InitDraggable(animate=true){
    this.props.dragItems = this.drag$CreateDraggableList(animate);
  }
}