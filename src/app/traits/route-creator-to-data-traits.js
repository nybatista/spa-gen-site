import {SpyneTrait} from 'spyne';
import hljs from 'highlight.js/lib/core';
//import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';

import {compose, fromPairs,map, toPairs,merge,mergeLeft,mergeRight,mergeAll,
  mergeDeepRight,
    mergeDeepWith,
    mergeWithKey,
    mapObj,
    assocPath,
  tap,is,append,concat,prepend,assoc} from 'ramda';
import {LocalStorageTraits} from 'traits/local-storage-traits';

export class RouteCreatorToDataTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'routeCreatorToData$';
    super(context, traitPrefix);

  }




  static routeCreatorToData$GetDataElByType(barEl, type){
    /*
    *
    * TYPE: barInputVal, routeNameInputVal, listItemsData
    *
    * */
  }

  static routeCreatorToData$GetUlData(barId){
    //console.log("BAR VSID ",{barId}, document.querySelector(`[data-vsid='${barId}']`));
    const ul = RouteCreatorToDataTraits.routeCreatorToData$GetUl(barId);
    const ulData = compose(fromPairs,toPairs)(ul.dataset);
    const ulLiEls = RouteCreatorToDataTraits.routeCreatorToData$GetUlListItems(barId);
    const length = ulLiEls.length;

    return {ulData,length};

  }


  static routeCreatorToData$GetUl(vsid){
    const ulSel = `[data-vsid='${vsid}'] > ul.route-bar-items-list`;
    return document.querySelector(ulSel);
  }

  static routeCreatorToData$GetUlListItems(vsid){
    const ulLiSel = `[data-vsid='${vsid}'] > ul.route-bar-items-list  > li`;
    return Array.from(document.querySelectorAll(ulLiSel));
  }

  static routeCreatorToData$GetInputVal(listItemEl){
    const inputEl = listItemEl.querySelector('section.input-bar input');
    return inputEl.value === "" ? inputEl.placeholder : inputEl.value;
  }

  static routeCreatorToData$GetRouteName(vsid){
    const routeNamseSel = `[data-vsid='${vsid}'] > div.route-creator-route-name input`;
    const el = document.querySelector(routeNamseSel);
    return el.value!=="" ? el.value : el.placeholder;
  }

  static routeCreatorToData$GetData(ulSelector){

    const ul = document.querySelector(ulSelector);
    const ulData = compose(fromPairs,toPairs)(ul.dataset);
    const ulLiEls = ul.querySelectorAll(`${ulSelector} > li`);
    const length = ulLiEls.length;
    return {ulData,length};
  }

  static routeCreatorToData$DomToRouteJson(mainSel='route-creator-container'){
    let iter = 0;
    const addStringOrObjForEachListItem = (liEl)=>{
      console.log('add To Route ',{liEl})
      if (is(Array, liEl)){
        iter++;
        return liEl;
      }
      const inputVal = RouteCreatorToDataTraits.routeCreatorToData$GetInputVal(liEl);
      let arr = [inputVal, inputVal];
      const listItemsArr = RouteCreatorToDataTraits.routeCreatorToData$GetUlListItems(liEl.dataset.vsid);
      if (listItemsArr.length>=1){
        iter = 0;
        arr= [inputVal, createObjFromUl(liEl.dataset.vsid)];
      }
     // arr[1] = iter === 0 ? "^$" : arr[1];
      //console.log("STRING OR OBJ ",{iter,arr})

      iter++;


      return arr;
    }

    const mapAgain = (arr)=> {
      //console.log("ARR IS ", arr);
      const obj = {};
      obj[arr[0]]=arr[1];
      return obj;
    }


    const createObjFromUl = (vsid)=>{
      const listItemsArr = RouteCreatorToDataTraits.routeCreatorToData$GetUlListItems(vsid)
      const routeName = RouteCreatorToDataTraits.routeCreatorToData$GetRouteName(vsid);
      const routePath = compose(merge({routeName}),fromPairs, append(['404', '.+']),map(addStringOrObjForEachListItem))(listItemsArr);
      return {routePath};
    };

    const mainEl = document.getElementById(mainSel);
    let routes =  createObjFromUl(mainEl.dataset.vsid);
   // routes.routePath['404']='.*';
    console.log("ROUTES GEN ",{routes, mainEl})
    routes = assocPath(['routePath', 'home'], '^$', routes);
    return {routes};

  }



  static routeCreatorToData$GetDefaultRouteName(props=this.props){
    const {holderId} = props;
    const inputBarSel = `[data-vsid='${holderId}'] section.input-bar input`;
    const inputEl= document.querySelector(inputBarSel);
    const inputVal = inputEl.value !== "" ? inputEl.value : inputEl.placeholder;

    const snakeToCamel = (str) => str.replace(
        /([-_][a-z])/g,
        (group) => group.toUpperCase()
        .replace('-', '')
        .replace('_', '')
    );

    return `${snakeToCamel(inputVal)}Id`;

  }

  static routeCreatorToData$GetDefaultRouteJson(){
    const defaults =  LocalStorageTraits.localStorage$GetStoreObj('defaults');
    const {routes} = defaults;
    return {routes};
  }


  static routeCreatorToData$GenerateJSON(resetToDefault=false){

    const jsonFn = resetToDefault === true ? this.routeCreatorToData$GetDefaultRouteJson : this.routeCreatorToData$DomToRouteJson;

    const jsonObj = jsonFn();

    //console.log("THE JSON IS ",json);
    //hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('json', json);
    hljs.initHighlightingOnLoad();
    const codeEl = this.props.el$('code.json').el;
    codeEl.innerHTML = JSON.stringify(jsonObj, null, 4);
    hljs.highlightBlock(codeEl);

    const {routes} = jsonObj;
    console.log('routes and json obj ',{jsonObj});
    return routes;
  }


}
