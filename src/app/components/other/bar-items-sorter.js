import {partialRight} from 'ramda';

export class BarItemsSorter{

  constructor(liItems, id) {
    this.listItems = liItems;
    this.draggerId = id;
    //console.log("SORTER ",this);
    this.sortArray = BarItemsSorter.createSorterObject(this.listItems);
  }


  static getDataFromBoundingBox(el,num, list, draggerId){
    const box = el.getBoundingClientRect();
    const {height,y,top}=box;
    const id = el.id;
    const midPt = height/2;
    const isDragger = el.id === draggerId;
    let yPos = y!==undefined ? y : top;
    let hasChanged = false;
    let initialized = true;

    const sortObj = {
      height,yPos,hasChanged,id,num, midPt,isDragger,initialized
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


  static createSorterObject(liItems, dId){
    const boxSorterFnCurried = partialRight(BarItemsSorter.getDataFromBoundingBox, [dId]);

      const arr = Array.from(liItems).map(boxSorterFnCurried);
      return arr;
  }

  static pullDataFromBoundingBox(){

  }

  static getItemsData(){

  }

  static updateItemsData(){

  }

}