import {SpyneTrait} from 'spyne';
import {whereEq, path, compose, pick, flatten, omit,map, defaultTo, nth, mapObjIndexed, forEachObjIndexed, reverse, reduceRight, toPairs, equals, merge, is, prop,filter, head} from 'ramda';

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
    const content = compose(defaultContentObj, prop('content'))(contentObj);
    console.log("CONTENT IS ",{content})
    const onMapObj = (rObj, cObj) => {
      //console.log("OBJ IS ", {k})

      const {routeName} = rObj;
      const containsRouteName = routeName!==undefined;
      const props = getProps(rObj);

      const mapThroughProps = (arrPair)=>{
        const prop = arrPair[0];
        const propVal = arrPair[1];
        const whereEqFn = compose(head, filter(whereEq({[routeName]:prop})))
        const sectionContent = whereEqFn(content);
        const propExists = sectionContent!==undefined;
        boolAcc.push(propExists);
        //console.log("PROP IS ", {prop, propExists});

        if (valIsObj(arrPair)){
          //console.log("GOING THROUGH DATA ",{routeName, containsRouteName, propExists}, JSON.stringify(sectionContent))
          return compareRouteNameAndContent(propVal, sectionContent);
        }


        return propExists;

      }
      return props.map(mapThroughProps);
    }


    const propsBool= onMapObj(routePath, content);

   // console.log("props bool ",{propsBool});
    return propsBool;
  }


   const validateAppData = flatten(compareRouteNameAndContent(routesJson, appData));

    console.log('validate app data ',{validateAppData,boolAcc})
  }

  static dynAppData$GetRoutesJson(configObj){
    return path(['Spyne', 'config', 'channels', 'ROUTE', 'routes'], configObj);
  }

  static dynAppData$ConformAppData(d, configObj=window){
    let defaultDynamicData = d;

    const routesJson = DynamicAppDataTraits.dynAppData$GetRoutesJson(configObj);





    const validateBool = DynamicAppDataTraits.dynAppData$Validate(d, configObj);

    let dynamicAppData = d;


    return DynamicAppDataTraits.dynAppData$CacheData(dynamicAppData);

  }


  static dynAppData$CacheData(d){

    if (window!==undefined && path(['Spyne','config'], window) !== undefined) {
      window.Spyne.config['dynamicData'] = d;
    }


    return d;
  }


  static dynAppData$GetRouteNameProps(configObj = window){

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

      return routeNamesReducedArr;
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
      if (routeNamesArr === undefined){
        return setRouteNamesArr();
      }

      return routeNamesArr;
    }


    return getRouteNamesArr();

  }



  static dynAppData$GetData(dataProps={}){

    const routeNameArr = DynamicAppDataTraits.dynAppData$GetRouteNameProps();
    const mainData = path(['Spyne', 'config', 'dynamicData'], window);

    const routesReducer = (acc, str)=>{
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



    return merge(dataProps, contentData);

  }

}