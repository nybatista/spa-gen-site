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

    console.log("on ui click ",e.props());
  }

  onRegistered() {
    this.ui$Channel = this.getChannel("CHANNEL_UI", this.filter$onClickNodeItemsFilter());

    this.ui$Channel
        .subscribe(this.onUIClick.bind(this));


  }

  onNodeListCreated(e){
    const {nodeListEl, rowHeight} = e.props();
    this.props.nodeListEl = nodeListEl;
    this.props.rowHeight = rowHeight;
  }
  onResetContainerHeights(e){

  }



  addRegisteredActions() {
    return [
      'CHANNEL_NODE_LIST_ADD_ITEM_EVENT',
      'CHANNEL_NODE_LIST_ITEM_ADDED_EVENT',
      'CHANNEL_NODE_LIST_REMOVE_ITEM_EVENT',
      ['CHANNEL_NODE_LIST_CREATED_EVENT', 'onNodeListCreated'],
      'CHANNEL_NODE_LIST_FIRST_LOADED_EVENT',
      'CHANNEL_NODE_LIST_ADD_NEW_ITEM_EVENT',
      'CHANNEL_NODE_LIST_AFTER_ADD_NEW_ITEM_EVENT',
      'CHANNEL_NODE_LIST_CONTAINER_REORDER_EVENT',
      ['CHANNEL_NODE_LIST_AFTER_CONTAINER_REORDERED_EVENT', 'onResetContainerHeights'],
      'CHANNEL_NODE_LIST_ITEM_CLICKED_EVENT',
      'CHANNEL_NODE_LIST_ITEM_CLICK_TEST_EVENT',
      'CHANNEL_NODE_LIST_ITEM_UP_EVENT',
      'CHANNEL_NODE_LIST_REMOVE_ITEM_EVENT',
      'CHANNEL_NODE_LIST_AFTER_REMOVE_ITEM_EVENT',
      'CHANNEL_NODE_LIST_ADD_NEW_SUBITEM_EVENT',
      'CHANNEL_NODE_LIST_AFTER_ADD_NEW_SUBITEM_EVENT',
      'CHANNEL_NODE_LIST_CLICKED_SUBITEM_EVENT'
    ];
  }

  static getAutoActions(){
    return [
      'CHANNEL_NODE_LIST_CREATED_EVENT',
      'CHANNEL_NODE_LIST_FIRST_LOADED_EVENT',
      'CHANNEL_NODE_LIST_ADD_NEW_ITEM_EVENT',
      'CHANNEL_NODE_LIST_AFTER_ADD_NEW_ITEM_EVENT',
      'CHANNEL_NODE_LIST_ITEM_CLICKED_EVENT',
      'CHANNEL_NODE_LIST_ITEM_CLICK_TEST_EVENT',
      'CHANNEL_NODE_LIST_ITEM_UP_EVENT',
      'CHANNEL_NODE_LIST_REMOVE_ITEM_EVENT',
      'CHANNEL_NODE_LIST_AFTER_REMOVE_ITEM_EVENT',
      'CHANNEL_NODE_LIST_ADD_NEW_SUBITEM_EVENT',
      'CHANNEL_NODE_LIST_AFTER_ADD_NEW_SUBITEM_EVENT',
      'CHANNEL_NODE_LIST_CLICKED_SUBITEM_EVENT'
    ]

  }



  static checkForAutoSendPayload(action){
     const arr = NodeListChannel.getAutoActions();
     return arr.indexOf(action)>=0;
  }

  onChannelNodeListInitialized(e){
    console.log("CHANNEL NODE INITIALIZED ",e);
  }

  onViewStreamInfo(obj) {
   // let {type,id} = obj.props();
    console.log("obj is ",obj);
   // console.log("TYPE ID ",{type,id},obj.props())
  }

  onSendPayload(actionStr, payload = {}) {
    const action = this.channelActions[actionStr];
    const srcElement = {};
    const event = undefined;
    this.sendChannelPayload(action, payload, srcElement, event);
  }

}