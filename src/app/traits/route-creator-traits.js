import {SpyneTrait} from 'spyne';
import {RouteCreatorBarItemView} from 'components/route-creator/route-creator-bar-item-view';
import {RouteCreateBarHolder} from 'components/route-creator/route-creator-bar-holder';
import {omit,path, filter,last,either, hasPath, compose,values, prop,keys, is, forEachObjIndex, mapObjIndexed} from 'ramda';
import {gsap} from "gsap/all";

export class RouteCreatorTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'routeCreator$';
    super(context, traitPrefix);

  }

  static routeCreator$CreateRouteBar(props=this.props, data){
    const {routeLevel, vsid} = props;
    const parentVsid = vsid;
    const defaulRoutePathName = path(['data','routePath','routeName'], props);
    if (data===undefined){
      data = {
        key: defaulRoutePathName,
        keyValue: "menu-name",
        routePath: undefined
      }
    }


    this.appendView(new RouteCreatorBarItemView({parentVsid, routeLevel, data}));
  }

  static routeCreator$CreateRouteBarHolder(data=this.props.data){
    const routeLevel = this.props.routeLevel+1;
    const isMainHolder = routeLevel === 0;
    const appendSelector = isMainHolder === true ? '#route-creator-container' : undefined;
    const subNavHolder = this.props.vsid;
    this.appendView(new RouteCreateBarHolder({routeLevel, subNavHolder, isMainHolder, data}), appendSelector);
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

    return compose(mapObjIndexed(conformBarItemsData),omit(['routeName']))(this.props.data.routePath);

  }


  static routeCreator$SetLastItemInObj(obj){
    const nestedArr = []
    let lastProp;
    const pluckPathVal = (val, key)=>{
      // OMIT routeName
      const props = omit(['routeName'], val);
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
    obj.routes.routePath = routeObj;

    return obj;

  }

  static routeCreator$InitBarItem(e){
    const addBarIdToAddBtn = (el)=>{
      el.dataset['barId'] = this.props.vsid;
    }
    const arr = this.props.el$('.route-bar-btn').arr;
    arr.forEach(addBarIdToAddBtn);

  }

  static routeCreator$GetListItems$(props=this.props){
    return this.props.el$(`li.group-${this.props.id}`);
  }

}