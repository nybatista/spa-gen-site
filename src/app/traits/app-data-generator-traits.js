import {SpyneTrait} from 'spyne';
import {whereEq, path, compose, pick, map, ifElse, nth, reverse, omit, keys, reduceRight, toPairs, equals, merge, is, prop,filter, head} from 'ramda';

export class AppDataGeneratorTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'appDataGen$';
    super(context, traitPrefix);

  }

  static appDataGen$CreateDataFromRoutes(configObj=window){
    const routesJson = path(['Spyne', 'config', 'channels', 'ROUTE', 'routes'], configObj);
    const valIsObj =  compose(is(Object), nth(1))
    const keyIsRoutePath = compose(equals('routePath'), nth(0))
    const omitProps = omit(['routeName', '^$', '404']);


    const getRouteName = prop('routeName');
    const getRouteProps = compose(omitProps);
    const isObject = compose(is(Object), nth(1), toPairs);


    const mainObj = {};


    const parseRouteConfig = (routeObj)=>{
      const {routePath} = routeObj;
      const routeName = getRouteName(routePath);
      const routeProps = getRouteProps(routePath);

      const generatePropObj = (pair)=>{

        const propObj = {
          [routeName]: pair[0]
        }
        if (is(Object, pair[1])){
          propObj['content'] = parseRouteConfig(pair[1]);
        }


         return propObj;

      }


      return compose(map(generatePropObj), toPairs)(routeProps);

    }

    mainObj['content'] = parseRouteConfig(routesJson);


    console.log(JSON.stringify(mainObj));
    const routeNamesReducer = (arrPair, acc)=>{
      if (valIsObj(arrPair)){
        //reduceRouteNamesFn(arrPair[1]);
      }
      if (keyIsRoutePath(arrPair)){
        const propKey = prop('routeName', arrPair[1])
        const propKeysPairs = compose(toPairs,omitProps)(arrPair[1]);

        const propKeys = map(isObjOrStr, propKeysPairs);
        //console.log("PROP KEYS ",[propKey, propKeys]);
        acc.push([propKey, propKeys])

        console.log("ACCUMULATOR ",acc);
      }
      return acc;
    }


    const reduceRouteNamesFn = compose(reverse, reduceRight( routeNamesReducer, []), toPairs);
    const isObjOrStr = (arrPair) => {
      const isObject = valIsObj(arrPair)
      let returnVal = [arrPair[0]];
      if (isObject === true){
        returnVal =  [arrPair[0], reduceRouteNamesFn(arrPair[1])];
      }

      //console.log('is obj or str ', isObject,returnVal)

      return returnVal;
    }

    const routeNamesReducedArr = reduceRouteNamesFn(routesJson);

    return routeNamesReducedArr;
  }



}