import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Channel, ChannelPayloadFilter} from 'spyne';

export class ChannelRouteCreator extends Channel {

  constructor(name, props = {}) {
    name='CHANNEL_ROUTE_CREATOR';
    props.sendCachedPayload = false;
    super(name, props);

  }

  onRegistered() {
    const payloadFilter = new ChannelPayloadFilter({propFilters:{
        type: "routeBar"
      }})

      this.getChannel("CHANNEL_UI", payloadFilter)
          .subscribe(this.onRouteBarUIEvent.bind(this));

  }

  onRouteBarUIEvent(e){
    const {holderId, barId, routeBarEvent} = e.props();
    const action = "CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT";
    this.sendChannelPayload(action, {holderId,barId,routeBarEvent});
   // console.log("ROUTE BAR EVENT ",{holderId,barId, routeBarEvent,e})
  }

  addRegisteredActions() {
    return [
        'CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT'
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