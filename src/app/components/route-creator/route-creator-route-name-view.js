import {ViewStream} from 'spyne';
import {FiltersTrait} from 'traits/filters-trait';
import {RouteCreatorTraits} from 'traits/route-creator-traits';
import {RouteAnimTraits} from 'traits/route-anim-traits';
import {RouteCreatorToDataTraits} from 'traits/route-creator-to-data-traits';

export class RouteCreatorRouteNameView extends ViewStream {

  constructor(props = {}) {
    props.class='route-creator-route-name';
    props.isActive = -1;
    props.traits = [RouteAnimTraits, RouteCreatorTraits, RouteCreatorToDataTraits, FiltersTrait];
    props.template = require('./templates/route-creator-route-name.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    const filterUIClickForRouteName = this.filter$BarItemUIClickForRouteName();
    return [
      ['CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT', 'onItemEvent',filterUIClickForRouteName],
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
      this.props.el$.toggleClass('show', this.props.isActive);

      if (this.props.isActive===true){
        const routeNameValue = this.routeCreatorToData$GetDefaultRouteName();
        this.updateRouteNameVal(routeNameValue);
        //console.log("ROUTE NAME VALUE ",{routeNameValue});
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
  }

}