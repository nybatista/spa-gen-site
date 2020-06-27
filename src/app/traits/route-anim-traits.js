import {SpyneTrait} from 'spyne';
import {BarItemsSorter} from 'main_components/other/bar-items-sorter';
import {pluck} from 'ramda';
import {gsap} from 'gsap/all';
import {compose,head,filter,propEq} from 'ramda';

export class RouteAnimTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'routeAnim$';
    super(context, traitPrefix);

  }


  static routeAnim$GetSwapData(data, vsid){
    return compose(head,filter(propEq('id', vsid)))(data);
  }


  static routeAnim$GetBarItems(props=this.props, ulId){
   const sel = ulId === undefined ? '#route-creator-container li' : `li.group-${ulId}`;
   //console.log("SELCTOR ",{sel, ulId})
   return props.el$(sel);
  }

  static routeAnim$CreateAnimInTimeline(){
    const container$ = this.props.el$("#route-creator-container").el;
    const title$ = this.props.el$(".route-creator-title").el;
    const mainBtn$ = this.props.el$("#route-gen-main-btn").el;
    const routeBtn$ = this.props.el$(".main-route-btn").el;
    const routeNameLabel$ = this.props.el$("#route-creator-container > .route-creator-route-name").el;
    const tl = gsap.timeline();


    const barItems$ = this.props.el$(".route-creator-bar-item.route-level-0").arr;
    const setItems = (el)=>{
      //console.log("EL IS ",{el})
      tl.to(el, {opacity:0, duration:0})
    }
    [container$, title$, mainBtn$, routeBtn$, routeNameLabel$].forEach(setItems);
    barItems$.forEach(setItems);
    const baseTime = .25;
    tl.addLabel('start', .5);

    tl.to(container$, {duration:.75, opacity:1});
    tl.to(title$, {duration:baseTime, opacity:1}, "start");
    tl.to(routeNameLabel$, {duration:baseTime, opacity:1}, "start");
    tl.to(mainBtn$, {duration:baseTime, opacity:1}, "start");
    tl.to(routeBtn$, {duration:baseTime, opacity:1}, "start");
    tl.to(barItems$, {duration:.2, opacity:1, stagger:.12, ease:"Power1.easeOut"}, "start");



    return tl;
  }


  static routeAnim$AnimateInRouteCreator(bool, props=this.props){
    props.mainRouteTL = this.routeAnim$CreateAnimInTimeline();
    bool === true ? props.mainRouteTL.play() : props.mainRouteTL.reverse('start');


  }

  static routeAnim$GetBarItemHeight(el){

    const elBox = el.getBoundingClientRect();
    const elTop = elBox.top;
    const elHeight = elBox.height;
    const els =  el.querySelectorAll('.route-bar-items-list li');
    const elsArr = Array.from(els);
    let padBottom = 20;
    const arrLen = elsArr.length
    if (arrLen===0){
      return `height:${elHeight}px`;
    } else if (arrLen===1){
      padBottom=20;
    }



    const elIndex = arrLen>=1 ? arrLen-1 : 0;
    const lastEl = elsArr[arrLen- 1];

    const box = lastEl.getBoundingClientRect();
    let newHeight = (box.y + box.height)-elTop;
    //newHeight = arrLen > 1 ? newHeight+20 : newHeight;

    //console.log("ELS IS ",{newHeight, elTop,els,elsArr,arrLen,lastEl});

    return `height:${newHeight+padBottom}px;`;;


  }



  static routeAnim$InitBarItemsAnimation(){
    const allLiItemsEl = this.routeAnim$GetBarItems().el;
    //console.log("ALL ITEMS EL ",{allLiItemsEl})
    gsap.to(allLiItemsEl, .25, {opacity:1, stagger:.02, ease:"Power1.easeInOut"});

  }
  static routeAnim$ItemAnimateToYVal(yVal){
    gsap.to(this.props.el, {duration:.125, y:yVal, ease:"Power1.easeInOut"});
  }

  static routeAnim$ItemAnimateIn(yVal){
    this.props.el$.addClass('anim-mode');
    const opacityNum = this.props.autoInit === true ? 0 : 1;

    //console.log("animate In ", this.props.el);
    this.props.autoInit=false;
    gsap.to(this.props.el, {duration:.125, opacity:opacityNum, y:yVal, ease:"Power1.easeInOut"});

  }

  static routeAnim$RemoveItemFromSorter(id, sorter=this.props.barItemsSorter){
    return sorter.removeItemFromArr(id);
  }

  static routeAnim$AddItemToSorter(el, sorter=this.props.barItemsSorter, isContainer){
    return sorter.addItemToArr(el);
  }


  static routeAnim$ItemAnimateOutAndDispose(){
    const onDispose = ()=>{
      this.sendRenderedEvent(false);
      this.disposeViewStream();
     // this.setTimeout(this.disposeViewStream.bind(this), 0);
    }
      gsap.to(this.props.el, {duration:.125, opactiy:0, onComplete:onDispose})
  }


  static routeAnim$GetDraggerItemData(barItemsSorter = this.props.barItemsSorter){
    return barItemsSorter.getDraggerObj();
  }

  static routeAnim$OnDragStart(dragVsid, barItemsSorter=this.props.barItemsSorter){
    // barItemSorter.draggerId = dragVsid;
    return barItemsSorter.setDraggerObj(dragVsid);
  }


  static routeAnim$OnDragging(y,vsid,barItemsSorter=this.props.barItemsSorter){
    //console.log("Y DRAG ",{y,vsid,barItemsSorter});
    return barItemsSorter.updateBarItemsSorter(y);
  }


  static routeAnim$OnDragEnd(){

  }



  static routeAnim$CreateBarItemsSorter(dragVsid){
      const liItems = this.routeAnim$GetBarItems(this.props, this.props.vsid);
      this.props.liItems = liItems.exists === true ? liItems : [];
      const disableFirstItem = this.props.routeLevel === 0;
      this.props.barItemsSorter = new BarItemsSorter(liItems.nodeList, dragVsid, disableFirstItem);
      const {sortArr} = this.props.barItemsSorter;

      //console.log("SORT ARR ",{sortArr, liItems}, this.props.barItemsSorter);

      liItems.addClass('anim-mode');
      const initGsapPos = (obj)=>{
          const {el, yGsap} = obj;
          gsap.set(el, {y:yGsap});
         // console.log(obj)
      }
      sortArr.forEach(initGsapPos);
  }

}