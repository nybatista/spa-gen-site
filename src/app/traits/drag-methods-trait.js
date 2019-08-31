import {SpyneTrait} from 'spyne';
import {TweenMax, TimelineMax} from 'gsap';
import {mapObjIndexed, reduce, add, slice, clamp, map, filter, reject, multiply, range, compose, pathEq, prop, path, values} from 'ramda';


export class DragMethodsTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dragMethod$';
    super(context, traitPrefix);
  }


  static dragMethod$GetListClass(vsid=this.props.vsid){
    return `node-item-${vsid}`;
  }

  static dragMethod$UpdateIndex(obj, from ,to, dragItems = this.props.dragItems){
    let tempObj = dragItems[to];
    dragItems[to] = obj;
    obj.index = to;
    dragItems[from] = tempObj;
    tempObj.index = from;
    let el = tempObj.el;
    let rowHeight = this.dragMethod$GetHeight(tempObj.index);
    TweenMax.to(el, .125, {y:rowHeight, ease: Power1.easeInOut});
  }

  static dragMethod$GegHeightsArr(){
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

  static dragMethod$GetHeight(index=0, arr = this.dragMethod$GegHeightsArr()){
    return reduce(add,0, slice(0, index, arr))
  }

  static dragMethod$RemoveDeletedDragItem(id, dragItems=this.props.dragItems){
    const rejectId = reject(pathEq(['el', 'id'], id));
    dragItems = rejectId(dragItems);
    return dragItems;
  }

  static dragMethod$ReOrder(el=this.props.el, dragItems = this.props.dragItems){
    const reorder = (obj)=> el.appendChild(obj.el);
    dragItems.forEach(reorder);
  }



}