import {SpyneTrait} from 'spyne';
import {compose, fromPairs, toPairs} from 'ramda';
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
    console.log("BAR VSID ",{barId}, document.querySelector(`[data-vsid='${barId}']`));

    const ulLiSel = `[data-vsid='${barId}'] > ul.route-bar-items-list`;
    const ul = document.querySelector(ulLiSel);
    const ulData = compose(fromPairs,toPairs)(ul.dataset);
    const ulLiEls = ul.querySelectorAll(`${ulLiSel} > li`);
    const length = ulLiEls.length;
    return {ulData,length};

  }

  static routeCreatorToData$GetRouteName(vsid){
    const routeNamseSel = `[data-vsid='${barId}'] > div.route-bar-route-name input`;


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



    const createObjFromUl = (vsid)=>{
      const obj = generateRoutePathObj();

      const ul = RouteCreatorToDataTraits.routeCreatorToData$GetUlData(vsid);
      const routeName = '';

      console.log("UL IS ",ul);

    };


    const mainEl = document.getElementById(mainSel);

    const ul = createObjFromUl(mainEl.dataset.vsid);



    return mainEl;

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