import {SpyneTrait} from 'spyne';
import {
  compose,
  forEachObjIndexed,
  head,
  is,
  omit,
  path,
  prop,
  propEq,
  tap,
  toPairs,
  fromPairs,
    length,
    lte,
  values,
  keys, add, clone,
} from 'ramda';

export class DynamicAppTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dynApp$';
    super(context, traitPrefix);

  }



  static dynApp$SelectActiveSubNav(e){
    const {pathInnermost, routeData} = e.props();
    const val = routeData[pathInnermost];

    const camelToSnakeCase = (str)=>{
      const re = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
      return  str &&
          str.match(re)
              .map(x=>x.toLowerCase())
              .join('-')

    }


    const snakeProp = camelToSnakeCase(pathInnermost);

    const activeSel = `[data-${snakeProp}='${val}']`
    this.props.el$('nav > a').setActiveItem('selected', activeSel);

    console.log("SUBNAV PROPS ",{activeSel,snakeProp,pathInnermost,routeData,val})


  }


  static dynApp$CheckToAddSubnav(e){
    const {routeData, pathsChanged} = e.props();
    const {pageId} = routeData;
    const pageHasChanged = pathsChanged.indexOf('pageId')>=0;
    const subNavDataArr = [];



    const getSubNavRouteObj = ()=>{
      const {routes} = clone(window.Spyne.config.channels.ROUTE);
      const routeObj = compose(path(['routePath', pageId, 'routePath']))(routes);
      const routeName = prop('routeName', routeObj);
      const routeProps = omit(['routeName'], routeObj)
      return {routeName, routeProps}

    }
    let {routeName, routeProps} = getSubNavRouteObj();
    let addSubNav = compose(lte(2), length, keys)(routeProps);
    if (pageHasChanged === false || addSubNav === false){
      return {subNavDataArr, pageHasChanged};
    }


    const channel = "ROUTE";
    const mainKey = routeName;
    const eventPreventDefault="true";
    const forEachSubNavProp = (val, key)=>{
      const mainValue = key;
      const data = {channel, eventPreventDefault};
      data[mainKey]=mainValue;
      data['href'] = val === '^$' ? "/" : `/${mainValue}`;
      if (val === '^$'){
        data[`${mainKey}Value`]="";
      }
      data['text']=String(mainValue).toUpperCase();
      // data.mainKey = iter === 0 ? ""
      subNavDataArr.push(data);
    }

     forEachObjIndexed(forEachSubNavProp, routeProps);

    //console.log("NEW ROUTE OBJ ",{subNavDataArr,addSubNav,pageHasChanged, routeName, routeProps})

    return {subNavDataArr, pageHasChanged,pageId};
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
    return accum;



  }



}



