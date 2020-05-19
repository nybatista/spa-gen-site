import {partialRight, map,addIndex,clamp,reject,findLastIndex,findIndex,gte,sum,take, sortBy,prop, lte, pick,pluck, compose,head,filter,clone,propEq} from 'ramda';
const mapIndexed = addIndex(map);

export class BarItemsSorter{

  constructor(liItems, id, disableFirstItem=false) {
    this.listItems = liItems;
    this.draggerId = id;
    this.clampStartNum = disableFirstItem === false ? 0 : 1;
   // console.log("SORTER ",this);
    this.barItemsSortArr = BarItemsSorter.createSorterObject(this.listItems, id);
    this.getBarItemsYPositions = BarItemsSorter.getBarItemsYPositions.bind(this);
    this.getDraggerObj = BarItemsSorter.getDraggerObj.bind(this);
    this.setDraggerObj = BarItemsSorter.setDraggerObj.bind(this);
    this.removeItemFromArr = BarItemsSorter.removeItemFromArr.bind(this);
    this.addItemToArr = BarItemsSorter.addItemToArr.bind(this);
  }

  /*
  *  MAIN CLASS TO CREATE THE ARRAY OF ELEMENT PROP OBJECTS
  * */
  static createSorterObject(liItems, dId){
    const boxSorterFnCurried = partialRight(BarItemsSorter.getDataFromBoundingBox, [dId]);
    let arr = Array.from(liItems).map(boxSorterFnCurried);
    arr = BarItemsSorter.addGsapYPos(arr);
    return arr;
  }


  updateBarItemsSorter(y, dragVsid){

    // ADD HAS CHANGED TO CORRECT ITEMS
    const filterChangedItems = (o)=> o.hasChanged===true;


    // RESET CHANGE VALUES TO FALSE FOR ALL
    const resetStates = (o)=>{
      o.hasChanged=false;
      o.initialized=false;
    }
    this.barItemsSortArr.map(resetStates);

    // PULL IN THE DATE FOR THE CURRENT DRAG POSITION FOR THE SELECTED DRAGGER
    let {yIndex,draggerIndex,draggerObj,isNewIndex} =  this.checkDragYPosition(y, dragVsid);

    // THE UPDATE ABOVE CHECKS THE Y MIDPOINTS ARR TO SEE IF THE DRAGGER INDEX IS DIFFERENT
    if (isNewIndex === true){
      // THIS SWAPS THE INDEXES AND SENDS THAT INFO TO THE BAR HOLDER
      draggerObj.index=yIndex;
    //  console.log("NEW ITEM IS ",this.barItemsSortArr[yIndex], {yIndex}, this.barItemsSortArr);
      this.barItemsSortArr[yIndex].index = draggerIndex;
      this.barItemsSortArr  =  sortBy(prop('index'), this.barItemsSortArr);
      this.barItemsSortArr  = BarItemsSorter.addGsapYPos(this.barItemsSortArr);
      const swapItems = (filter(filterChangedItems))(this.barItemsSortArr);
      const swapItemsIds = pluck('id', swapItems);
      //console.log("SWAP ITEMS ",{swapItems})

       return BarItemsSorter.getChangedItems(this.barItemsSortArr);

    }

    return undefined;

  }

   checkDragYPosition(y, dragVsid){

    // THE ARRAY OF Y POSITIONS, ADDING A LARGE VALUE TO MAKE FINDINDEX WORK CORRECTLY
    const arr = this.getBarItemsYPositions();
    arr.push(1000000);
    const len = arr.length-2;
    const {clampStartNum} = this;

    // getTheIndex COMPARES THE Y VALUES IN THE ARRAY WITH THE CURRENT DRAGGER Y
    const getTheIndex = compose(clamp(clampStartNum,len),findIndex(lte(y)));
    const yIndex = getTheIndex(arr);


    // THIS GETS THE CURRENT DRAGGER INDEX
    const draggerObj = this.getDraggerObj();
    const draggerIndex = draggerObj.index;
     //console.log("INDEX: ",{yIndex,draggerIndex,len})

    // THIS CHECKS TO SEE IF THE INDEX OF THE DRAGGER HAS CHANGED
    const isNewIndex = yIndex !== draggerIndex;

    //console.log("DRAGGER DATA ", {len,y,arr,yIndex,draggerIndex,draggerObj,isNewIndex});
    return {arr,yIndex,draggerIndex,draggerObj,isNewIndex};

  }

