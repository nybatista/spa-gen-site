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
/*    let tempObj =  this.props.dragItems[to];
    dragItems[to] = obj;
    obj.index = to;
    dragItems[from] = tempObj;
    tempObj.index = from;
    let el = tempObj.el;
    let rowHeight = this.dragMethod$GetHeight(tempObj.index);
    console.log("UPDATE INDEX ",{tempObj, rowHeight, el, dragItems, obj});
    TweenMax.to(el, .125, {y:rowHeight, ease: Power1.easeInOut});*/
    let txt = o => o.el.querySelector('input').value;
    const getObjInfo = o=>console.log('o is ',o.index, txt(o), {o});


    let tempObj = dragItems[to];
    dragItems[to] = obj;
    obj.index = to;
    dragItems[from] = tempObj;
    tempObj.index = from;
    let el = tempObj.el;
    //let rowHeight = tempObj.index * this.props.rowHeight;
    let rowHeight = this.dragMethod$GetHeight(tempObj.index);
    console.log('-----update index------------',{from, to, rowHeight}, obj.index, tempObj.index);

    this.props.dragItems.forEach(getObjInfo);

    TweenMax.to(el, .125, {y:rowHeight, ease: Power1.easeInOut});




  }


  static dragMethod$GetHeightsAddedArr(){

    let arr = this.dragMethod$GetHeightsArr()
    const mapValsIndexed = (val, index)=>{
      //console.log("VAL AND INDEX ",{val,index})

     return reduce(add,0, slice(0, index, arr));
    }

    let newArr = arr.map(mapValsIndexed);
    return newArr
  }

  static dragMethod$GetNearestHeight(yPos){
    let arr = [...this.props.dragHeightsArr];
    //arr.push(1000000);
   // const getIndex = compose(clamp(0, arr.length-2), findIndex(lte(yPos)));
    const getLastIndex = compose(clamp(0, arr.length-1), findLastIndex(gte(yPos)));
   // console.log("ARR IS ",arr, {yPos}, getLastIndex(arr));

    return getLastIndex(arr);
   }



  static dragMethod$GetHeightsArr(){
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
   // console.log("HEIGHTS ARR ",this.props.vsid,map(mapHeights, items));
    return map(mapHeights, items);
  }

  static dragMethod$GetHeight(index=0, arr = this.dragMethod$GetHeightsArr()){
    return this.props.dragHeightsArr[index];
    //return reduce(add,0, slice(0, index, arr))
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