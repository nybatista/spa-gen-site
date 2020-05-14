import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Channel, ChannelPayloadFilter} from 'spyne';
import {trim,path} from 'ramda';

export class ChannelDynamicAppRoute extends Channel {

  constructor(name, props = {}) {
    name = 'CHANNEL_DYNAMIC_APP_ROUTE';
    props.sendCachedPayload = true;
    props.updateConfigNum=0;
    super(name, props);

  }

  onRegistered() {
    const channelRouteUpdateFilter = new ChannelPayloadFilter({
      propFilters: {
        action: "CHANNEL_ROUTE_CONFIG_UPDATED_EVENT",
      }
    });

    const actionsArr = [
      'CHANNEL_ROUTE_DEEPLINK_EVENT',
      'CHANNEL_ROUTE_CHANGE_EVENT'
    ]

    const routeChangeFilter = new ChannelPayloadFilter({
      propFilters: {
        action:  (val)=>actionsArr.indexOf(val)>=0
      }
    })



    this.getChannel("CHANNEL_ROUTE", channelRouteUpdateFilter)
        .subscribe(this.onChannelRouteUpdateEvent.bind(this));



    this.getChannel("CHANNEL_ROUTE", routeChangeFilter)
    .subscribe(this.onRouteChangeEvent.bind(this));


  }

  onRouteChangeEvent(e){
    const action = "CHANNEL_DYNAMIC_APP_ROUTE_PAGE_CHANGE_EVENT";
    const {payload} = e;
    this.sendChannelPayload(action, payload);
  }


  onAddSubnavEvent(e){
    const {payload} = e;

    const action = "CHANNEL_DYNAMIC_APP_ROUTE_ADD_SUBNAV_EVENT";
    this.sendChannelPayload(action, payload);

  }
  incrementUpdateNum(){
    this.props.updateConfigNum++;
  }


  onChannelRouteUpdateEvent(e){
    this.incrementUpdateNum();

    const {payload} = e;
    const {updateConfigNum} = this.props;
    const routes = path(["window","Spyne","config","channels","ROUTE", 'routes'], window);
    const action = "CHANNEL_DYNAMIC_APP_ROUTE_CONFIG_UPDATED_EVENT";
    this.sendChannelPayload(action, {routes, updateConfigNum});

  }

  addRegisteredActions() {
    return [
      'CHANNEL_DYNAMIC_APP_ROUTE_CONFIG_UPDATED_EVENT',
      'CHANNEL_DYNAMIC_APP_ROUTE_PAGE_CHANGE_EVENT',
      'CHANNEL_DYNAMIC_APP_ROUTE_ADD_SUBNAV_EVENT'
    ];
  }

  onViewStreamInfo(obj) {
    let data = obj.props();
  }

  onSendPayload(actionStr, payload = {}) {
    const action = this.channelActions[actionStr];
    const srcElement = {};
    const event = undefined;
    this.sendChannelPayload(action, payload, srcElement, event);
  }

}