  static getDraggerObj(arr=this.barItemsSortArr){
    return compose(head, filter(propEq('isDragger', true)))(arr);
  }

  static setDraggerObj(draggerVsid, arr=this.barItemsSortArr){
    const updateIsDraggerProp = (obj)=>obj.isDragger= obj.id === draggerVsid;
   // console.log("GET ARR IS ",{arr})
    arr.map(updateIsDraggerProp);
    return this.getDraggerObj();
  }


  static getBarItemsYPositions(arr=this.barItemsSortArr){
    return pluck(['yCheck'], arr);
  }

  static updateHeightsForAllItems(arr=this.barItemsSortArr){
    const mapItemToUpdateHeight = (obj)=>{
      obj.height = BarItemsSorter.getBarItemHeight(obj.el);
      return obj;
    }

    return arr.map(mapItemToUpdateHeight);
  }



  static getChangedItems(arr){
    const filterChangedItems = (o)=>o.hasChanged === true;
    const swapItems = (filter(filterChangedItems))(arr);
    const swapItemsIds = pluck('id', swapItems);
    return {swapItems, swapItemsIds};
  }

  static resetItems(o,i){
    o.index = i;
    //console.log("ITEM IS ",{o,i});
    o.height = BarItemsSorter.getBarItemHeight(o.el);
    o.hasChanged = false;
    o.initialized = false;
    return o;
  }

  static addItemToArr(el, arr=this.barItemsSortArr){
    // RESET HAS CHANGED TO FALSE
    //  CREATE ITEM AND APPEND TO CURRENT ARR
    //  ADD YGSAP ONLY TO LAST ITEM
    // RETURN LAST ITEM
    //console.log("ARR BEFORE ",clone(arr));

    if (el!==null){
      //console.log("EL IS ",el);
      const newObj = BarItemsSorter.getDataFromBoundingBox(el,arr.length-1);
      arr.push(newObj);
    }

    mapIndexed(BarItemsSorter.resetItems, arr);
    this.barItemsSortArr = BarItemsSorter.addGsapYPos(arr);
    if (el!==null) {
      this.barItemsSortArr[this.barItemsSortArr.length - 1].hasChanged = true;
    }
    //console.log("ARR AFTER ",clone(arr));

    /*
    *  TODO: FOR TOP BAR HOLDER, IT NEEDS TO REDO HEIGHTS CHECK FOR BOTH ADD AND DELETE
    *   IN THAT CASE,
    *   1. SET HAS CHANGED TO FALSE FOR ALL
    *   2. UPDATE HEIGHTS
    *   3. IF yGSAP has changed, return true
    *
    * */
    return BarItemsSorter.getChangedItems(this.barItemsSortArr);
  }



  static removeItemFromArr(id, arr=this.barItemsSortArr){
   // const getIds = (o)=>console.log("id :",o.id);
    //arr.forEach(getIds);

    arr = compose(mapIndexed(BarItemsSorter.resetItems),reject(propEq('id', id)))(arr);
    this.barItemsSortArr = BarItemsSorter.addGsapYPos(arr);
   // const {swapItems,swapItemsIds} = BarItemsSorter.getChangedItems(arr);

   // console.log("ID ",{id,arr, swapItems,swapItemsIds});

    // REMOVE ITEM BY ID

    // UPDATE HEIGHTS FOR ALL

    // RESET HAS CHANGED ALL TO FALSE

    // UPDATE YGSAP / MIDPT FOR ALL  -- AUTO HAS CHANGED TO TRUE


    // RETURN ONLY CHANGED ITEMS



    return BarItemsSorter.getChangedItems(this.barItemsSortArr);

  }


