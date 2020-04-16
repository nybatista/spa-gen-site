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

  }

  addRegisteredActions() {
    return [];
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