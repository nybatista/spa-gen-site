import {SpyneTrait} from 'spyne';
import {TweenMax, TimelineMax} from 'gsap';
import {mapObjIndexed, reduce, add, slice, clamp, map, filter, reject, multiply, range, compose, findIndex, lte, pathEq, prop, path, values} from 'ramda';


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
    console.log('-----------------',{from, to})
    const getObjInfo = o=>console.log('o is ',o.origIndex,{o});


    let tempObj = dragItems[to];
    dragItems[to] = obj;
    obj.index = to;
    dragItems[from] = tempObj;
    tempObj.index = from;
    let el = tempObj.el;
    //let rowHeight = tempObj.index * this.props.rowHeight;
    let rowHeight = this.dragMethod$GetHeight(tempObj.index);

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
    arr.push(1000000);
    //console.log("ARR IS ",arr);

    return compose(clamp(0, arr.length-2), findIndex(lte(yPos)))(arr);
   }



  static dragMethod$GetHeightsArr(){
    const mapHeights = (obj)=>{
      console.log("EL IS ",obj);

      let h = this.props.rowHeight;
      let el = obj.el !== undefined ? obj.el : obj;
      let nodeItemsLen = el.querySelectorAll('div.node-hangar ul li').length;
      let nodesHeight = nodeItemsLen * h;
      let finalHeight = h+nodesHeight;
      //console.log(" H NODECONTAINER ",{h,finalHeight,nodesHeight,el});
      return finalHeight;
    };

    let items = this.props.dragItems ? this.props.dragItems : this.props.el$(this.props.listClass).el;
    items = Array.from(items);

   console.log("HEIGHTS ARR ", items.length,{items},this.props.vsid);
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
    //const reorder = (obj)=> el.appendChild(obj.el);
  //  dragItems.forEach(reorder);
  }



}