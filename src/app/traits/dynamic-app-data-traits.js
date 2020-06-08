import {SpyneTrait} from 'spyne';
import {whereEq, path, compose, pick, nth, reverse, reduceRight, toPairs, equals, merge, is, prop,filter, head} from 'ramda';

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