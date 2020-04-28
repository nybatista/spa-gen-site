import {SpyneTrait} from 'spyne';
import {RouteCreatorBarItemView} from 'components/route-creator/route-creator-bar-item-view';
import {RouteCreateBarHolder} from 'components/route-creator/route-creator-bar-holder';
import {omit, filter,last,either, hasPath, compose,values, prop,keys, is, forEachObjIndex, mapObjIndexed} from 'ramda';
import {gsap} from "gsap/all";

export class RouteCreatorTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'routeCreator$';
    super(context, traitPrefix);

  }

  static routeCreator$CreateRouteBar(props=this.props, data){
    const {routeLevel, vsid} = props;
    const parentVsid = vsid;
    if (data===undefined){
      data = {
        key:"routePathId",
        keyValue: "menu-name",
        routePath: undefined
      }
    }


    this.appendView(new RouteCreatorBarItemView({parentVsid, routeLevel, data}));
  }

  static routeCreator$CreateRouteBarHolder(data=this.props.data.routePath){
    const routeLevel = this.props.routeLevel+1;
    const isMainHolder = routeLevel === 0;
    const appendSelector = isMainHolder === true ? '#route-creator-container' : undefined;
    this.appendView(new RouteCreateBarHolder({routeLevel, isMainHolder, data}), appendSelector);
  }


  static routeCreator$ConformBarItemsData(){
    const conformBarItemsData = (value,key,d)=>{
      const keyValue = is(String, value) === false ? key : value;
      const {routePath} = value;
      const data = {
        key,
        keyValue,
        routePath
      }
     // console.log('DSATS IS ',{data})
      return data;
    }

    return compose(mapObjIndexed(conformBarItemsData),omit(['routeName']))(this.props.data);

  }


  static routeCreatorSetLastItemInObj(obj){
    //console.log("obj is ",obj);
    const nestedPathArr = [];


    const pluckPathVal = (val, key)=>{
      const props = omit(['routeName'], val);
      const getLastObjKey = compose(last,keys, filter(hasPath(['routePath', 'routeName'])))(props);
      console.log('props getlast obj',getLastObjKey)
      if (getLastObjKey!==undefined){
        //nestedPathArr.push(getLastObjKey);

        pluckPathVal(val[getLastObjKey].routePath)
      } else{
        const getLastProp = compose(last,keys)(val);
        val['lastItem'] = getLastProp;
       // nestedPathArr.push(getLastProp)
      }

    }
      pluckPathVal(obj);
    console.log("NESTED PATH \n",JSON.stringify(obj));

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