import {partialRight,clamp,findLastIndex,findIndex,gte, sortBy,prop, lte, pick,pluck, compose,head,filter,propEq} from 'ramda';

export class BarItemsSorter{

  constructor(liItems, id) {
    this.listItems = liItems;
    this.draggerId = id;
   // console.log("SORTER ",this);
    this.barItemsSortArr = BarItemsSorter.createSorterObject(this.listItems, id);
    this.getBarItemsYPositions = BarItemsSorter.getBarItemsYPositions.bind(this);
    this.getDraggerObj = BarItemsSorter.getDraggerObj.bind(this);
    this.setDraggerObj = BarItemsSorter.setDraggerObj.bind(this);
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
      this.barItemsSortArr[yIndex].index = draggerIndex;
      this.barItemsSortArr  =  sortBy(prop('index'), this.barItemsSortArr);
      this.barItemsSortArr  = BarItemsSorter.addGsapYPos(this.barItemsSortArr);
      const swapItems = (filter(filterChangedItems))(this.barItemsSortArr);
      const swapItemsIds = pluck('id', swapItems);
     //console.log("SWAP ITEMS ",{swapItems})

      return {swapItems, swapItemsIds}

    }

    return undefined;

  }

   checkDragYPosition(y, dragVsid){

    // THE ARRAY OF Y POSITIONS, ADDING A LARGE VALUE TO MAKE FINDINDEX WORK CORRECTLY
    const arr = this.getBarItemsYPositions();
    arr.push(1000000);
    const len = arr.length-2;

    // getTheIndex COMPARES THE Y VALUES IN THE ARRAY WITH THE CURRENT DRAGGER Y
    const getTheIndex = compose(clamp(0,len),findIndex(lte(y)));
    const yIndex = getTheIndex(arr);


    // THIS GETS THE CURRENT DRAGGER INDEX
    const draggerObj = this.getDraggerObj();
    const draggerIndex = draggerObj.index;
     //console.log("INDEX: ",{yIndex,draggerIndex,len})

    // THIS CHECKS TO SEE IF THE INDEX OF THE DRAGGER HAS CHANGED
    const isNewIndex = yIndex !== draggerIndex;

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

  static addItemToArr(id, arr=ths.barItemsSortArr){
    // RESET HAS CHANGED TO FALSE
    //  CREATE ITEM AND APPEND TO CURRENT ARR
    //  ADD YGSAP ONLY TO LAST ITEM
    // RETURN LAST ITEM

    /*
    *  TODO: FOR TOP BAR HOLDER, IT NEEDS TO REDO HEIGHTS CHECK FOR BOTH ADD AND DELETE
    *   IN THAT CASE,
    *   1. SET HAS CHANGED TO FALSE FOR ALL
    *   2. UPDATE HEIGHTS
    *   3. IF yGSAP has changed, return true
    *
    * */

  }


  static removeItemFromArr(id, arr=this.barItemSortArr){
    const getIds = (el)=>console.log("EL ",el.id);
    arr.forEach(getIds);
    console.log("ID ",{id,arr});

    // REMOVE ITEM BY ID

    // UPDATE HEIGHTS FOR ALL

    // RESET HAS CHANGED ALL TO FALSE

    // UPDATE YGSAP / MIDPT FOR ALL  -- AUTO HAS CHANGED TO TRUE


    // RETURN ONLY CHANGED ITEMS



    return id;
  }


  static getBarItemHeight(liEl){
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
      } else{
        const itemHeight = pullHeightFromBox(listItem);
        height += listItem.offsetHeight;
      }
    }
      // INIT RECURSIVE FUNCTION
      if (hasMainSubNav===true) {
        getTheHeight(liEl);
      }
      return height;

  }

  static getDataFromBoundingBox(el,n, list, draggerId){
    const box = el.getBoundingClientRect();
    let {height,y,top}=box;
    //height = parseInt(height);

    height = BarItemsSorter.getBarItemHeight(el);

    const id = el.id;
    //console.log("HEIGHTS ",{height,id})

    const midPt = height*.95;// height/2;
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
          yG = v;
          hasChanged = true;
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
    const getGsapYPos = (index)=>R.sum(R.take(index,heightsArr))
    // ADD THE CORRECT Y POS FOR GSAP AND CREATE THE MIDPOINTS FOR ARR CHECK
    const addGsapY = (obj)=>{
     // obj.yGsap = getGsapYPos(obj.index);
      obj._yGsap = getGsapYPos(obj.index);
      obj.yCheck = obj.yGsap + obj.midPt;
      return obj;
    }
    return arr.map(addGsapY);
  }

  get sortArr(){
      return this.barItemsSortArr;
  }

  set sortArr(obj){
    this.barItemsSortArr = obj;
  }



}