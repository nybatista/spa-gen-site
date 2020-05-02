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
      dragInitDragItem: 'CHANNEL_ROUTE_CREATOR_INIT_DRAG_ITEM_EVENT',
      dragging: 'CHANNEL_ROUTE_CREATOR_DRAGGING_EVENT',
      dragSwapItems: 'CHANNEL_ROUTE_CREATOR_DRAGGING_SWAP_ITEMS_EVENT',
      dragEnd: 'CHANNEL_ROUTE_CREATOR_DRAG_END_EVENT'
    }
    return actionHash[str];
  }

  onDragEvent(e){
    const {dragEvent, payload} = e.props();
    const action = this.getDragEventAction(dragEvent);

    this.sendChannelPayload(action, payload);
   // console.log("DRAG EVENT ",{action,dragEvent,payload,e});

  }

  addRegisteredActions() {
    return [
      'CHANNEL_ROUTE_CREATOR_ROUTE_BAR_HOLDER_EVENT',
      'CHANNEL_ROUTE_CREATOR_ROUTE_LASTITEM_RENDERED_EVENT',
      'CHANNEL_ROUTE_CREATOR_DRAG_START_EVENT',
      'CHANNEL_ROUTE_CREATOR_INIT_DRAG_ITEM_EVENT',
      'CHANNEL_ROUTE_CREATOR_ITEM_ADDED_EVENT',
      'CHANNEL_ROUTE_CREATOR_ITEM_REMOVED_EVENT',
      'CHANNEL_ROUTE_CREATOR_DRAGGING_EVENT',
      'CHANNEL_ROUTE_CREATOR_DRAGGING_UPDATE_EVENT',
      'CHANNEL_ROUTE_CREATOR_DRAGGING_SWAP_ITEMS_EVENT',
      'CHANNEL_ROUTE_CREATOR_DRAG_END_EVENT',
      ['CHANNEL_ROUTE_CREATOR_DRAG_EVENT', 'onDragEvent']
    ];
  }

  onViewStreamInfo(obj) {
    let {data,payload,action} = obj.props();

    //console.log("DATA RETURNED ", {action,payload});

    const allowedActionsArr = [
        'CHANNEL_ROUTE_CREATOR_ROUTE_LASTITEM_RENDERED_EVENT',
        'CHANNEL_ROUTE_CREATOR_ITEM_ADDED_EVENT',
        'CHANNEL_ROUTE_CREATOR_ITEM_REMOVED_EVENT'];
    if (allowedActionsArr.indexOf(action)>=0){
     this.onSendPayload(action,payload);
    }


  }

  onSendPayload(actionStr, payload = {}) {
    const action = this.channelActions[actionStr];
    const srcElement = {};
    const event = undefined;
    this.sendChannelPayload(action, payload, srcElement, event);
  }

}