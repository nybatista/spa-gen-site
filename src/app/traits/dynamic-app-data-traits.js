import {SpyneTrait} from 'spyne';
import {whereEq, path, compose, pick, omit,map, nth, mapObjIndexed, forEachObjIndexed, reverse, reduceRight, toPairs, equals, merge, is, prop,filter, head} from 'ramda';

export class DynamicAppDataTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dynAppData$';
    super(context, traitPrefix);

  }

  static dynAppData$Validate(appData, configObj=window){

    const routesJson = DynamicAppDataTraits.dynAppData$GetRoutesJson(configObj);


    /*
        const configForRoutes = {
          Spyne: {config}
        }
        const  routeNamesArr = DynamicAppDataTraits.dynAppData$GetRouteNameProps(configForRoutes);
    */

    const valIsObj =  compose(is(Object), nth(1))
    const keyIsRouteName = compose(equals('routeName'), nth(0))
    const objIsRoutePath = compose(equals('routePath'), nth(0))
    const getProps = compose(toPairs, omit(['^$', '404', 'routeName']))

    const validateAllProps = (obj)=>{

      const appDataContent = appData.content;

      const {routeName} = obj;
      const containsRouteName = routeName!==undefined;
      const props = getProps(obj);

      const checkPropsForContent = (propsPair)=>{
        const val = propsPair[0];
        const whereEqFn = compose(head, filter(whereEq({[routeName]:val})))
        const propExists = whereEqFn!==undefined;

       // console.log('obj pair is ',routeName, val, whereEqFn(appDataContent));
          return propsPair;
      }

      const propsPair = compose(map(checkPropsForContent))(props);


      //console.log('validating props ',{routeName,propsPair}, JSON.stringify(props));


      return true;
    }

    let contentInc = 0;

    const routeNamesReducer = (arrPair, acc)=>{

      if (valIsObj(arrPair)){
         const isRoutePath = objIsRoutePath(arrPair);
        if (isRoutePath){
          console.log("ARR PAIR IS ",{arrPair, contentInc, isRoutePath});

          acc.push(validateAllProps(arrPair[1]));
        }
        reduceRouteNamesFn(arrPair[1]);
      }
      if (keyIsRouteName(arrPair)){
       // acc.push(arrPair[1])
      }
      return acc;
    }

    const reduceRouteNamesFn = ()=>{};//compose(reverse, reduceRight( routeNamesReducer, []), toPairs);
    const routeNamesReducedArr = 3;//reduceRouteNamesFn(routesJson);


  const compareRouteNameAndContent = (routesObj, contentObj)=> {

    const {routePath} = routesObj;
    const {content} = contentObj;

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

        console.log("PROP IS ", {prop, propExists}, sectionContent);

        if (valIsObj(arrPair)){
          console.log("GOING THROUGH DATA ",{routeName, containsRouteName, propExists}, JSON.stringify(sectionContent))
          compareRouteNameAndContent(propVal, sectionContent);
        }

        return arrPair;

      }

      props.map(mapThroughProps);

      return rObj;
    }



    onMapObj(routePath, content);
  }


    compareRouteNameAndContent(routesJson, appData);

    console.log('validate againast config ',);

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