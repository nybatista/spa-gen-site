import {SpyneTrait} from 'spyne';
import {whereEq, path, compose, pick, evolve, map, ifElse, nth, reverse, omit, keys, reduceRight, toPairs, equals, merge, is, prop,filter, head} from 'ramda';

export class AppDataGeneratorTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'appDataGen$';
    super(context, traitPrefix);

  }

  static appDataGen$GetMainPropVals(key, data){
    console.log("KEY AND DATA ", {key, data})




    const transformations = {



    }


    return {};

  }

  static appDataGen$CreateDataFromRoutes(configObj=window, dataSource){
    const routesJson = path(['Spyne', 'config', 'channels', 'ROUTE', 'routes'], configObj);
    const omitProps = omit(['routeName', '^$', '404']);
    const getRouteName = prop('routeName');
    const getRouteProps = compose(omitProps);


    const mainObj = {};

    const parseRouteConfig = (routeObj)=>{
      const {routePath} = routeObj;
      const routeName = getRouteName(routePath);
      const routeProps = getRouteProps(routePath);

      const generatePropObj = (pair)=>{
        const propObj = {
          [routeName]: pair[0]
        }

        const propsObj = AppDataGeneratorTraits.appDataGen$GetMainPropVals(pair[0], dataSource);



        if (is(Object, pair[1])){
          propObj['content'] = parseRouteConfig(pair[1]);
        }
         return propObj;
      }
      return compose(map(generatePropObj), toPairs)(routeProps);
    }



    mainObj['content'] = parseRouteConfig(routesJson);



     return mainObj;

  }



}