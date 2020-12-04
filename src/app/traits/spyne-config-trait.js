import {SpyneTrait} from 'spyne';
import {LocalStorageTraits} from 'traits/local-storage-traits';
import {DynamicAppDataTraits} from 'traits/dynamic-app-data-traits';
import {compose,clone,path,either,not, allPass,isEmpty,isNil} from 'ramda';

export class SpyneConfigTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'config$';
    super(context, traitPrefix);

    this.baseConfig = SpyneConfigTrait.config$CreateBaseConfig();

  }

  static config$getConfigFromStorage(){
    const defaults = LocalStorageTraits.localStorage$GetStoreObj('defaults');
    const {config} = defaults;
    const isDefined = compose(not, either(isNil, isEmpty))


    const configuredProps = ['routes', 'header', 'footer'];

    const updateConfigIfPropExists = (str)=>{
      const prop = LocalStorageTraits.localStorage$GetStoreObj(str);
      console.log('prop is ',isDefined(prop),prop);
      if (isDefined(prop)===true){
        config.channels.ROUTE[str] = prop;
      }
    }

    configuredProps.forEach(updateConfigIfPropExists);


    console.log('config is ',{configuredProps, defaults})

   /* const routes = LocalStorageTraits.localStorage$GetStoreObj('routes');
    if (isDefined(routes)===true){
      config.channels.ROUTE.routes = routes;
     }
*/
   // DynamicAppDataTraits.dynAppData$GetRouteNameProps({Spyne:{config}}, true);

    return config;

  }


  static config$SetRouteToLocalStorage(){
    const routes = compose(clone, path(["window","Spyne","config","channels","ROUTE", 'routes']))(window);

    //console.log("ROUTE TO LOCAL STORAGE IS ",{routes})
    LocalStorageTraits.localStorage$SetStoreObjAndUpdate('routes', routes);

    DynamicAppDataTraits.dynAppData$GetRouteNameProps(window, true);

    //console.log("ON ROUTE CONFIG UPDATED --- ALSO UPDATE APP DATA JSON -- ",{routes})

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
    //console.log("VALUES OF ",baseConfig);


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
