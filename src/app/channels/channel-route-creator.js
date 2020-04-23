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

  getDragEventAction(str){
    const actionHash = {
      dragStart: 'CHANNEL_ROUTE_CREATOR_DRAG_START_EVENT',
      dragging: 'CHANNEL_ROUTE_CREATOR_DRAGGING_EVENT',
      dragEnd: 'CHANNEL_ROUTE_CREATOR_DRAG_END_EVENT'
    }
    return actionHash[str];
  }

  onDragEvent(e){
    const {dragEvent, payload} = e.props();
    const action = this.getDragEventAction(dragEvent);

    this.sendChannelPayload(action, payload);
   // console.log("PAYLOAD ",{action,dragEvent,payload,e});

  }

  addRegisteredActions() {
    return [
      'CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT',
      'CHANNEL_ROUTE_CREATOR_DRAG_START_EVENT',
      'CHANNEL_ROUTE_CREATOR_DRAGGING_EVENT',
      'CHANNEL_ROUTE_CREATOR_DRAG_END_EVENT',
     ['CHANNEL_ROUTE_CREATOR_DRAG_EVENT', 'onDragEvent']
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