import {SpyneTrait} from 'spyne';
import {LocalStorageTraits} from 'traits/local-storage-traits';
import {compose,clone,path} from 'ramda';

export class SpyneConfigTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'config$';
    super(context, traitPrefix);

    this.baseConfig = SpyneConfigTrait.config$CreateBaseConfig();

  }

  static config$getConfigFromStorage(){
    const defaults = LocalStorageTraits.localStorage$GetStoreObj('defaults');
    const routes = LocalStorageTraits.localStorage$GetStoreObj('routes');
    const {config} = defaults;
    if (routes!==undefined){

      console.log("CONFIG IS HERE ",{config})
      config.channels.ROUTE.routes = routes;
    }
    return config;

  }


  static config$SetRouteToLocalStorage(){
    const routes = compose(clone, path(["window","Spyne","config","channels","ROUTE", 'routes']))(window);
    LocalStorageTraits.localStorage$SetStoreObjAndUpdate('routes', routes);
    console.log("ON ROUTE CONFIG UPDATED ",{routes})

  }

  static config$GetDefaultRoute(){
    const routes = compose(clone, path(["window","Spyne","config","channels","ROUTE", 'routes']))(window);
   // LocalStorageTraits.localStorage$SetStoreObj('routes',routes);


  }


  static config$Add404(obj){
    obj['404'] = '.*';
    return obj;
  }

  static config$CreateRoutePath(arr, rName = 'page'){
    let routeName = rName;
    let routePath = {routeName};
    routePath = SpyneConfigTrait.config$Add404(routePath);
    return {routePath};
  }

  static config$MapArrValues(){

  }

  static config$CreateFile(valuesObj){





      let baseConfig = SpyneConfigTrait.config$CreateBaseConfig();
    console.log("VALUES OF ",baseConfig);


    return baseConfig;

  }

  static config$CreateBaseConfig(){
    let debug = true;
    let type = 'slash';
    let ROUTE = {type};
    let channels = {ROUTE};
    return {debug, channels};
  }



}