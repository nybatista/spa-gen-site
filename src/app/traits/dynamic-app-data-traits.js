import {SpyneTrait} from 'spyne';
const fdEqual = require('fast-deep-equal');
import {whereEq, path, compose, pick,  has, find,propEq,includes, zip, flatten,isEmpty,invertObj, omit,map,all, defaultTo,uniq, nth, mapObjIndexed, forEachObjIndexed, reverse, reduceRight, toPairs, equals, merge, is, prop,filter, head} from 'ramda';
import {AppDataGeneratorTraits} from 'traits/app-data-generator-traits';
import {LocalStorageTraits} from 'traits/local-storage-traits';

export class DynamicAppDataTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dynAppData$';
    super(context, traitPrefix);

  }


  static dynAppData$ValidateByDatasets(data, configObj=window){
    const {routeNamesArr, routeDatasetsArr} = path(['Spyne', 'config', 'channels', 'ROUTE'], configObj);
    //const obj = path(['channels', 'ROUTE'], configObj);
    const {content} = data;

    //console.log('data validate route is ',{content, routeNamesArr, routeDatasetsArr, configObj})



    //const pred = compose(whereEq(o), prop('linkDataset'));
    const reduceDatasets = (acc, o)=>{
      ///console.log('o dataset ',{acc,o,routePropsObj})
      const content = prop('content', o);


      const obj = compose(pick(routeNamesArr),  prop('linkDataset'))(o);
      //console.log('validate obj and arr', {o, obj} )
      acc.push(obj);
      if (content){
        return content.reduce(reduceDatasets, acc)
      }
      return acc;

    }

    const mainDatasetsArr = compose(map(pick(routeNamesArr)))(routeDatasetsArr);


    const compareRouteDatasetsArr = content === undefined ? [false] : content.reduce(reduceDatasets, [])

    const compareObjs = arr => whereEq(arr[0], arr[1]);
    const isTrue = R.equals(true);

    const allEq = compose(all(equals(true)), map(compareObjs),zip)(mainDatasetsArr, compareRouteDatasetsArr);
    const arrLengthsMatch = mainDatasetsArr.length === compareRouteDatasetsArr.length;

    console.log('VALIDATE FROM ROUTE data is ',{allEq,arrLengthsMatch, routeDatasetsArr, mainDatasetsArr, compareRouteDatasetsArr});
    return allEq && arrLengthsMatch;

    // return content.reduce(filterByReduceContent, {});

    // return {};
  }


  static dynAppData$Validate(appData, configObj=window){

    const newValidatation = DynamicAppDataTraits.dynAppData$ValidateByDatasets(appData, configObj);

    const routesJson = DynamicAppDataTraits.dynAppData$GetRoutesJson(configObj);


    const valIsObj =  compose(is(Object), nth(1))
    const getProps = compose(toPairs, omit(['^$', '404', 'routeName']))

    const boolAcc = []

    const defaultContentObj = defaultTo({});
    const compareRouteNameAndContent = (routesObj, contentObj)=> {

      const {routePath} = routesObj;

      //console.log("ROUTE CHECK ",{routesObj, contentObj, routePath})
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

    //console.log('validate app data ',{routesJson, appData,newValidatation, appDataIsValid, boolAcc}, window.Spyne.config.channels)

    return newValidatation;
    // return appDataIsValid;
  }

  static dynAppData$GetRoutesJson(configObj){
    return path(['Spyne', 'config', 'channels', 'ROUTE', 'routes'], configObj);
  }

  static dynAppData$ConformAppData1(d, configObj=window){

    const defaultIsValid = DynamicAppDataTraits.dynAppData$Validate(d, configObj);

    if (defaultIsValid === true){
      return DynamicAppDataTraits.dynAppData$CacheData(d);

    }


    let localStorageDynamicData = LocalStorageTraits.localStorage$GetStoreObj('dynamicData');
    const localStorageDataIsValid =  DynamicAppDataTraits.dynAppData$Validate(localStorageDynamicData, configObj);

    //console.log("LODAL STORAGE ", {localStorageDynamicData, localStorageDataIsValid});
    if (localStorageDataIsValid === true){
      return DynamicAppDataTraits.dynAppData$CacheData(localStorageDynamicData);
    } else {
      let generatedAppData = AppDataGeneratorTraits.appDataGen$CreateDataFromRoutes(configObj);
      // const generatedAppDataIsValid =DynamicAppDataTraits.dynAppData$Validate(generateAppData, configObj);
      LocalStorageTraits.localStorage$SetStoreObj('dynamicData', generatedAppData)
      return DynamicAppDataTraits.dynAppData$CacheData(generatedAppData);

    }


    /*
        console.log('generate app data ', {generateAppData, d});

        if (appDataIsValid){

        }

        return d;
    */



  }




  static dynAppData$ConformAppData(d, configObj=window, generatedBool=false){

       const checkIfRouteIsDefault = ()=>{
          const configRoute = path(['Spyne', 'config', 'channels', 'ROUTE', 'routes'], configObj);
          const defaultRoute = LocalStorageTraits.localStorage$GetDefaultProp('routes');
          defaultRoute['routePath']['404'] = ".+";
          //console.log('ROUTES ',{configRoute, defaultRoute})
          return fdEqual(configRoute, defaultRoute);

        }



    const defaultIsValid = DynamicAppDataTraits.dynAppData$Validate(d, configObj);
    const defaultData = DynamicAppDataTraits.dynAppData$CacheData(d);;
    const isDefaultRoute = checkIfRouteIsDefault();
    console.log("DEFAULT DATA ",{defaultIsValid, isDefaultRoute,defaultData})
    if (isDefaultRoute){

      return defaultData;
    }


    let localStorageDynamicData = LocalStorageTraits.localStorage$GetStoreObj('dynamicData');
    const localStorageDataIsValid =  DynamicAppDataTraits.dynAppData$Validate(localStorageDynamicData, configObj);


    let generatedAppData = AppDataGeneratorTraits.appDataGen$CreateDataFromRoutes(configObj);
    const generatedAppDataIsValid =DynamicAppDataTraits.dynAppData$Validate(generatedAppData, configObj);


    const findFirstValidArr = generatedBool ? {generatedAppDataIsValid, localStorageDataIsValid, defaultIsValid} : {localStorageDataIsValid, defaultIsValid};

    const isTrue = a => a[1] === true;
    const validDataType = compose( nth(0), defaultTo([]), find(isTrue), toPairs)(findFirstValidArr);

    console.log('dynAppData$ConformAppData validated data ',{isDefaultRoute,validDataType, findFirstValidArr, generatedBool,generatedAppDataIsValid, localStorageDataIsValid, defaultIsValid, generatedAppData, localStorageDynamicData, defaultData })


    //console.log("LODAL STORAGE ", {localStorageDynamicData, localStorageDataIsValid});
    if (validDataType === "generatedAppDataIsValid"){
      // const generatedAppDataIsValid =DynamicAppDataTraits.dynAppData$Validate(generateAppData, configObj);
      LocalStorageTraits.localStorage$SetStoreObj('dynamicData', generatedAppData)
      return DynamicAppDataTraits.dynAppData$CacheData(generatedAppData);
    } else if(validDataType === "localStorageDataIsValid"){
      return DynamicAppDataTraits.dynAppData$CacheData(localStorageDynamicData);
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
        //window.Spyne.config.channels.ROUTE.routeNamesArr = routeNamesReducedArr;
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
