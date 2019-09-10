import {SpyneTrait} from 'spyne';
import {TweenMax, TimelineMax} from 'gsap';
import {mapObjIndexed, reduce, add, slice, findLastIndex, gte, clamp, map, filter, reject, multiply, range, compose, findIndex, lte, pathEq, prop, path, values} from 'ramda';


export class DragMethodsTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dragMethod$';
    super(context, traitPrefix);
  }


  static dragMethod$GetListClass(vsid=this.props.vsid){
    return `node-item-${vsid}`;
  }

  static dragMethod$UpdateIndex(obj, from ,to, dragItems = this.props.dragItems){
    let txt = o => o.el.querySelector('input').value;
    const getObjInfo = o=>console.log('o is ',o.index, txt(o), {o});
    let tempObj = dragItems[to];
    dragItems[to] = obj;
    obj.index = to;
    dragItems[from] = tempObj;
    tempObj.index = from;
    let el = tempObj.el;
    let rowHeight = this.dragMethod$GetUpHeight(tempObj.index);
    TweenMax.to(el, .125, {y:rowHeight, ease: Power1.easeInOut});

  }


  static dragMethod$GetHeightsAddedArr(){
    let arr = this.dragMethod$GetHeightsArr()
    const mapValsIndexed = (val, index)=>{
      return reduce(add,0, slice(0, index, arr));
    };
    return arr.map(mapValsIndexed);
  }

  static dragMethod$GetNearestHeight(yPos){
    let arr = [...this.props.dragHeightsArr];
    const getLastIndex = compose(clamp(0, arr.length-1), findLastIndex(gte(yPos)));
    return getLastIndex(arr);
  }


  static dragMethod$GetHeightsArr(){
    const mapHeights = (obj)=>{
      let h = this.props.rowHeight;
      let el = obj.el;
      let nodeItemsLen = el.querySelectorAll('div.node-hangar ul li').length;
      let nodesHeight = nodeItemsLen * h;
      return h+nodesHeight;
    };

    let items = this.props.dragItems ? this.props.dragItems : this.props.el$(this.props.listClass).el;
    return map(mapHeights, items);
  }

  static dragMethod$GetUpHeight(index, arr=this.dragMethod$GetHeightsAddedArr()){
    return arr[index];
  }

  static dragMethod$GetHeight(index=0, arr = this.dragMethod$GetHeightsArr()){
    return this.props.dragHeightsArr[index];
  }

  static dragMethod$RemoveDeletedDragItem(id, dragItems=this.props.dragItems){
    const rejectId = reject(pathEq(['el', 'id'], id));
    return rejectId(dragItems);
  }

  static dragMethod$ReOrder(el=this.props.el, dragItems = this.props.dragItems){
    const reorder = (obj)=> el.appendChild(obj.el);
    dragItems.forEach(reorder);
    this.props.dragItems = this.dragList$CreateList(false);
  }



}