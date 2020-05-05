import {SpyneTrait} from 'spyne';
import {compose, fromPairs, toPairs} from 'ramda';
export class RouteCreatorToDataTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'routeCreatorToData$';
    super(context, traitPrefix);

  }

  static routeCreatorToData$GetUlData(ulSelector){
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

  static routeCreatorToData$GetDefaultRouteName(str){
    /**
     *  TODO: STRING FROM kebobCase to camelCase
     *  + Id
     *
     */

  }

}