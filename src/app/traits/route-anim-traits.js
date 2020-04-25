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
   //console.log("SELCTOR ",{sel})
   return props.el$(sel);
  }


  static routeAnim$InitBarItemsAnimation(){
    const allLiItemsEl = this.routeAnim$GetBarItems().el;
    //console.log("ALL ITEMS EL ",{allLiItemsEl})
    gsap.to(allLiItemsEl, .25, {opacity:1, stagger:.02, ease:"Power1.easeInOut"});

  }

  static routeAnim$StartBarPosWatcher(dragVsid){
      const liItems = this.routeAnim$GetBarItems(this.props, this.props.vsid);
      this.props.barItemsSorter = new BarItemsSorter(liItems.el, dragVsid);
      const {sortArr} = this.props.barItemsSorter;

      liItems.addClass('anim-mode');
      const initGsapPos = (obj)=>{
          const {el, yGsap} = obj;
          gsap.set(el, {y:yGsap});
          console.log(obj)
      }
      sortArr.forEach(initGsapPos);
  }

}