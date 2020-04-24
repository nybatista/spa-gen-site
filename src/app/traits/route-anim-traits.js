import {SpyneTrait} from 'spyne';
import {gsap} from 'gsap/all';

export class RouteAnimTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'routeAnim$';
    super(context, traitPrefix);

  }

  static routeAnim$GetBarItems(props=this.props, ulId){
   const sel = ulId === undefined ? '#route-creator-container li' : `#${ulId} > li`;
   return props.el$(sel);
  }


  static routeAnim$InitBarItemsAnimation(){
    const allLiItemsEl = this.routeAnim$GetBarItems().el;
    //console.log("ALL ITEMS EL ",{allLiItemsEl})
    gsap.to(allLiItemsEl, .25, {opacity:1, stagger:.02, ease:"Power1.easeInOut"});

  }

  static routeAnim$CreateBarPosWatcher(){

  }

}