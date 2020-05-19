import {ViewStream} from 'spyne';
import {FiltersTrait} from 'traits/filters-trait';
import {RouteAnimTraits} from 'traits/route-anim-traits';

export class RouteCreatorBarItemBackground extends ViewStream {

  constructor(props = {}) {
    props.class='bar-item-bg';
    props.testId = props.parentVsid;
    props.traits = [FiltersTrait, RouteAnimTraits];
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    const {parentVsid} = this.props;
    const checkForAnimatedItem = this.filter$CheckForSwappedItems({vsid:parentVsid});
    return [
        ['CHANNEL_ROUTE_CREATOR_ANIMATE_ITEM_EVENT', 'onAnimateItemEvent']
    ];
  }

  onAnimateItemEvent(e){
    /*const {payload, swapItemsIds,swapItems} = e.props();
    const {parentVsid, vsid} = this.props;
    const animateData = this.routeAnim$GetSwapData(swapItems, parentVsid);
    const {height} = animateData;

    console.log("ANIMATE EVENT ",{payload,swapItemsIds,parentVsid, animateData})
    this.props.el$.inline = `height:${height*.9}px`;*/

    this.setHeight();
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  setHeight(){
    const heightStr = this.routeAnim$GetBarItemHeight(this.props.el.parentElement);
    this.props.el$.inline=heightStr;
    console.log("HEIGHT STR IS ",heightStr);
  }

  onRendered() {
    this.setHeight();
    this.addChannel("CHANNEL_ROUTE_CREATOR");
  }

}