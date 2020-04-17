import {SpyneTrait} from 'spyne';
import {RouteCreatorBarItemView} from '../components/route-creator/route-creator-bar-item-view';
import {RouteCreateBarHolder} from '../components/route-creator/route-creator-bar-holder';

export class RouteCreatorTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'routeCreator$';
    super(context, traitPrefix);

  }

  static routeCreator$CreateRouteBar(props=this.props){
    const {routeLevel, vsid} = props;
    const parentVsid = vsid;
    this.appendView(new RouteCreatorBarItemView({parentVsid, routeLevel}));
  }

  static routeCreator$CreateRouteBarHolder(){
    const routeLevel = this.props.routeLevel+1;
    const isMainHolder = routeLevel === 0;
    this.appendView(new RouteCreateBarHolder({routeLevel, isMainHolder}));
  }

  static routeCreator$InitBarItem(e){
    const addBarIdToAddBtn = (el)=>{
      el.dataset['barId'] = this.props.vsid;
    }

    const arr = this.props.el$('.route-bar-btn').arr;
    arr.forEach(addBarIdToAddBtn);


  }

}