import {SpyneTrait} from 'spyne';
import {whereEq, path, compose, pick, find,propEq, flatten,isEmpty,invertObj, omit,map,all, defaultTo,uniq, nth, mapObjIndexed, forEachObjIndexed, reverse, reduceRight, toPairs, equals, merge, is, prop,filter, head} from 'ramda';
import {AppDataGeneratorTraits} from 'traits/app-data-generator-traits';
import {LocalStorageTraits} from 'traits/local-storage-traits';

export class DynamicAppDataTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dynAppData$';
    super(context, traitPrefix);

  }

  static dynAppData$Validate(appData, configObj=window){

    const routesJson = DynamicAppDataTraits.dynAppData$GetRoutesJson(configObj);


    const valIsObj =  compose(is(Object), nth(1))
    const getProps = compose(toPairs, omit(['^$', '404', 'routeName']))

    const boolAcc = []

    const defaultContentObj = defaultTo({});
    const compareRouteNameAndContent = (routesObj, contentObj)=> {

    const {routePath} = routesObj;

    console.log("ROUTE CHECK ",{routesObj, contentObj, routePath})
    const content = compose(defaultContentObj, prop('content'))(contentObj);

    // MAP EACH ROUTEPATH OBJ
    const onMapObj = (rObj, cObj) => {
      const {routeName} = rObj;
      const props = getProps(rObj);

      const mapThroughProps = (arrPair)=>{
        const prop = arrPair[0];
        const propVal = arrPair[1];
        const whereEqFn = compose(head, filter(whereEq({[routeName]:prop})))
        const sectionContent = whereEqFn(content);
        const propExists = sectionContent!==undefined;
        boolAcc.push(propExists);
        if (valIsObj(arrPair)){
          return compareRouteNameAndContent(propVal, sectionContent);
        }

        return propExists;
      }
      return props.map(mapThroughProps);
    }
    return onMapObj(routePath, content);
  }


   compareRouteNameAndContent(routesJson, appData);

    const appDataIsValid = all(equals(true), boolAcc);

    console.log('validate app data ',{routesJson, appData, appDataIsValid, boolAcc})

    return appDataIsValid;
  }

  static dynAppData$GetRoutesJson(configObj){
    return path(['Spyne', 'config', 'channels', 'ROUTE', 'routes'], configObj);
  }

  static dynAppData$ConformAppData(d, configObj=window, generatedBool=false){

    const defaultIsValid = DynamicAppDataTraits.dynAppData$Validate(d, configObj);
    const defaultData = DynamicAppDataTraits.dynAppData$CacheData(d);;



    let localStorageDynamicData = LocalStorageTraits.localStorage$GetStoreObj('dynamicData');
    const localStorageDataIsValid =  DynamicAppDataTraits.dynAppData$Validate(localStorageDynamicData, configObj);


    let generatedAppData = AppDataGeneratorTraits.appDataGen$CreateDataFromRoutes(configObj);
    const generatedAppDataIsValid =DynamicAppDataTraits.dynAppData$Validate(generatedAppData, configObj);


    const findFirstValidArr = generatedBool ? {generatedAppDataIsValid, localStorageDataIsValid, defaultIsValid} : {localStorageDataIsValid, defaultIsValid};

    const isTrue = a => a[1] === true;
    const validDataType = compose( nth(0), defaultTo([]), find(isTrue), toPairs)(findFirstValidArr);

    console.log('validated data ',{validDataType, findFirstValidArr, generatedBool,generatedAppDataIsValid, localStorageDataIsValid, defaultIsValid, generatedAppData, localStorageDynamicData, defaultData })


    //console.log("LODAL STORAGE ", {localStorageDynamicData, localStorageDataIsValid});
    if (validDataType === "generatedAppDataIsValid"){
      return DynamicAppDataTraits.dynAppData$CacheData(localStorageDynamicData);
    } else if(validDataType === "localStorageDataIsValid"){
      LocalStorageTraits.localStorage$SetStoreObj('dynamicData', generatedAppData)
      return DynamicAppDataTraits.dynAppData$CacheData(generatedAppData);
    } else {
      return defaultData;
    }


/*
    console.log('generate app data ', {generateAppData, d});

    if (appDataIsValid){

    }

    return d;
*/



  }


  static dynAppData$CacheData(d){

    if (window!==undefined && path(['Spyne','config'], window) !== undefined) {
      window.Spyne.config['dynamicData'] = d;
    }


    return d;
  }


  static dynAppData$GetRouteNameProps(configObj = window, forceReset=false){

    const setRouteNamesArr = ()=> {

      const routesJson = DynamicAppDataTraits.dynAppData$GetRoutesJson(configObj);

      // console.log('config obj for routes ',{configObj, routesJson})
      const valIsObj =  compose(is(Object), nth(1))
      const keyIsRouteName = compose(equals('routeName'), nth(0))

      const routeNamesReducer = (arrPair, acc)=>{
        if (valIsObj(arrPair)){
          reduceRouteNamesFn(arrPair[1]);
        }
        if (keyIsRouteName(arrPair)){
          acc.push(arrPair[1])
        }
        return acc;
      }

      const reduceRouteNamesFn = compose(reverse, reduceRight( routeNamesReducer, []), toPairs);
      const routeNamesReducedArr = reduceRouteNamesFn(routesJson);

      if (window!==undefined && window.Spyne.config!==undefined){
        window.Spyne.config.channels.ROUTE.routeNamesArr = routeNamesReducedArr;
      }

      //console.log("ROUTES JSON ",{routeNamesReducedArr, routesJson})

      return uniq(routeNamesReducedArr);
/*
      console.log("TEST TRANSUCE ",{routeNamesReducedArr})

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

      return acc;*/

    }

    const getRouteNamesArr = ()=>{
      const routeNamesArr = path(['Spyne', 'config', 'channels', 'ROUTE', 'routeNamesArr'], configObj);
      if (routeNamesArr === undefined || forceReset === true){
        return setRouteNamesArr();
      }

      return uniq(routeNamesArr);
    }


    return getRouteNamesArr();

  }



  static dynAppData$GetData(dataProps={}){

    const routeNameArr = DynamicAppDataTraits.dynAppData$GetRouteNameProps();
    const mainData = path(['Spyne', 'config', 'dynamicData'], window);

    const routesReducer = (acc, str)=>{
      //console.log("ROUTES REDUCE DER ",{str, acc})
      if (dataProps.hasOwnProperty(str)){
        acc.push(pick([str], dataProps))
      }
      return acc;
    }


    const dataGetterFn = (obj)=>compose(head,filter(whereEq(obj)),prop('content'));

    const dataReducer = (data, obj)=>{
      const fn = dataGetterFn(obj);
      return fn(data);
    }

    const contentData = routeNameArr
    .reduce(routesReducer, [])
    .reduce(dataReducer, mainData);

    //console.log("ROUTES REDUCE ",{contentData,routeNameArr,mainData})

    return merge(dataProps, contentData);

  }

}
