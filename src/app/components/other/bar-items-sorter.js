import {partialRight, pick,pluck, compose,head,filter,propEq} from 'ramda';

export class BarItemsSorter{

  constructor(liItems, id) {
    this.listItems = liItems;
    this.draggerId = id;
    //console.log("SORTER ",this);
    this.barItemsSortArr = BarItemsSorter.createSorterObject(this.listItems);
  }

  static updateBarItemsSorter(currentYPos, barItemsArr=this.barItemsSortArr){

  }

  static getDraggerObj(arr=this.barItemsSortArr){
    return compose(head, filter(propEq('isDragger', true)))(arr);
  }


  static getBarItemsYPositions(arr=this.barItemsSortArr){
    return pluck(['yPos'], arr);
  }

  static getBarItemsYCheckPositions(){

  }



  static getDataFromBoundingBox(el,num, list, draggerId){
    const box = el.getBoundingClientRect();
    let {height,y,top}=box;
    height = parseInt(height);
    const id = el.id;
    const midPt = height/2;
    const isDragger = el.id === draggerId;
    let yPos = y!==undefined ? y : top;
    let hasChanged = false;
    let initialized = true;
    const sortObj = {
      height,yPos,hasChanged,id,num,el, midPt,isDragger,initialized
    }

    Object.defineProperty(sortObj, 'index', {
      set: (n)=>{
        this.num=n
        this.hasChanged = true
      },
      get: ()=>num
    });


    return sortObj;


  }

  static addGsapYPos(arr){
    const heightsArr = pluck('height', arr);
    const getGsapYPos = (index)=>R.sum(R.take(index,heightsArr))

    const addGsapY = (obj)=>{
      obj.yGsap = getGsapYPos(obj.index);
      obj.yCheck = obj.yGsap + obj.midPt;
      return obj;
    }

    return arr.map(addGsapY);

  }


  static createSorterObject(liItems, dId){
    const boxSorterFnCurried = partialRight(BarItemsSorter.getDataFromBoundingBox, [dId]);

      let arr = Array.from(liItems).map(boxSorterFnCurried);
      arr = BarItemsSorter.addGsapYPos(arr);
      return arr;
  }

  static pullDataFromBoundingBox(){

  }

  get sortArr(){
      return this.barItemsSortArr;
  }

  set sortArr(obj){
    this.barItemsSortArr = obj;
  }

  static updateItemsData(){

  }

}