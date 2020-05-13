import {SpyneTrait} from 'spyne';
import {LocalStorageTraits} from 'traits/local-storage-traits';

export class SpyneConfigTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'config$';
    super(context, traitPrefix);

    this.baseConfig = SpyneConfigTrait.config$CreateBaseConfig();

  }

  static config$getConfigFromStorage(){









  }




  static config$GetDefaultRoute(){

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