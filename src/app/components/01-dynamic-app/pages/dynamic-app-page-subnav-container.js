import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {DynamicAppPageTraits} from 'traits/dynamic-app-page-traits';
import {DynamicAppPageSubnavContent} from 'components/01-dynamic-app/pages/dynamic-app-page-subnav-content';
import {merge} from 'ramda';

export class DynamicAppPageSubnavContainer extends ViewStream {

  constructor(props = {}) {
    props.tagName='section';
    props.class='dynamic-app-page-subnav-container';
    props.traits= DynamicAppPageTraits;
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
   // const {subNavRouteKey, subNavRouteValue} = this.props.data;
    const subNavChangeFilter = new ChannelPayloadFilter({
      propFilters: {
        routeData: (v) => v[this.props.data.subNavRouteKey]!==this.props.data.subNavRouteValue
      }
    })

    return [
      ['CHANNEL_DYNAMIC_APP_ROUTE_SUBNAV_CHANGE_EVENT', 'onSubnavChangeEvent',subNavChangeFilter]
    ];
  }

  onSubnavChangeEvent(e){
    const {routeData} = e.props();
    this.props.data.subNavRouteValue = routeData[this.props.data.subNavRouteKey];
    const {subNavRouteValue, subNavRouteKey} = this.props.data;
    const data = merge(routeData, {subNavRouteKey,subNavRouteValue});
    console.log("ROUTE DATA ", {data})
    this.addSubNavContent(data);

  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  addSubNavContent(data){
    this.appendView(new DynamicAppPageSubnavContent({data}));
  }

  onRendered() {
    console.log("SUB NAV ROUTE CONTAINER ",this.props);
    this.addSubNavContent(this.props.data);
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");

  }

}