  static getBarItemHeight(liEl, paddingNum=5){
    const pullHeightFromBox = el=>el.getBoundingClientRect().height;
    let height = pullHeightFromBox(liEl.querySelector('section.input-bar'))
    const subUlItemsSel = 'ul.route-bar-items-list li';
    const hasMainSubNav = liEl.querySelector(subUlItemsSel)!==null;

    // RECURSIVE FUNCTION TO COLLECT HEIGHTS OF NESTED LI ITEMS
    const getTheHeight = (listItem)=>{

      //CHECK IF LI ITEM HAS A SUBNAV UL
      const subUlItems = listItem.querySelectorAll(subUlItemsSel);

      // IF SUB ITEMS EXIST, LOOP THOSE ITEMS, ELSE RETURN LAST TERMINATED ITEM
      if (subUlItems.length>0){
        Array.from(subUlItems).forEach(getTheHeight)
        paddingNum=10;//paddingNum*2;

      } else{
        const itemHeight = pullHeightFromBox(listItem);
        height += listItem.offsetHeight+paddingNum;
        paddingNum=0;//paddingNum-paddingNum;
      }
    }
      // INIT RECURSIVE FUNCTION
      if (hasMainSubNav===true) {
        getTheHeight(liEl);
      }

      //console.log("HEIGHT IS ",{height});
      return height+paddingNum;

  }

  static getDataFromBoundingBox(el,n, list, draggerId){
    const box = el.getBoundingClientRect();
    let {height,y,top}=box;
    //height = parseInt(height);

    height = BarItemsSorter.getBarItemHeight(el);

    const id = el.id;
    //console.log("HEIGHTS ",{height,id})

    const midPt = height*.5;// height/2;
    const isDragger = el.id === draggerId;
    let num = n;
  //  let yPos = y!==undefined ? y : top;
    let hasChanged = false;
    let initialized = true;
  // let yGsap=0;
    let yG = 0;
    const sortObj = {
      height,id,el, midPt,isDragger,initialized,
      yGsap:yG
    }
   // sortObj.yGsap=yGsap;

    Object.defineProperties(sortObj,  {

      el: {
        get: ()=>document.getElementById(id)
      },
      num: {
        get: ()=> n
      },
      yGsap: {
        get: ()=>yG
      },
      hasChanged: {
        get: ()=>hasChanged,
        set: (b)=>hasChanged=b

      },
      index: {
        set: (n)=>{
          num=n
          hasChanged = true
        },
        get: ()=>num
      },
      _yGsap: {
        set: (v)=>{
          //hasChanged = true;
          hasChanged = v !== yG;
          yG = v;
        },
        get: ()=>yG
      }
    });

    return sortObj;

  }

  static addGsapYPos(arr){
    // CREATE ARRAY OF HEIGHTS
    const heightsArr = pluck('height', arr);
    //console.log('heights arr ',heightsArr);
    // CREATE CORRECT Y POSITION BY ADDING UP PREVIOUS HEIGHTS
    const getGsapYPos = (index)=>sum(take(index,heightsArr))
    // ADD THE CORRECT Y POS FOR GSAP AND CREATE THE MIDPOINTS FOR ARR CHECK
    const addGsapY = (obj)=>{
     // obj.yGsap = getGsapYPos(obj.index);
      obj._yGsap = getGsapYPos(obj.index);
      obj.yCheck = obj.yGsap + obj.midPt;
      return obj;
    }
    return arr.map(addGsapY);
  }

  get itemsArr(){
    return pluck(['el'], this.barItemsSortArr);
  }

  get sortArr(){
      return this.barItemsSortArr;
  }

  set sortArr(obj){
    this.barItemsSortArr = obj;
  }



}