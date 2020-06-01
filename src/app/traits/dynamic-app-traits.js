import {SpyneTrait} from 'spyne';
import {
  compose,
  forEachObjIndexed,
  head,
  is,
  omit,
  path,
    concat,
  prop,
  propEq,
    map,
    chain,
    assoc,
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

    //console.log("SUBNAV PROPS ",{activeSel,snakeProp,pathInnermost,routeData,val})


  }


  static dynApp$CheckToAddSubnav(routeData, pageHasChanged=true){
    const {pageId} = routeData;
    //const pageHasChanged = pathsChanged.indexOf('pageId')>=0;
    const subNavDataArr = [];



    const getSubNavRouteObj = ()=>{
      const {routes} = clone(window.Spyne.config.channels.ROUTE);
      const routeObj = compose(path(['routePath', pageId, 'routePath']))(routes);
      const routeName = prop('routeName', routeObj);
      const routeProps = omit(['routeName','404'], routeObj)
      return {routeName, routeProps}

    }
    let {routeName, routeProps} = getSubNavRouteObj();
    let addSubNav = compose(lte(2), length, keys)(routeProps);
   //if (pageHasChanged === false || addSubNav === false){
    if (pageHasChanged === false){
      return {subNavDataArr, pageHasChanged};
    }


    const channel = "ROUTE";
    const mainKey = routeName;
    const eventPreventDefault="true";
    const forEachSubNavProp = (val, key)=>{
      const mainValue = key;
      const data = {channel, eventPreventDefault};
      data['pageId']=pageId;
      data[mainKey]=mainValue;
      data['href'] = val === '^$' ? `/${pageId}` : `/${pageId}/${mainValue}`;
      if (val === '^$'){
        data[`${mainKey}Value`]="";
      }
      data['text']=String(mainValue).toUpperCase();
      // data.mainKey = iter === 0 ? ""
      subNavDataArr.push(data);
    }

     forEachObjIndexed(forEachSubNavProp, routeProps);

    //console.log("NEW ROUTE OBJ ",{subNavDataArr,addSubNav, routeName, routeProps})

    return {subNavDataArr,routeName, pageHasChanged,pageId};
  }



  static dynApp$GetCurrentRouteJson(){
    return compose(clone, path(['Spyne','config', 'channels', 'ROUTE', 'routes']))(window);

  }

  static dynApp$FormatRouteConfigForMenuDrawer(){
   const addMainNavClass = compose(assoc('class', 'nav'), omit(['subNavDataArr']));
   const addSubNavClass = compose(map(assoc('class', 'sub-nav')),prop('subNavDataArr'))
   const flattenArr  = item => concat([addMainNavClass(item)], addSubNavClass(item));
   return  chain(flattenArr, DynamicAppTraits.dynApp$FormatRouteConfigForDom());

  }

  static dynApp$FormatRouteConfigForDom(routeData){
    const route = routeData !== undefined ? routeData : DynamicAppTraits.dynApp$GetCurrentRouteJson();
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
      return compose(head, toPairs, omit(['routeName', '404']), prop('routePath'))(obj);
    }

    const checkForSubSection = (data, val, mainKey)=>{

      const addSubNavKeyValue = (obj, key)=>obj[`${key}Value`]='';

      if (is(Object, val)===true){
        let subNavKey = getRouteName(val);
        let subNavObjArr = getFirstNavItem(val);

        // ******* ADDING BACK THIS VALUE WILL MAKE THE DEFAULT PAGE THE FIRST SUBPAGE ***** //
        //data[subNavKey] = subNavObjArr[0];
        // ========================================================================== //


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
      const {routeName, subNavDataArr} =  this.dynApp$CheckToAddSubnav(data);
      if (routeName!==undefined){
        data[`${routeName}Value`] = "";
      }
      data.subNavDataArr = subNavDataArr;
      //console.log("MAP DATA ",{routeName,data});
      accum.push(data);
      iter++;

    }

    let propObj = omit(['routeName', '404'], routePath);

    forEachObjIndexed(mapRouteProps, propObj);
    //console.log("RETUJRNED ROUTE DATA ",{accum})

    return accum;



  }



}



