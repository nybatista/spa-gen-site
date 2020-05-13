import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Channel, ChannelPayloadFilter} from 'spyne';

export class ChannelDynamicAppRoute extends Channel {

  constructor(name, props = {}) {
    name = 'CHANNEL_DYNAMIC_APP_ROUTE';
    props.sendCachedPayload = false;
    super(name, props);

  }

  onRegistered() {
    const channelRouteUpdateFilter = new ChannelPayloadFilter({
      propFilters: {
        action: "CHANNEL_ROUTE_CONFIG_UPDATED_EVENT",

      }

    });



    this.getChannel("CHANNEL_ROUTE", channelRouteUpdateFilter)
        .subscribe(this.onChannelRouteUpdateEvent.bind(this));


  }


  onAddSubnavEvent(e){
    const {payload} = e;
    const action = "CHANNEL_DYNAMIC_APP_ROUTE_ADD_SUBNAV_EVENT";
    this.sendChannelPayload(action, payload);

  }


  onChannelRouteUpdateEvent(e){
    const {payload} = e;
    const action = "CHANNEL_DYNAMIC_APP_ROUTE_CONFIG_UPDATED_EVENT";
    this.sendChannelPayload(action, payload);

  }

  addRegisteredActions() {
    return [
      'CHANNEL_DYNAMIC_APP_ROUTE_CONFIG_UPDATED_EVENT',
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