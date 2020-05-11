import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Channel, ChannelPayload, ChannelPayloadFilter} from 'spyne';

export class ChannelContainers extends Channel {

  constructor(name, props = {}) {
    name='CHANNEL_CONTAINERS';
    props.sendCachedPayload = false;
    super(name, props);

  }

  onRegistered() {

    const containerPayloadFilter = new ChannelPayloadFilter({propFilters:{
        eventType: "container"
      }})


    this.getChannel("CHANNEL_UI", containerPayloadFilter)
    .subscribe(this.onContainerEvent.bind(this));




  }

  onContainerEvent(e){
    const {eventType,type,value} = e.props();
    console.log("CONTAINER EVENT ", {eventType,type,value})

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