import {SpyneTrait} from 'spyne';
import {BarItemsSorter} from 'components/other/bar-items-sorter';
import {pluck} from 'ramda';
import {gsap} from 'gsap/all';

export class RouteAnimTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'routeAnim$';
    super(context, traitPrefix);

  }

  static routeAnim$GetBarItems(props=this.props, ulId){
   const sel = ulId === undefined ? '#route-creator-container li' : `li.group-${ulId}`;
   //console.log("SELCTOR ",{sel, ulId})
   return props.el$(sel);
  }


  static routeAnim$InitBarItemsAnimation(){
    const allLiItemsEl = this.routeAnim$GetBarItems().el;
    //console.log("ALL ITEMS EL ",{allLiItemsEl})
    gsap.to(allLiItemsEl, .25, {opacity:1, stagger:.02, ease:"Power1.easeInOut"});

  }


  static routeAnim$ItemAnimateIn(yVal){
    gsap.to(this.props.el, {duration:.125, y:yVal, ease:"Power1.easeInOut"});

  }

  static routeAnim$ItemAnimateOutAndDispose(){
    const onDispose = this.setTimeout(this.disposeViewStream.bind(this), 0);
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
      this.props.barItemsSorter = new BarItemsSorter(liItems.el, dragVsid);
      const {sortArr} = this.props.barItemsSorter;

      //console.log("SORT ARR ",{sortArr}, this.props.barItemsSorter)

      liItems.addClass('anim-mode');
      const initGsapPos = (obj)=>{
          const {el, yGsap} = obj;
          gsap.set(el, {y:yGsap});
         // console.log(obj)
      }
      sortArr.forEach(initGsapPos);
  }

}