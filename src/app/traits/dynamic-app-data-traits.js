import {SpyneTrait} from 'spyne';
import {whereEq, path, compose, assocPath, pick, merge, is, clone, mapObjIndexed, prop,filter, head, pathEq, propEq} from 'ramda';

export class DynamicAppDataTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dynAppData$';
    super(context, traitPrefix);



  }

  static dynAppData$CacheData(d){
    window.Spyne.config['dynamicData'] = d;
    return d;
  }


  static dynAppData$GetRouteNameProps(configObj = window){

    const setRouteNamesArr = ()=> {

      const routesJson = path(['Spyne', 'config', 'channels', 'ROUTE', 'routes'], configObj);
      const acc = [];

      const mapper = (v, k, obj) => {
        const checkForRouteName = (obj) => {
          if (k === 'routeName') {
            acc.push(v);
          }
        }
        checkForRouteName(v);
        if (is(Object, v) === true) {
          mapObjIndexed(mapper, v);
        }

        return v;
      }

      mapObjIndexed(mapper, routesJson);

        assocPath(['Spyne', 'config', 'channels', 'ROUTE', 'routeNamesArr'], acc, configObj);
        if (window!==undefined){
          window.Spyne.config.channels.ROUTE.routeNamesArr = acc;
        }

      return acc;

    }

    const getRouteNamesArr = ()=>{
      const routeNamesArr = path(['Spyne', 'config', 'channels', 'ROUTE', 'routeNamesArr'], configObj);
      if (routeNamesArr === undefined){
        console.log("ROUTE NAMES NO EXIST ");
        return setRouteNamesArr();
      }

      return routeNamesArr;
    }


    return getRouteNamesArr();

  }



  static dynAppData$GetData(dataProps={}){

    const mainObj = pick(['pageId'], dataProps);

    const routeNameArr = DynamicAppDataTraits.dynAppData$GetRouteNameProps();

    const transduceArr = [];
    const mapForTransduce = (str)=>{
      if (dataProps.hasOwnProperty(str)){
        transduceArr.push(pick([str], dataProps))
      }
    }

    routeNameArr.forEach(mapForTransduce);



      const mainData = path(['Spyne', 'config', 'dynamicData'], window);
      //console.log("MAIN DATA ",mainData);
      const dataGetterFn = (obj)=>compose(head,filter(whereEq(obj)),prop('content'));
      const dataGetter = dataGetterFn(mainObj);
      const d =  dataGetter(mainData);


    const reducer = (data, obj, i, arr)=>{
      const fn = dataGetterFn(obj);
      return fn(data);
    }

    const newObj = transduceArr.reduce(reducer, mainData);

    console.log("DATA ",{d,newObj, dataProps, mainObj, mainData})

     // d['pageId'] = prop('pageId', dataProps);

      return merge(dataProps, newObj);

  }

}