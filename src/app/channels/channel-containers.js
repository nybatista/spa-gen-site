import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Channel, ChannelPayload, ChannelPayloadFilter} from 'spyne';

export class ChannelContainers extends Channel {

  constructor(name, props = {}) {
    name='CHANNEL_CONTAINERS';
    props.sendCachedPayload = false;
    props.revealContainerBool = false;
    super(name, props);

  }

  onRegistered() {

    const containerPayloadFilter = new ChannelPayloadFilter({props:{
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

  onCustomizeDraggerUpdated(e){
    const action = 'CHANNEL_CONTAINERS_DRAG_EVENT';
    const {payload} = e;
    this.sendChannelPayload(action, payload);

  }

  onContainerEvent(e){
    const {eventType,type,value} = e.props();
    //console.log("CONTAINER EVENT ", {eventType,type,value})
    const action = ChannelContainers.getContainerActionByEvent(type);
    const payload = {eventType,type,value};
    if (action === "CHANNEL_CONTAINERS_TOGGLE_MAIN_CONTAINER_EVENT"){
      this.props.revealContainerBool = !this.props.revealContainerBool;
      payload['revealContainerBool'] = this.props.revealContainerBool;
    }
    this.sendChannelPayload(action, payload);
  }

  onHideCustomContainer(e){
    const action = "CHANNEL_CONTAINERS_TOGGLE_MAIN_CONTAINER_EVENT";
    const type="toggleMain", value="true", eventType="container";
    const payload = {eventType,type,value};
    this.props.revealContainerBool = false;
    payload['revealContainerBool'] = this.props.revealContainerBool;
    this.sendChannelPayload(action, payload);

  }


  addRegisteredActions() {
    return [

        'CHANNEL_CONTAINERS_TOGGLE_MAIN_CONTAINER_EVENT',
        'CHANNEL_CONTAINERS_DRAG_EVENT',
        ['CHANNEL_CONTAINERS_HIDE_CUSTOM_CONTAINER_EVENT', 'onHideCustomContainer'],
        ['CHANNEL_CONTAINERS_DRAG_UPDATED_EVENT', 'onCustomizeDraggerUpdated']

    ];
  }

  onViewStreamInfo(obj) {
    let data = obj.props();
  }

  onSendPayload(actionStr, payload = {}) {
    const action = this.channelActions[actionStr];
    const srcElement = {};
    const event = undefined;
    this.addChannel("CHANNEL_CONTAINERS");
    this.sendChannelPayload(action, payload, srcElement, event);
  }

}