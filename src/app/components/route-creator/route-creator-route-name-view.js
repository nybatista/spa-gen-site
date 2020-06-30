import {ViewStream} from 'spyne';
import {FiltersTrait} from 'traits/filters-trait';
import {RouteCreatorTraits} from 'traits/route-creator-traits';
import {RouteAnimTraits} from 'traits/route-anim-traits';
import {RouteCreatorToDataTraits} from 'traits/route-creator-to-data-traits';
import {pathEq} from 'ramda';

export class RouteCreatorRouteNameView extends ViewStream {

  constructor(props = {}) {
    props.class='route-creator-route-name';
    props.isActive = -1;
    props.initShow = false;
    props.traits = [RouteAnimTraits, RouteCreatorTraits, RouteCreatorToDataTraits, FiltersTrait];
    props.data.routeNameVal = props.routeLevel === 1 && props.data.routeNameVal !== undefined ? 'topicId' : props.data.routeNameVal;
    console.log("ROUTE NAME PROPS VALUE ",props.data,props);

    props.template = require('./templates/route-creator-route-name.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    const filterUIClickForRouteName = this.filter$BarItemUIClickForRouteName();
    return [
      ['CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT', 'onItemEvent',filterUIClickForRouteName],
        ['CHANNEL_ROUTE_CREATOR_GENERATE_DEFAULT_JSON_EVENT', 'disposeViewStream']
    ];
  }

  onItemEvent(e){
    const {holderId,masterItem,barId,routeBarEvent} = e.props();
    const masterElSel = `[data-vsid='${masterItem}']`;;
    const masterEl = document.querySelector(masterElSel);
    //console.log("route Name IS ",{masterElSel, masterEl,holderId,barId,routeBarEvent,e})

      const isDelete = routeBarEvent === 'delete';
     this.checkIfRouteIsActive(isDelete);
  }
  updateRouteNameVal(str){
    // SETTING DEFAULT TO topicId;
    str = 'topicId';

    this.props.el$('input').el.value = str;
  }

  checkIfRouteIsActive(isDelete=false){

    const {holderId, isActive} = this.props;
    const ulData = this.routeCreatorToData$GetUlData(holderId);
    let num = isDelete === true ? ulData.length-1 : ulData.length;
    const currentActiveMode = num>=1;
    const activeModeHasChanged = currentActiveMode !== isActive;

    if (activeModeHasChanged===true){
      this.props.isActive = currentActiveMode;
      const delayToggle = ()=>this.props.el$.toggleClass('show', this.props.isActive);
      this.setTimeout(delayToggle, 300);

      if (this.props.isActive===true){
        if (this.props.initShow===true || this.props.data.routeNameVal === undefined) {
          const routeNameValue = this.routeCreatorToData$GetDefaultRouteName();
          this.updateRouteNameVal(routeNameValue);
        }

        this.props.initShow=true;
       // console.log("ROUTE NAME VALUE ",{routeNameValue});
      }

    }
    //console.log("E IS ",{currentActiveMode,activeModeHasChanged,isActive,holderId,ulData});

  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.checkIfRouteIsActive();
    this.addChannel("CHANNEL_ROUTE_CREATOR");

    const routeNameValIsPageId = pathEq(['props','data','routeNameVal'], 'pageId')(this);
    this.props.el$.toggleClass('disable', routeNameValIsPageId);


    //console.log("CHECKING ROUTE NAME ",{routeNameValIsPageId},this.props);
  }

}