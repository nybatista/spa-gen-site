import {SpyneTrait} from 'spyne';
import {gsap, Draggable} from 'gsap/all';
import {TweenMax, TimelineMax} from 'gsap';
import {mapObjIndexed, reduce, add, slice,  map, filter, update, reject, multiply, range, compose, pathEq, prop, path, values} from 'ramda';

export class DragListTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dragList$';

    gsap.registerPlugin(Draggable);
    super(context, traitPrefix);

  }

  static dragList$OnDragUp(obj){
    return (tgt)=>{
       const el = obj.el;
       console.log("target is ",tgt);
       //const rowHeight = this.dragMethod$GetHeight(obj.index);// obj.index * this.props.rowHeight;
      // TweenMax.to(el, .125, {y:rowHeight, ease: Power1.easeInOut, onComplete:this.dragMethod$ReOrder});
      //this.dragMethod$ReOrder();

      //console.log('-------on up----------',{rowHeight}, this.props.dragHeightsArr,obj)
      let txt = o => o.el.querySelector('input').value;

      const getObjInfo = o=>console.log('o is ',o.index,txt(o),{o});
     // this.props.dragItems = this.dragList$CreateList();

      this.props.dragItems.forEach(getObjInfo);

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
      //max = max<=0 ? 1 : max;
     // const rowIndex = Math.abs(clamp(max, 0,  totalRows));
      //const rowIndex = Math.abs(clamp(Math.round(itemY / rowHeight), 0, totalRows));
      const rowIndex = this.dragMethod$GetNearestHeight(itemY);
      const currentIndex = obj.index*1;
      const changeIndex = rowIndex !== currentIndex;
      console.log("CHANGE INDEX ",{changeIndex, itemY, rowIndex, currentIndex, totalRows}, this.props.dragItems);

      if (changeIndex === true){
        count ++;

        //console.log("CHANGE INDEX ",{obj,currentIndex,rowIndex});
         obj =  this.dragMethod$UpdateIndex(obj, currentIndex, rowIndex);
          //obj.index = rowIndex;

      }

    }


  }


  static dragList$UpdateItems(sortable, to){


    const updatePos = (dragObj,i) =>{
      console.log("drag obj i ",{dragObj,i},dragObj.setIndex);
      dragObj.index = i*1;
      let rowHeight = this.dragMethod$GetHeight(i);
      let txt = dragObj.el.querySelector('input').value;
      const isDragging = dragObj.dragger.isDragging;
      const orig = dragObj.origIndex;
      const id = dragObj.dragger.target.id;
      console.log('dragObj --- ',{i,isDragging,dragObj,txt,id,orig,i,rowHeight},dragObj.index);

      if (dragObj.dragger.isDragging !== true){
        TweenMax.to(dragObj.el, .125, {y:rowHeight});
      }
        return dragObj;
    }


    function arrayMove(a, item, to) {
      let arr = [...a]
      let temp = arr[to];
      arr[to] = item;
      arr[item.index]=temp;

      let txt = d=> console.log("arr -- ",d.index,d.el.querySelector('input').value);
      console.log('array ',a);
      arr.forEach(txt);

     // return array.splice(to, 0, array.splice(from, 1)[0]);
      return arr;
    }

    console.log('update ');

    let arrSortables = this.props.ubu !== undefined ? this.props.ubu : this.props.dragItems;
    let ubu = arrayMove(this.props.dragItems, sortable, to);

    ubu = ubu.map(updatePos);

   this.props.dragItems = ubu;// arrayMove(this.props.dragItems, sortable, to);

    console.log("DRAG ITEMS ",this.props.dragItems);



    //this.props.dragItems.forEach(updatePos);


  }



  static dragList$SwapIndexes(dragger, from, to){

    const animateLayout = ()=>{

      const onAnimate = (d)=>{
        const {target} = d;
        const vars = d.vars.sortable;;
        const isDragging = vars.isDragging;

        const index = d.vars.index * 1;
        console.log('on Anim ',{index, d, isDragging, vars});
        if (isDragging !== true) {
          const h = index * 40;
          TweenMax.to(target, .125, {y: h});
        }
      }

      this.props.dragItems.forEach(onAnimate);
    };


    //  to  = String(to);
    const pred = R.compose(R.head, R.filter(R.pathEq(['vars', 'sortable', 'index'], to)));
    let switchDragger =  pred(this.props.dragItems);

    console.log('switch dragger ',dragger.isDragging, dragger.vars.isDragging,{dragger,switchDragger, from,to}, this.props.dragItems);
    if (switchDragger!==undefined) {
       switchDragger.vars.sortable.index = from;
       dragger.vars.sortable.index = to;
       this.props.dragItems[from] = switchDragger;
       this.props.dragItems[to] = dragger;
       animateLayout();
    }
  }



  static dragList$CreateList(animate=true, rowHeight = this.props.rowHeight,items = this.props.el$(this.props.listClass).el){





    const onClick = (e)=>{

      console.log("----ON PRESS this is ",this);

      let txt = o => o.el.querySelector('input').value;
      const getObjInfo = o=>console.log('o is ',o.index, txt(o), {o});

      this.props.dragItems.forEach(getObjInfo);

    }



    const createDragItem = (el, index)=>{
      el._gsTransform = undefined;



      const totalRows = items.length;
      const heightsArr = this.dragMethod$GetHeightsArr();


      const onDragging =  (e)=>{
        const clamp = (value, a, b)=> value < a ? a : value > b ? b : value;
        const {index} = dragger.vars.sortable;
        const {y} = dragger;
        const rowIndex = this.dragMethod$GetNearestHeight(y);

        const changeIndex = rowIndex*1 !== index*1;

        if (changeIndex === true){
          dragger.vars.sortable.isDragging = true;
          console.log("DRAGGER BEFORE SWQP ",{dragger})
          this.dragList$SwapIndexes(dragger, index, rowIndex);
        }

        //console.log("ON DRAGGING ",{e,dragger,y,rowIndex,index});

/*        const itemY = obj.position.y;
        const rowHeight = this.props.rowHeight;//= this.dragMethod$GetHeight(obj.index);
        let max = Math.round(itemY / rowHeight);
        const totalRows = this.props.el$(this.props.listClass).len;// obj.totalRows - 1;
        //max = max<=0 ? 1 : max;
        // const rowIndex = Math.abs(clamp(max, 0,  totalRows));
        //const rowIndex = Math.abs(clamp(Math.round(itemY / rowHeight), 0, totalRows));
        const rowIndex = this.dragMethod$GetNearestHeight(itemY);
        const currentIndex = obj.index*1;
        const changeIndex = rowIndex !== currentIndex;
       // console.log("CHANGE INDEX ",{changeIndex, itemY, rowIndex, currentIndex, totalRows}, this.props.dragItems);

        if (changeIndex === true){

          //console.log("CHANGE INDEX ",{obj,currentIndex,rowIndex});
          // this.dragMethod$UpdateIndex(obj, currentIndex, rowIndex);

          this.dragList$UpdateItems(obj, rowIndex);
          //obj.index = rowIndex;

        }*/

      }



      const dragger = new Draggable(el, {
        type: 'y',
        onDrag: onDragging,
        clickableTest: this.dragList$OnClickTest,
        throwProps1:true,
        snap1: this.props.dragHeightsArr,
        dragClickables: false,
        bounds: document.querySelector('#creative-list-holder'),
        callbackScope: el
      });

      let position = el._gsTransform;
      let indexStart = index-1;
      indexStart =  indexStart<= 0 ? 0 : indexStart;
      let rowHeightStart = 0;//this.dragMethod$GetHeight(indexStart, heightsArr);
      let rowHeightTo  = this.dragMethod$GetHeight(index, heightsArr);

/*      if (animate===true && position.y !== index*rowHeight) {
        TweenMax.fromTo(el, .25,
            {y: rowHeightStart, opacity:0},
            {y: rowHeightTo, opacity:1, ease: Power1.easeInOut});
      }*/
      let obj = {};
      obj.el = el;
      obj.position = position;
      obj.index= index*1;
      obj.foo = index;
      obj.isDragging= false;
      obj.origIndex = Math.floor(Math.random()*9000);
      obj.totalRows = totalRows;
      obj.dragger = dragger;
      obj.setIndex = i => obj.setIndex = i;
      console.log("DRAG INIT OBJ ",index, obj);
      dragger.vars.sortable = obj;
      dragger.vars.index = index;
      return dragger;

    };
    console.log("ITEMS IS ",items);

    items = items.length !== undefined ? items : [items];
    return values(mapObjIndexed(createDragItem, items));
  }


}