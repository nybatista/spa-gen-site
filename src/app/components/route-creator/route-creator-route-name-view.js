import {ViewStream} from 'spyne';
import {FiltersTrait} from 'traits/filters-trait';
import {RouteCreatorTraits} from 'traits/route-creator-traits';
import {RouteAnimTraits} from 'traits/route-anim-traits';
import {RouteCreatorToDataTraits} from 'traits/route-creator-to-data-traits';

export class RouteCreatorRouteNameView extends ViewStream {

  constructor(props = {}) {
    props.class='route-creator-route-name hide';
    props.isActive = false;
    props.traits = [RouteAnimTraits, RouteCreatorTraits, RouteCreatorToDataTraits, FiltersTrait];
    props.template = require('./templates/route-creator-route-name.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    const filterUIClickForRouteName = this.filter$BarItemUIClickForRouteName();
    return [
      ['CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT', 'onItemEvent', filterUIClickForRouteName],
    ];
  }

  onItemEvent(e){
    const {holderId} = this.props;
    const {barId} = e.props();
    const ulLiSel = `#${barId} ul.route-bar-items-list`;
    const ulData = this.routeCreatorToData$GetUlData(ulLiSel);



    console.log("E IS ",{holderId,barId,ulData});
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.addChannel("CHANNEL_ROUTE_CREATOR");
  }

}