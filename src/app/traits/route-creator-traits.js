import {SpyneTrait} from 'spyne';
import {RouteCreatorBarItemView} from '../components/route-creator/route-creator-bar-item-view';
import {RouteCreateBarHolder} from '../components/route-creator/route-creator-bar-holder';
import {omit, compose, prop,keys, is, mapObjIndexed} from 'ramda';
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
      console.log('DSATS IS ',{data})
      return data;
    }

    return compose(mapObjIndexed(conformBarItemsData),omit(['routeName']))(this.props.data);

  }

  static routeCreator$InitBarItem(e){
    const addBarIdToAddBtn = (el)=>{
      el.dataset['barId'] = this.props.vsid;
    }
    this.props.data.initYPos = this.props.el.parentElement.offsetHeight+this.props.el.offsetHeight;
    console.log("INIT Y IS ",this.props.data.initYPos);
    gsap.set(this.props.el,{y: this.props.data.initYPos});

    const arr = this.props.el$('.route-bar-btn').arr;
    arr.forEach(addBarIdToAddBtn);


  }

}