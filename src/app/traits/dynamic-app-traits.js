import {SpyneTrait} from 'spyne';
import {
  compose,
  forEachObjIndexed,
  head,
  is,
  omit,
  path,
  prop,
  toPairs,
  fromPairs,
  values,
  keys, add, clone,
} from 'ramda';

export class DynamicAppTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dynApp$';
    super(context, traitPrefix);

  }



  static dynApp$GetCurrentRouteJson(){
    return compose(clone, path(['Spyne','config', 'channels', 'ROUTE', 'routes']))(window);

  }

  static dynApp$FormatRouteConfigForDom(route){
    //console.log("ROUTE DATA IS ",route);
    const {routePath} = route;
    const {routeName} = routePath;
    const channel = "ROUTE";
    const mainKey = routeName;
    const eventPreventDefault="true";

    const accum = [];
    let iter = 0;

    const getRouteName = (obj)=>{
      return path(['routePath', 'routeName'], obj);
    }

    const getFirstNavItem = (obj)=>{
      return compose(head, toPairs, omit(['routeName']), prop('routePath'))(obj);
    }

    const checkForSubSection = (data, val, mainKey)=>{

      const addSubNavKeyValue = (obj, key)=>obj[`${key}Value`]='';

      if (is(Object, val)===true){
        let subNavKey = getRouteName(val);
        let subNavObjArr = getFirstNavItem(val);
        data[subNavKey] = subNavObjArr[0];
        if (subNavObjArr[1]==='^$'){
          addSubNavKeyValue(data, subNavKey);
        }
      } else if (val==="^$"){
        addSubNavKeyValue(data, mainKey);
      }
      return data
    }


    const mapRouteProps = (val, key,n, i)=>{
      const mainValue = key;
      const data = checkForSubSection({channel, eventPreventDefault}, val, mainKey);
      data[mainKey]=mainValue;
      data['href'] = val === '^$' ? "/" : `/${mainValue}`;
      data['text']=String(mainValue).toUpperCase();
      // data.mainKey = iter === 0 ? ""
      accum.push(data);
      iter++;

    }




    let propObj = omit(['routeName'], routePath);

    forEachObjIndexed(mapRouteProps, propObj);

    console.log("DATA IS ",{accum, routeName, routePath})
    return accum;



  }



}



