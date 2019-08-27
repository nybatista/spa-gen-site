import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Channel} from 'spyne';
import {ChannelPayloadFiltersTraits} from '../traits/channel-payload-filter-traits';

export class NodeListChannel extends Channel {

  constructor(name, props = {}) {
    props.sendCachedPayload = false;
    props.traits = ChannelPayloadFiltersTraits;
    super(name, props);

  }


  onUIClick(e){

   // console.log("on ui click ",e.props());
  }

  onRegistered() {
    this.ui$Channel = this.getChannel("CHANNEL_UI", this.filter$onClickNodeItemsFilter());

    this.ui$Channel
        .subscribe(this.onUIClick.bind(this));


  }

  addRegisteredActions() {
    return [
      'CHANNEL_NODE_LIST_ADD_ITEM_EVENT',
      'CHANNEL_NODE_LIST_ITEM_ADDED_EVENT',
      'CHANNEL_NODE_LIST_REMOVE_ITEM_EVENT'
      ];
  }

  onIncomingViewStreamInfo(obj) {
    let {type,id} = obj.props();

    console.log("TYPE ID ",{type,id},obj.props())
  }

  onSendPayload(actionStr, payload = {}) {
    const action = this.channelActions[actionStr];
    const srcElement = {};
    const event = undefined;
    this.sendChannelPayload(action, payload, srcElement, event);
  }

}