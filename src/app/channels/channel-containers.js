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

  static getContainerActionByEvent(str){
    const actionsHash = {
      toggleMain: "CHANNEL_CONTAINERS_TOGGLE_MAIN_CONTAINER_EVENT"
    }
     return actionsHash[str];
  }

  onContainerEvent(e){
    const {eventType,type,value} = e.props();
    //console.log("CONTAINER EVENT ", {eventType,type,value})
    const action = ChannelContainers.getContainerActionByEvent(type);
    this.sendChannelPayload(action, {eventType,type,value});
  }

  addRegisteredActions() {
    return [

        'CHANNEL_CONTAINERS_TOGGLE_MAIN_CONTAINER_EVENT'

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