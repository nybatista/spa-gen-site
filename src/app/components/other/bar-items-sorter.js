import {partialRight,clamp,findLastIndex,findIndex,gte, sortBy,prop, lte, pick,pluck, compose,head,filter,propEq} from 'ramda';

export class BarItemsSorter{

  constructor(liItems, id) {
    this.listItems = liItems;
    this.draggerId = id;
   // console.log("SORTER ",this);
    this.barItemsSortArr = BarItemsSorter.createSorterObject(this.listItems, id);
    this.getBarItemsYPositions = BarItemsSorter.getBarItemsYPositions.bind(this);
    this.getDraggerObj = BarItemsSorter.getDraggerObj.bind(this);
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
    let {arr,yIndex,draggerIndex,draggerObj,isNewIndex} =  this.checkDragYPosition(y, dragVsid);
    console.log("ARR START ",{arr});
    if (isNewIndex === true){
       draggerObj.index=yIndex;
      this.barItemsSortArr[yIndex].index = draggerIndex;
      this.barItemsSortArr  =  sortBy(prop('index'), this.barItemsSortArr);
      this.barItemsSortArr  = BarItemsSorter.addGsapYPos(this.barItemsSortArr);
    }

    console.log("CHECK YS ",{arr,y,yIndex,draggerIndex,isNewIndex});
    console.log("DRAG OBJ ",this.checkDragYPosition(y, dragVsid) ," ----- ")

  }

   checkDragYPosition(y, dragVsid){
    const arr = this.getBarItemsYPositions();
    const len = arr.length;
    const getTheIndex = compose(clamp(0,len),findIndex(lte(y)));
    const yIndex = getTheIndex(arr);
    const draggerObj = this.getDraggerObj();
    const draggerIndex = draggerObj.index;
    const isNewIndex = yIndex !== draggerIndex;

    return {arr,yIndex,draggerIndex,draggerObj,isNewIndex};

  }

  static getDraggerObj(arr=this.barItemsSortArr){
    return compose(head, filter(propEq('isDragger', true)))(arr);
  }


  static getBarItemsYPositions(arr=this.barItemsSortArr){
    return pluck(['yCheck'], arr);
  }



  static getDataFromBoundingBox(el,n, list, draggerId){
    const box = el.getBoundingClientRect();
    let {height,y,top}=box;
    height = parseInt(height);
    const id = el.id;
    const midPt = height/2;
    const isDragger = el.id === draggerId;
    let num = n;
    let yPos = y!==undefined ? y : top;
    let hasChanged = false;
    let initialized = true;
    const sortObj = {
      height,yPos,id, midPt,isDragger,initialized
    }

    Object.defineProperties(sortObj,  {

      num: {
        get: ()=> n

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
      }
    });


    return sortObj;


  }

  static addGsapYPos(arr){
    // CREATE ARRAY OF HEIGHTS
    const heightsArr = pluck('height', arr);
    console.log('heights arr ',heightsArr);
    // CREATE CORRECT Y POSITION BY ADDING UP PREVIOUS HEIGHTS
    const getGsapYPos = (index)=>R.sum(R.take(index,heightsArr))

    // ADD THE CORRECT Y POS FOR GSAP AND CREATE THE MIDPOINTS FOR ARR CHECK
    const addGsapY = (obj)=>{
      obj.yGsap = getGsapYPos(obj.index);
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