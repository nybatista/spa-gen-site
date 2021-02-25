import {SpyneTrait} from 'spyne';
import {RouteCreatorBarItemView} from 'main_components/route-creator/route-creator-bar-item-view';
import {RouteCreateBarHolder} from 'main_components/route-creator/route-creator-bar-holder';
import {RouteCreatorRouteNameView} from 'main_components/route-creator/route-creator-route-name-view';
import {omit,path,clone, filter,last,either,defaultTo, reduceRight, nth, hasPath, toPairs, compose,values, prop,keys, is, forEachObjIndex, mapObjIndexed} from 'ramda';
import {gsap} from "gsap/all";

export class RouteCreatorTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'routeCreator$';
    super(context, traitPrefix);

  }

  static routeCreator$SanitizeInput(inputEl, routeLevel=0){
    let value = prop('value', inputEl);
    let defaultVal = routeLevel === 0 ? 'menu' : "submenu";
    //value = value || 'menu';
    let sanitizedVal = String(value).replace(/([\W^\-])/g, "")
    //console.log('vaoue is ', {value,sanitizedVal, routeLevel}, inputEl);
    let isDefined = sanitizedVal !== undefined && sanitizedVal !== "";
    return isDefined ? sanitizedVal : defaultVal;

  }

  static routeCreator$CreateRouteBar(props=this.props, data, autoInit=false){
    const {routeLevel, vsid, subNavHolder, menuNameInc} = props;
    const parentVsid = vsid;

    const liEls$ = this.props.el$(`li.group-${vsid}`)
    const len = liEls$.exists === true ? liEls$.arr.length+1 : 1;
    const defaulRoutePathName = path(['data','routePath','routeName'], props);
    const defaultMenuVal = routeLevel === 0 ? 'menu' : 'sub-menu';

    if (data===undefined){
      data = {
        key: defaulRoutePathName,
        keyValue: `${defaultMenuVal}-${len}`,
        routePath: undefined
      }
    }

    data['masterItem']=subNavHolder;

    this.appendView(new RouteCreatorBarItemView({parentVsid, autoInit, routeLevel, data}));
  }

  static routeCreator$CreateRouteBarHolder(data=this.props.data, autoInit=false){
    const routeLevel = this.props.routeLevel+1;
    const isMainHolder = routeLevel === 0;
    const appendSelector = isMainHolder === true ? '#route-creator-container' : undefined;
    const subNavHolder = this.props.vsid;
    this.appendView(new RouteCreateBarHolder({routeLevel, subNavHolder, isMainHolder, autoInit, data}), appendSelector);
  }

  static routeCreator$CreateRouteName(d=this.props.data){
    const routeLevel = this.props.routeLevel+1;

    const routeNameVal = path(['routePath', 'routeName'], d);

    const isMainHolder = routeLevel === 0;
    const holderId =  isMainHolder === true ? 'main' : this.props.vsid;

    const data = {routeNameVal}
    const appendSel = isMainHolder === true ? '#route-creator-container' : undefined;
    this.appendView(new RouteCreatorRouteNameView({routeLevel, data, holderId, isMainHolder}), appendSel);
  }


  static routeCreator$ReorderChildElements(props=this.props, sorter=this.props.barItemsSorter){
    const els = sorter.itemsArr.reverse();
    const addEachItemInOder = (el)=> this.props.el.insertBefore(el, this.props.el.firstElementChild);
    els.forEach(addEachItemInOder);
  }


  static routeCreator$ConformBarItemsData(){
    const conformBarItemsData = (value,key,d)=>{
      const keyValue = is(String, value) === false ? key : value;
      const {routePath, lastItem} = value;
      const data = {
        key,
        keyValue,
        routePath,
        lastItem
      }
     // console.log('DSATS IS ',{data})
      return data;
    }

    return compose(mapObjIndexed(conformBarItemsData),omit(['routeName', '404']))(this.props.data.routePath);

  }


  static routeCreator$GetRouteDataFromConfig(){
    const routes = compose(clone, path(['Spyne','config', 'channels', 'ROUTE', 'routes']))(window);

    return RouteCreatorTraits.routeCreator$SetLastItemInObj({routes});
  }


  static routeCreator$SetLastItemInObj(obj){

    const reduceToFindLastItem = (reduceObj)=>{

      const getLastValFromRoutePath = (o)=>{
        const lastItem = compose(nth(1),last,toPairs,omit(['routeName', '404']), prop('routePath'))(o);
        if (is(String, lastItem)===true){
          o['lastItem'] = lastItem;
        } else if (is(Object, lastItem)){
          getLastValFromRoutePath(lastItem);
        }
        return o;
      }

      return getLastValFromRoutePath(reduceObj);
    }

     const updatedRoutes = reduceToFindLastItem(clone(obj.routes));


/*    const nestedArr = []
    let lastProp;
    const pluckPathVal = (val, key)=>{
      // OMIT routeName
      const props = omit(['routeName', '404'], val);
      // CHECK IF THERE ARE ANY NESTED OBJECTS
      const getLastObjKey = compose(last,keys, filter(hasPath(['routePath', 'routeName'])))(props);
      if (getLastObjKey!==undefined){
        // KEEP LOOPING LAST FOUND OBJECT
        nestedArr.push(getLastObjKey);
        pluckPathVal(val[getLastObjKey].routePath)
      } else{
        // ADD lastItem Prop WHEN THERE ARE NO LONGER ANY NESTED ITEMS
         lastProp = compose(last,keys)(val);;
      }

    }
    // START LOOP WITH MAIN ROUTE PATH
    const routeObj = obj.routes.routePath;
    pluckPathVal(routeObj);

    // ADD THE LAST ITEM PROP AND ADD PARSED ROUTEPATH OBJ
    path(nestedArr, routeObj)['lastItem']=lastProp;

    console.log("SET LAST ITEM IS ",{nestedArr, lastProp, obj})
    obj.routes.routePath = routeObj;*/
    obj.routes = updatedRoutes;

    return obj;

  }

  static routeCreator$InitBarItem(e){
    const addBarIdToAddBtn = (el)=>{
      el.dataset['barId'] = this.props.vsid;
    }

     const addBtn$ =  this.props.el$('.add-subnav');
    const updateMasterItem = el=>el.dataset['masterItem']=this.props.vsid;

      addBtn$.arr.forEach(updateMasterItem);



    const arr = this.props.el$('.route-bar-btn').arr;
    arr.forEach(addBarIdToAddBtn);

  }

  static routeCreator$GetListItems$(props=this.props){
    return this.props.el$(`li.group-${this.props.id}`);
  }

}
