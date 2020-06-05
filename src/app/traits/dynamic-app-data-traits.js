import {SpyneTrait} from 'spyne';
import {whereEq, path, compose, pick, prop,filter, head, pathEq, propEq} from 'ramda';

export class DynamicAppDataTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dynAppData$';
    super(context, traitPrefix);



  }

  static dynAppData$CacheData(d){
    window.Spyne.config['dynamicData'] = d;
    return d;
  }



  static dynAppData$GetData(dataProps={}){

    const mainObj = pick(['pageId'], dataProps);

    const subObj = {
      workId: "acme"
    }

      const mainData = path(['Spyne', 'config', 'dynamicData'], window);
      //console.log("MAIN DATA ",mainData);
      const dataGetterFn = (obj)=>compose(head,filter(whereEq(obj)),prop('content'));
      const dataGetter = dataGetterFn(mainObj);
     // const subDataGetter = dataGetterFn(subObj);
      const d =  dataGetter(mainData);
      //const subData = subDataGetter(d);
    console.log("DATA ",{d, dataProps, mainObj, mainData})

      d['pageId'] = prop('pageId', dataProps);

      return d;

  }

}