import {SpyneTrait} from 'spyne';
import {compose, fromPairs,map, toPairs,merge,mergeAll} from 'ramda';
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
    const ulLiEls = RouteCreatorToDataTraits.routeCreatorToData$GetUlListItems();
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
    /*
    * TODO: CREATE MICRO TASKS AND HAVE SPECIFIC METHODS THAT CONSOLIDATES
    *  JUST THE RIGHT AMOUNT OF THOSE MICRO TASKS
    *  1. GET section.input-bar input placeholder/value
    *  2. div.route-creator-route-name input placeholder/value
    *  3. list items length --- IS OBJECT OR STRING based on sub ul li length
    *  4. list item string or other routePath data object
    *
    *
    *
    *
    * */

    const ul = document.querySelector(ulSelector);
    const ulData = compose(fromPairs,toPairs)(ul.dataset);
    const ulLiEls = ul.querySelectorAll(`${ulSelector} > li`);
    const length = ulLiEls.length;
    return {ulData,length};
  }

  static routeCreatorToData$DomToRouteJson(mainSel='route-creator-container'){


    const generateRoutePathObj = ()=>{
      const routeName = "";
      const routePath = {routeName};
      const routes = {routePath};
      return routes;
    }

    const addStringOrObjForEachListItem = (liEl)=>{

      const inputVal = RouteCreatorToDataTraits.routeCreatorToData$GetInputVal(liEl);

      let arr = [inputVal, inputVal];
      const listItemsArr = RouteCreatorToDataTraits.routeCreatorToData$GetUlListItems(liEl.dataset.vsid);
      if (listItemsArr.length>=1){
        //obj[inputVal] = createObjFromUl(liEl.dataset.vsid);
        arr= [inputVal, createObjFromUl(liEl.dataset.vsid)];
      }

      //console.log("ARR IS ",arr);
     // console.log("LIST ITEM EL ",liEl.id,inputVal,listItemsArr.length, obj)
      return arr;
     // return [inputVal,inputVal];
    }



    const createObjFromUl = (vsid)=>{
      console.log("VSID ",vsid);
      const listItemsArr = RouteCreatorToDataTraits.routeCreatorToData$GetUlListItems(vsid)

      const routeName = RouteCreatorToDataTraits.routeCreatorToData$GetRouteName(vsid);
      const routePath = compose(merge({routeName}),fromPairs,map(addStringOrObjForEachListItem))(listItemsArr);

      return {routePath};

    };


    const mainEl = document.getElementById(mainSel);
    const routes =  createObjFromUl(mainEl.dataset.vsid);
    const obj = {routes};

    console.log("OBJ IS \n",JSON.stringify(obj));

    return obj;

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

}