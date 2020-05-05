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

  static routeCreator$CreateRouteBar(props=this.props, data, autoInit=false){
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


    this.appendView(new RouteCreatorBarItemView({parentVsid, autoInit, routeLevel, data}));
  }

  static routeCreator$CreateRouteBarHolder(data=this.props.data, autoInit=false){
    const routeLevel = this.props.routeLevel+1;
    const isMainHolder = routeLevel === 0;
    const appendSelector = isMainHolder === true ? '#route-creator-container' : undefined;
    const subNavHolder = this.props.vsid;
    this.appendView(new RouteCreateBarHolder({routeLevel, subNavHolder, isMainHolder, autoInit, data}), appendSelector);
  }

  static routeCreator$ReorderChildElements(props=this.props, sorter=this.props.barItemsSorter){
    const els = sorter.itemsArr.reverse();

    const firstElSel = `li.group-${this.props.vsid}`;
    const firstInsert = (el)=>{
      const beforeEl = this.props.el$(firstElSel).el;
      console.log("BEFORE EL ", {beforeEl},this.props.el.firstElementChild);
      this.props.el.insertBefore(el,this.props.el$(firstElSel).el);
    }

    //const tempLi = document.createElement('li');
   // tempLi.setAttribute('id', 'temp-id');
   // this.props.el.appendChild(tempLi);
  //  this.props.el.insertBefore(this.props.el.childNodes[0], tempLi);

    const addEachItemInOder = (el,i, arr)=>{
    //  let beforeEl = i === 0 ? tempLi : arr[i=1];
    //  const isSameNode = beforeEl.isEqualNode(el);
      const beforeEl = this.props.el.firstElementChild;
      console.log("BEFORE EL ",{beforeEl, el});
        this.props.el.insertBefore(el, beforeEl);
      //this.props.el.insertBefore(beforeEl, el);

     // const beforeEl = this.props.el.firstElementChild;
     // console.log("BEFORE EL ",{beforeEl, el});
/*      if (isSameNode === false) {
        this.props.el.insertBefore(beforeEl, el);
      } else{
        beforeEl = this.props.el.firstElementChild.nextSibling;
        this.props.el.insertBefore(beforeEl, el);
      }*/
      /*  if (i===0){
        this.props.el.insertBefore(el, this.props.el.firstElementChild);
      } else{
        const beforeItem = arr[i-1].el;
        this.props.el.insertAfter(beforeItem, el);
      }
*/
      console.log("EL IS I ",{i,el, beforeEl});
    }

    console.log("ELS ARE ", {els});

    els.forEach(addEachItemInOder);


    const updatedEls = this.props.el$(firstElSel).arr

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